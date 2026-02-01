# Universal Services Integration Guide

> **Purpose:** Connect IntelligentSPM to AICR Universal Services for enhanced governance, dispute resolution, and oversight capabilities.

---

## Quick Start

### 1. Install Universal Service Packages

```bash
# Core packages (required)
pnpm add @aicr/gocc-client   # Trust Layer - Policy gates, PII, Audit
pnpm add @aicr/ports         # Shared interfaces

# Domain packages (optional, add as needed)
pnpm add @aicr/dispute-core   # Commission dispute management
pnpm add @aicr/oversight-core # Approval workflows
pnpm add @aicr/da-core        # Document analysis (already optional dep)
```

### 2. Configure Environment

```bash
# .env.local
GOCC_API_URL=https://api.aicoderally.com/api/gocc
GOCC_API_KEY=your-api-key
GOCC_SERVICE_ID=intelligentspm
```

---

## Service Integration Patterns

### Pattern 1: Policy Gates (Replace analysis-gate.ts)

The current `analysis-gate.ts` enforces business rules locally. GOCC provides centralized policy enforcement with audit trails.

**Before (Local):**
```typescript
// lib/services/analysis-gate.ts
export async function canRunAnalysis(email: string): Promise<GateResult> {
  if (isPersonalEmail(email)) {
    return { allowed: false, code: 'PERSONAL_EMAIL' };
  }
  // ... more checks
}
```

**After (GOCC Trust Layer):**
```typescript
// lib/services/analysis-gate.ts
import { createGOCCClient, withPolicyCheck, createAuditContext } from '@aicr/gocc-client';

const gocc = createGOCCClient({
  baseUrl: process.env.GOCC_API_URL!,
  apiKey: process.env.GOCC_API_KEY!,
  serviceId: 'intelligentspm',
});

export async function canRunAnalysis(email: string): Promise<GateResult> {
  const ctx = createAuditContext(gocc, 'spm', 'intelligentspm', { type: 'user', id: email });

  return withPolicyCheck(
    gocc,
    'analysis:run',
    () => ({ email, domain: extractDomain(email) }),
    () => ctx,
    async () => {
      // Policy passed - proceed with analysis
      return { allowed: true };
    }
  );
}
```

### Pattern 2: Dispute Resolution (Commission Disputes)

For handling commission calculation disputes:

```typescript
// lib/services/dispute.service.ts
import { createDisputeCase, addEvidence, resolveDispute } from '@aicr/dispute-core';

export async function createCommissionDispute(input: {
  repId: string;
  dealId: string;
  expectedAmount: number;
  actualAmount: number;
  reason: string;
}) {
  // Create dispute case
  const dispute = await createDisputeCase({
    type: 'commission',
    domain: 'spm',
    subject: `Commission dispute for deal ${input.dealId}`,
    claimant: input.repId,
    description: input.reason,
    metadata: {
      dealId: input.dealId,
      expectedAmount: input.expectedAmount,
      actualAmount: input.actualAmount,
      variance: input.expectedAmount - input.actualAmount,
    },
  });

  // Attach deal evidence
  await addEvidence(dispute.id, {
    type: 'document',
    label: 'Deal Record',
    data: await fetchDealRecord(input.dealId),
  });

  return dispute;
}
```

### Pattern 3: Approval Workflows (Plan Changes)

For compensation plan change approvals:

```typescript
// lib/services/approval.service.ts
import { createApprovalRequest, submitApproval, getApprovalStatus } from '@aicr/oversight-core';

export async function requestPlanChange(input: {
  planId: string;
  changes: Record<string, unknown>;
  requestedBy: string;
  justification: string;
}) {
  const approval = await createApprovalRequest({
    type: 'plan-change',
    domain: 'spm',
    resourceId: input.planId,
    requestedBy: input.requestedBy,
    approvers: await getApproversForPlan(input.planId),
    payload: input.changes,
    metadata: {
      justification: input.justification,
    },
  });

  return approval;
}
```

### Pattern 4: Audit Trail (Replace local auditLog)

Replace Prisma auditLog with GOCC Spine for centralized, immutable audit:

```typescript
// lib/services/audit.service.ts
import { createAuditContext, userActor } from '@aicr/gocc-client';

const ctx = createAuditContext(gocc, 'spm', 'intelligentspm', userActor(userId));

// Record analysis completion
await ctx.record('analysis.complete', {
  type: 'comp-plan-review',
  score: 85,
  dealId: 'deal-123',
});

// Record policy violation
await ctx.record('policy.violation', {
  rule: 'personal-email',
  email: 'user@gmail.com',
}, 'warn');
```

---

## Migration Path

### Phase 1: Add GOCC Client (Non-Breaking)
1. Install `@aicr/gocc-client`
2. Add env vars for GOCC connection
3. Create `lib/gocc.ts` with client instance
4. Add audit logging alongside existing auditLog table

### Phase 2: Policy Gates (Parallel Run)
1. Keep existing analysis-gate.ts logic
2. Add GOCC policy checks in parallel
3. Compare results, log discrepancies
4. Switch to GOCC when confident

