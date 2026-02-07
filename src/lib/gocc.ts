/**
 * GOCC Client - Trust Layer Integration
 *
 * Provides centralized governance through AICR's Trust Layer:
 * - Policy gates (access control, rate limiting)
 * - PII redaction (before storage/display)
 * - Audit logging (immutable spine records)
 * - Metering (usage tracking)
 *
 * Environment variables:
 * - AICR_API_URL: AICR platform URL (e.g., https://app.aicoderally.com)
 * - AICR_TENANT_ID: Tenant identifier (e.g., thetoddfather)
 * - AICR_SERVICE_TOKEN: API key with spine:write scope
 *
 * @see docs/UNIVERSAL_SERVICES_INTEGRATION.md
 */

import crypto from 'crypto';

type PolicyResult = {
  allowed: boolean;
  reason?: string;
  policies?: string[];
};

type AuditActor =
  | { type: 'user'; id: string; email?: string }
  | { type: 'system'; name: string }
  | { type: 'service'; id: string };

// Lazy initialization - only create client when needed
let _client: GOCCClient | null = null;

interface GOCCClient {
  policies: {
    evaluate: (input: {
      action: string;
      resource: Record<string, unknown>;
      context?: Record<string, unknown>;
    }) => Promise<PolicyResult>;
  };
  pii: {
    redact: (input: {
      content: string;
      patterns?: string[];
    }) => Promise<{ redacted: string; found: string[] }>;
  };
  spine: {
    record: (input: {
      event: string;
      data: Record<string, unknown>;
      actor: AuditActor;
      severity?: 'info' | 'warn' | 'error';
    }) => Promise<{ id: string }>;
  };
}

/**
 * Check if AICR is configured
 */
export function isGOCCConfigured(): boolean {
  return !!(
    process.env.AICR_API_URL &&
    process.env.AICR_TENANT_ID &&
    process.env.AICR_SERVICE_TOKEN
  );
}

/**
 * Get or create GOCC client instance
 *
 * Returns a real AICR client if configured, otherwise a local fallback
 */
export function getGOCCClient(): GOCCClient | null {
  if (_client) {
    return _client;
  }

  if (isGOCCConfigured()) {
    _client = createAICRClient();
    console.log('[GOCC] Connected to AICR platform');
  } else {
    console.warn('[GOCC] Not configured - running in local mode');
    _client = createLocalGOCCClient();
  }

  return _client;
}

/**
 * App version for audit records
 */
const APP_VERSION = process.env.npm_package_version || '1.0.0';

/**
 * Generate SHA-256 checksum of payload
 */
function generateChecksum(payload: Record<string, unknown>): string {
  const json = JSON.stringify(payload, Object.keys(payload).sort());
  return crypto.createHash('sha256').update(json).digest('hex');
}

/**
 * Convert AuditActor to string for AICR API
 */
function actorToString(actor: AuditActor): string {
  switch (actor.type) {
    case 'user':
      return actor.email || actor.id;
    case 'system':
      return `system:${actor.name}`;
    case 'service':
      return `service:${actor.id}`;
  }
}

/**
 * Real AICR client that calls Edge API
 */
