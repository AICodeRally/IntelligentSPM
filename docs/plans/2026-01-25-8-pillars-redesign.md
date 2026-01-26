# 8 Pillars Redesign - Design Document

**Date:** January 25, 2026
**Status:** Approved

## Overview

Redesign the 8 Pillars of SPM section on the homepage to be more professional with a modern SaaS aesthetic, custom icons, and interactive expand-to-learn behavior.

## Visual Design

### Card Style (Modern SaaS/Glass)
- Background: Semi-transparent glass effect (`bg-white/5 backdrop-blur-sm`)
- Border: Subtle glow on hover using pillar color (`border border-white/10 hover:border-[color]/50`)
- Shadow: Soft colored glow on hover (`hover:shadow-lg hover:shadow-[color]/20`)
- Corner radius: Larger for modern feel (`rounded-2xl`)
- Padding: Increased (`p-6`)

### Icon Treatment
Lucide icons mapped to each pillar:
| Pillar | Icon | Color |
|--------|------|-------|
| Sales Planning | `Target` | #2563eb |
| ICM | `Wallet` | #16a34a |
| Sales Intelligence | `BarChart3` | #9333ea |
| Governance | `Shield` | #dc2626 |
| Technology | `Cpu` | #0891b2 |
| Strategy | `Compass` | #ea580c |
| Implementation | `Rocket` | #ca8a04 |
| Legal | `Scale` | #4f46e5 |

- Icon size: 32px, white on colored circular background
- Subtle scale animation on hover

### Typography
- Pillar name: `text-lg font-semibold` in pillar color
- Description: `text-sm text-slate-400`
- Expanded content: `text-sm text-slate-300` with bullet points

### Layout
- 2x4 grid on desktop
- 2x4 grid on mobile (cards stack naturally)
- Slightly larger cards with more internal spacing

## Interaction Design

### Trigger
- Click anywhere on card to expand/collapse
- Cursor pointer on hover
- Small chevron icon indicates expandability

### Expanded State
- Card expands vertically with `transition-all duration-300`
- Grid layout handles alignment automatically
- Only one card expanded at a time

### Expanded Content Structure
```
[Icon] Pillar Name
Short description

─────────────────────
• Bullet point 1
• Bullet point 2
• Bullet point 3
• Bullet point 4

Why it matters: One-liner explanation.

Learn more →
```

### Collapse Behavior
- Click same card to collapse
- Clicking another card collapses current and expands new one

## Content Per Pillar

### Sales Planning
- Territory design and alignment
- Quota setting methodology
- Capacity planning and headcount
- Coverage model optimization

**Why it matters:** Bad territories kill good reps.

### ICM (Incentive Compensation Management)
- Compensation plan design
- Commission calculations and payments
- Statement generation and delivery
- Plan modeling and simulation

**Why it matters:** This is where the money moves.

### Sales Intelligence
- Pipeline analytics and forecasting
- Performance dashboards
- AI-driven insights
- Predictive modeling

**Why it matters:** You can't manage what you can't measure.

### Governance
- Segregation of duties and approvals
- Audit trails and change management
- SOX and 409A compliance
- Policy documentation standards

**Why it matters:** Most orgs have zero formal comp governance.

### Technology
- Vendor evaluation and selection
- System integrations (CRM, ERP, HRIS)
- Data architecture and flows
- Build vs buy decisions

**Why it matters:** The wrong tool costs more than no tool.

### Strategy
- Pay philosophy and positioning
- Plan design principles
- Pay mix and leverage decisions
- Competitive benchmarking

**Why it matters:** Strategy before spreadsheets.

### Implementation
- Change management approach
- Training and enablement
- Rollout and communication
- Adoption tracking

**Why it matters:** A perfect plan poorly rolled out is a failed plan.

### Legal
- State wage law compliance
- Plan document requirements
- Clawback and forfeiture rules
- International considerations

**Why it matters:** Comp lawsuits are expensive and avoidable.

## Section Header

**Title:** The 8 Pillars of SPM
**Subhead:** Click any pillar to explore what it covers

## Technical Notes

- Install `lucide-react` for icons
- Use React state to track expanded pillar (`expandedPillar: string | null`)
- Animate with Tailwind's `transition-all duration-300`
- Chevron rotates 180deg when expanded

## Links

Each "Learn more →" links to:
- Sales Planning → `/learn/spm-101`
- ICM → `/learn/spm-101`
- Sales Intelligence → `/learn/spm-101`
- Governance → `/healthcheck/governance`
- Technology → `/vendors`
- Strategy → `/learn/framework`
- Implementation → `/learn/spm-101`
- Legal → `/learn/policies`
