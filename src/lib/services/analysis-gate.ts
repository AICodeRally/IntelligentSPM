/**
 * Analysis Gate Service
 *
 * Enforces business rules for analysis access:
 * - 1 analysis per email address
 * - 3 analyses per company domain
 * - Corporate email only (no personal emails)
 *
 * INTEGRATION: Uses GOCC Trust Layer when available for:
 * - Centralized policy evaluation
 * - PII redaction before storage
 * - Immutable audit trail (Spine)
 *
 * @see docs/UNIVERSAL_SERVICES_INTEGRATION.md
 */

import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';
import type { User, Company } from '@prisma/client';
import {
  evaluatePolicy,
  recordAudit,
  userActor,
  systemActor,
  isGOCCConfigured,
} from '@/lib/gocc';

// Personal email domains to reject
const PERSONAL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'me.com', 'mac.com', 'live.com', 'msn.com',
  'protonmail.com', 'proton.me', 'mail.com', 'ymail.com', 'gmx.com',
  'gmx.net', 'zoho.com', 'fastmail.com', 'tutanota.com', 'hey.com',
];

export interface GateResult {
  allowed: boolean;
  reason?: string;
  code?: 'PERSONAL_EMAIL' | 'USER_LIMIT' | 'COMPANY_LIMIT' | 'NO_DATABASE' | 'USER_NOT_FOUND';
  user?: User & { company: Company };
  remainingCompanyAnalyses?: number;
}

/**
 * Check if an email is a personal email domain
 */
export function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return PERSONAL_DOMAINS.includes(domain);
}

/**
 * Extract domain from email
 */
export function extractDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}

/**
 * Check if a user can run an analysis
 *
 * Uses a two-layer approach:
 * 1. Local validation (fast, immediate)
 * 2. GOCC policy check (centralized governance, when configured)
 *
 * @param email - User's email address
 * @returns GateResult indicating if analysis is allowed
 */
export async function canRunAnalysis(email: string): Promise<GateResult> {
  const domain = extractDomain(email);

  // ═══════════════════════════════════════════════════════════════════════════
  // Layer 1: Local Validation (fast path)
  // ═══════════════════════════════════════════════════════════════════════════

  // 1. Check for personal email
  if (isPersonalEmail(email)) {
    // Record policy violation if GOCC is available
    if (isGOCCConfigured()) {
      await recordAudit(
        'policy.violation',
        { rule: 'personal-email', email, domain },
        systemActor(),
        'warn'
      );
    }

    return {
      allowed: false,
      reason: 'Corporate email required. Personal email addresses are not accepted.',
      code: 'PERSONAL_EMAIL',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layer 2: GOCC Policy Check (centralized governance)
  // ═══════════════════════════════════════════════════════════════════════════

  if (isGOCCConfigured()) {
    const policyResult = await evaluatePolicy('analysis:run', {
      email,
      domain,
      service: 'intelligentspm',
    });

    if (!policyResult.allowed) {
      await recordAudit(
        'analysis.blocked',
        { email, domain, reason: policyResult.reason, policies: policyResult.policies },
        systemActor(),
        'warn'
      );

      return {
        allowed: false,
        reason: policyResult.reason || 'Access denied by policy',
        code: 'PERSONAL_EMAIL', // Map to existing code for compatibility
      };
    }
  }

  // 2. Check if database is configured
  if (!isDatabaseConfigured()) {
    // In development without DB, allow all corporate emails
    console.warn('Database not configured - allowing analysis without tracking');
    return {
      allowed: true,
      reason: 'Database not configured - analysis not tracked',
      code: 'NO_DATABASE',
    };
  }

  try {
    // 3. Get or create company
    let company = await prisma.company.findUnique({
      where: { domain },
    });

    if (!company) {
      company = await prisma.company.create({
        data: { domain },
      });
    }

    // 4. Check company limit (3 per company)
    if (company.analysisCount >= company.maxAnalyses) {
      return {
        allowed: false,
        reason: `Company analysis limit reached. ${company.domain} has used all ${company.maxAnalyses} analyses.`,
        code: 'COMPANY_LIMIT',
        remainingCompanyAnalyses: 0,
      };
    }

    // 5. Get or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          companyId: company.id,
        },
        include: { company: true },
      });
    }

    // 6. Check user limit (1 per email)
    if (user.analysisUsed) {
      return {
        allowed: false,
        reason: 'Analysis already used. Each email address can only run one analysis.',
        code: 'USER_LIMIT',
        user,
        remainingCompanyAnalyses: company.maxAnalyses - company.analysisCount,
      };
    }

    // 7. All checks passed
    return {
      allowed: true,
      user,
      remainingCompanyAnalyses: company.maxAnalyses - company.analysisCount,
    };
  } catch (error) {
    console.error('Error checking analysis gate:', error);
    // On database error, deny by default for safety
    return {
      allowed: false,
      reason: 'Unable to verify analysis eligibility. Please try again later.',
    };
  }
}