### Phase 3: Dispute Resolution (New Feature)
1. Install `@aicr/dispute-core`
2. Add commission dispute UI
3. Integrate with deal trace workflow
4. Connect to notification system

### Phase 4: Approval Workflows (New Feature)
1. Install `@aicr/oversight-core`
2. Add plan change approval UI
3. Integrate with existing plan management
4. Set up approval notification hooks

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     IntelligentSPM Product                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   AskSPM    │  │  Analysis   │  │ Plan Mgmt   │   App Layer  │
│  │    RAG      │  │   Gate      │  │             │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
├─────────┼────────────────┼────────────────┼──────────────────────┤
│         │                │                │                      │
│  ┌──────┴──────────────────────────────────┴──────┐              │
│  │              Universal Services Layer          │              │
│  ├────────────────────────────────────────────────┤              │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │              │
│  │  │  GOCC    │ │ Dispute  │ │ Oversight│        │   Packages   │
│  │  │  Client  │ │   Core   │ │   Core   │        │              │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘        │              │
│  └───────┼────────────┼────────────┼──────────────┘              │
│          │            │            │                             │
└──────────┼────────────┼────────────┼─────────────────────────────┘
           │            │            │
           ▼            ▼            ▼
    ┌──────────────────────────────────────────┐
    │         AICR Platform (Trust Layer)       │
    ├──────────────────────────────────────────┤
    │  Policy Gates │ PII Redaction │ Audit    │
    │  GOCC API     │ Spine         │ Metering │
    └──────────────────────────────────────────┘
```

---

## API Reference

### GOCC Client

```typescript
import { createGOCCClient, type GOCCClient } from '@aicr/gocc-client';

const client: GOCCClient = createGOCCClient({
  baseUrl: string;      // GOCC API URL
  apiKey: string;       // Service API key
  serviceId: string;    // Your service identifier
  timeout?: number;     // Request timeout (ms)
  retries?: number;     // Retry count for failures
});

// Policy evaluation
await client.policies.evaluate({
  action: 'analysis:run',
  resource: { email, domain },
  context: { tenantId: 'intelligentspm' },
});

// PII redaction
await client.pii.redact({
  content: 'SSN: 123-45-6789',
  patterns: ['ssn', 'email', 'phone'],
});

// Audit recording
await client.spine.record({
  event: 'analysis.complete',
  data: { score: 85 },
  actor: { type: 'user', id: userId },
});
```

### Dispute Core

```typescript
import {
  createDisputeCase,
  addEvidence,
  assignHandler,
  resolveDispute,
  escalateDispute
} from '@aicr/dispute-core';

// Create case
const dispute = await createDisputeCase({ type, domain, subject, claimant });

// Add evidence
await addEvidence(disputeId, { type: 'document', label, data });

// Resolve
await resolveDispute(disputeId, { resolution: 'approved', notes });
```

### Oversight Core

```typescript
import {
  createApprovalRequest,
  submitApproval,
  getApprovalChain,
  createCommittee
} from '@aicr/oversight-core';

// Create approval
const approval = await createApprovalRequest({ type, resourceId, approvers });

// Submit decision
await submitApproval(approvalId, { decision: 'approved', notes });

// Check status
const chain = await getApprovalChain(approvalId);
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOCC_API_URL` | GOCC API base URL | Yes |
| `GOCC_API_KEY` | Service authentication key | Yes |
| `GOCC_SERVICE_ID` | Service identifier for audit | Yes |
| `GOCC_TIMEOUT` | Request timeout in ms | No (default: 5000) |
| `GOCC_RETRIES` | Retry count | No (default: 3) |

---

## Testing

```typescript
// test/services/gocc.test.ts
import { createGOCCClient } from '@aicr/gocc-client';
import { mockGOCCClient } from '@aicr/gocc-client/test';

describe('Policy Gates', () => {
  const client = mockGOCCClient();

  it('should allow corporate email', async () => {
    client.policies.evaluate.mockResolvedValue({
      success: true,
      data: { allowed: true },
    });

    const result = await canRunAnalysis('user@acme.com');
    expect(result.allowed).toBe(true);
  });

  it('should block personal email via policy', async () => {
    client.policies.evaluate.mockResolvedValue({
      success: true,
      data: { allowed: false, reason: 'Personal email not allowed' },
    });

    const result = await canRunAnalysis('user@gmail.com');
    expect(result.allowed).toBe(false);
  });
});
```

---

## Related Documentation

- [UNIVERSAL_SERVICES_CATALOG_v0.1.0.md](/Users/toddlebaron/dev/aicr/docs/canonical/UNIVERSAL_SERVICES_CATALOG_v0.1.0.md) - Canonical service specifications
- [GOCC Trust Layer](/Users/toddlebaron/dev/aicr/apps/aicr/src/lib/governance/) - Policy engine implementation
- [Dispute Core Package](/Users/toddlebaron/dev/aicr/packages/dispute-core/) - Case management
- [Oversight Core Package](/Users/toddlebaron/dev/aicr/packages/oversight-core/) - Approval workflows
