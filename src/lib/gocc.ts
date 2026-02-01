/**
 * GOCC Client - Trust Layer Integration
 *
 * Provides centralized governance through AICR's Trust Layer:
 * - Policy gates (access control, rate limiting)
 * - PII redaction (before storage/display)
 * - Audit logging (immutable spine records)
 * - Metering (usage tracking)
 *
 * @see docs/UNIVERSAL_SERVICES_INTEGRATION.md
 */

// Type-only import for now - package will be installed when ready
type GOCCClientConfig = {
  baseUrl: string;
  apiKey: string;
  serviceId: string;
  timeout?: number;
  retries?: number;
};

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
 * Check if GOCC is configured
 */
export function isGOCCConfigured(): boolean {
  return !!(process.env.GOCC_API_URL && process.env.GOCC_API_KEY);
}

/**
 * Get or create GOCC client instance
 *
 * Returns null if GOCC is not configured (graceful degradation)
 */
export function getGOCCClient(): GOCCClient | null {
  if (!isGOCCConfigured()) {
    console.warn('[GOCC] Not configured - running in local mode');
    return null;
  }

  if (_client) {
    return _client;
  }

  // For now, create a stub client that logs locally
  // Replace with real @aicr/gocc-client import when package is installed
  _client = createLocalGOCCClient();
  return _client;
}

/**
 * Local GOCC client for development/fallback
 *
 * Logs actions locally when GOCC platform is not available
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