/**
 * Record that a user has used their analysis
 *
 * @param email - User's email address
 * @param analysisType - Type of analysis run
 * @param result - Analysis result data
 */
export async function recordAnalysisUsed(
  email: string,
  analysisType: string,
  result: {
    score?: number;
    tierResult?: string;
    coveragePercent?: number;
    rawOutput: unknown;
    rawInput?: unknown;
  },
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<void> {
  if (!isDatabaseConfigured()) {
    console.warn('Database not configured - analysis not recorded');
    return;
  }

  const domain = extractDomain(email);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Get the user
      const user = await tx.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error(`User not found: ${email}`);
      }

      // 2. Create analysis record
      await tx.analysis.create({
        data: {
          userId: user.id,
          type: analysisType,
          score: result.score,
          tierResult: result.tierResult,
          coveragePercent: result.coveragePercent,
          rawInput: result.rawInput as object | undefined,
          rawOutput: result.rawOutput as object,
          ipAddress: metadata?.ipAddress,
          userAgent: metadata?.userAgent,
        },
      });

      // 3. Mark user as having used their analysis
      await tx.user.update({
        where: { email },
        data: { analysisUsed: true },
      });

      // 4. Increment company analysis count
      await tx.company.update({
        where: { domain },
        data: { analysisCount: { increment: 1 } },
      });

      // 5. Audit log
      await tx.auditLog.create({
        data: {
          eventType: 'analysis.run',
          message: `Analysis completed: ${analysisType}`,
          userId: user.id,
          email,
          companyDomain: domain,
          metadata: {
            type: analysisType,
            score: result.score,
            tierResult: result.tierResult,
          },
          ipAddress: metadata?.ipAddress,
          userAgent: metadata?.userAgent,
        },
      });
    });

    // ═══════════════════════════════════════════════════════════════════════
    // GOCC Spine: Immutable audit record (in addition to local auditLog)
    // ═══════════════════════════════════════════════════════════════════════
    if (isGOCCConfigured()) {
      await recordAudit(
        'analysis.complete',
        {
          type: analysisType,
          score: result.score,
          tierResult: result.tierResult,
          coveragePercent: result.coveragePercent,
          domain,
        },
        userActor(email, email),
        'info'
      );
    }

    console.log(`Recorded analysis for ${email}: ${analysisType}`);
  } catch (error) {
    console.error('Error recording analysis:', error);
    throw error;
  }
}

/**
 * Log a blocked analysis attempt
 */
export async function logBlockedAnalysis(
  email: string,
  reason: string,
  code: string,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<void> {
  if (!isDatabaseConfigured()) {
    console.warn(`Blocked analysis (no DB): ${email} - ${reason}`);
    return;
  }

  try {
    await prisma.auditLog.create({
      data: {
        eventType: 'analysis.blocked',
        severity: 'warn',
        message: reason,
        email,
        companyDomain: extractDomain(email),
        metadata: { code },
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });
  } catch (error) {
    console.error('Error logging blocked analysis:', error);
  }
}

/**
 * Get analysis status for a user
 */
export async function getAnalysisStatus(email: string): Promise<{
  hasUsedAnalysis: boolean;
  companyUsage: number;
  companyMax: number;
  analyses: Array<{
    type: string;
    score: number | null;
    createdAt: Date;
  }>;
} | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
        analyses: {
          select: {
            type: true,
            score: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      hasUsedAnalysis: user.analysisUsed,
      companyUsage: user.company.analysisCount,
      companyMax: user.company.maxAnalyses,
      analyses: user.analyses,
    };
  } catch (error) {
    console.error('Error getting analysis status:', error);
    return null;
  }
}