function createAICRClient(): GOCCClient {
  const baseUrl = process.env.AICR_API_URL!;
  const tenantId = process.env.AICR_TENANT_ID!;
  const serviceToken = process.env.AICR_SERVICE_TOKEN!;

  return {
    policies: {
      async evaluate(input) {
        // Policy checks are local for now (analysis-gate.ts handles this)
        // Future: call /api/edge/policy/check
        console.log('[AICR] Policy check (local):', input.action);
        return { allowed: true };
      },
    },
    pii: {
      async redact(input) {
        // PII redaction is local for now
        // Future: call /api/edge/pii/redact
        let redacted = input.content;
        const found: string[] = [];

        // SSN pattern
        if (/\d{3}-\d{2}-\d{4}/.test(redacted)) {
          redacted = redacted.replace(/\d{3}-\d{2}-\d{4}/g, '[REDACTED-SSN]');
          found.push('ssn');
        }

        // Email pattern
        if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(redacted)) {
          redacted = redacted.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[REDACTED-EMAIL]');
          found.push('email');
        }

        return { redacted, found };
      },
    },
    spine: {
      async record(input) {
        const payload = {
          ...input.data,
          severity: input.severity || 'info',
        };

        const evidenceRecord = {
          tenant: tenantId,
          event: input.event,
          payload,
          actor: actorToString(input.actor),
          actorSource: input.actor.type === 'user' ? 'local' : 'aicr',
          timestamp: Date.now(),
          appVersion: APP_VERSION,
          checksum: generateChecksum(payload),
        };

        try {
          const response = await fetch(`${baseUrl}/api/edge/spine/record`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${serviceToken}`,
              'X-Tenant-ID': tenantId,
            },
            body: JSON.stringify(evidenceRecord),
          });

          if (!response.ok) {
            const error = await response.text();
            console.error('[AICR] Spine record failed:', response.status, error);
            // Fallback to local ID on failure
            return { id: `local-${Date.now()}` };
          }

          const result = await response.json();
          console.log('[AICR] Spine record:', input.event, '→', result.evidenceId);
          return { id: result.evidenceId };
        } catch (error) {
          console.error('[AICR] Spine record error:', error);
          // Fallback to local ID on network error
          return { id: `local-${Date.now()}` };
        }
      },
    },
  };
}

/**
 * Local GOCC client for development/fallback
 *
 * Logs actions locally when AICR platform is not available
 */
function createLocalGOCCClient(): GOCCClient {
  return {
    policies: {
      async evaluate(input) {
        console.log('[GOCC:local] Policy check:', input.action, input.resource);
        // Local fallback - always allow (real checks in analysis-gate.ts)
        return { allowed: true };
      },
    },
    pii: {
      async redact(input) {
        console.log('[GOCC:local] PII redact requested');
        // Simple local redaction patterns
        let redacted = input.content;
        const found: string[] = [];

        // SSN pattern
        if (/\d{3}-\d{2}-\d{4}/.test(redacted)) {
          redacted = redacted.replace(/\d{3}-\d{2}-\d{4}/g, '[REDACTED-SSN]');
          found.push('ssn');
        }

        // Email pattern
        if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(redacted)) {
          redacted = redacted.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[REDACTED-EMAIL]');
          found.push('email');
        }

        return { redacted, found };
      },
    },
    spine: {
      async record(input) {
        console.log('[GOCC:local] Audit record:', input.event, input.data);
        // Return fake ID for local mode
        return { id: `local-${Date.now()}` };
      },
    },
  };
}

// ============================================================================
// CONVENIENCE WRAPPERS
// ============================================================================

/**
 * Evaluate a policy before an action
 *
 * @example
 * const result = await evaluatePolicy('analysis:run', { email: 'user@acme.com' });
 * if (!result.allowed) throw new Error(result.reason);
 */
export async function evaluatePolicy(
  action: string,
  resource: Record<string, unknown>,
  context?: Record<string, unknown>
): Promise<PolicyResult> {
  const client = getGOCCClient();
  if (!client) {
    // Fallback to allow if not configured
    return { allowed: true };
  }

  return client.policies.evaluate({ action, resource, context });
}

/**
 * Redact PII from content
 *
 * @example
 * const { redacted } = await redactPII('Contact: john@acme.com, SSN: 123-45-6789');
 * // redacted = 'Contact: [REDACTED-EMAIL], SSN: [REDACTED-SSN]'
 */
export async function redactPII(
  content: string,
  patterns?: string[]
): Promise<{ redacted: string; found: string[] }> {
  const client = getGOCCClient();
  if (!client) {
    return { redacted: content, found: [] };
  }

  return client.pii.redact({ content, patterns });
}

/**
 * Record an audit event to the Spine
 *
 * @example
 * await recordAudit('analysis.complete', { score: 85 }, { type: 'user', id: userId });
 */
export async function recordAudit(
  event: string,
  data: Record<string, unknown>,
  actor: AuditActor,
  severity?: 'info' | 'warn' | 'error'
): Promise<{ id: string }> {
  const client = getGOCCClient();
  if (!client) {
    console.log(`[Audit:local] ${event}:`, data);
    return { id: `local-${Date.now()}` };
  }

  return client.spine.record({ event, data, actor, severity });
}

// ============================================================================
// ACTOR HELPERS
// ============================================================================

/**
 * Create a user actor for audit records
 */
export function userActor(id: string, email?: string): AuditActor {
  return { type: 'user', id, email };
}

/**
 * Create a system actor for automated processes
 */
export function systemActor(name: string = 'intelligentspm'): AuditActor {
  return { type: 'system', name };
}

/**
 * Create a service actor for service-to-service calls
 */
export function serviceActor(id: string = 'intelligentspm'): AuditActor {
  return { type: 'service', id };
}
