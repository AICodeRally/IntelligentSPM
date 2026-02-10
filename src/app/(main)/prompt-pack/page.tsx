import { SectionLabel, PrimaryButton } from "@/components/ui";

export const metadata = {
  title: "Prompt Pack | IntelligentSPM",
  description: "Weekly AI prompts that produce usable SPM artifacts.",
};

const prompts = [
  {
    title: "Prompt 01 — Bake Loop Post-Mortem",
    bestFor: "Sales Ops / RevOps / CFO partner",
    input: "role, plan intent, plan highlights, operating model, known pain, observed signals",
    output: "Exec bullets + risk/guardrail table + filled Bake Card",
    text: `You are an SPM analyst. Run a Bake Loop post-mortem for this role: [ROLE].\n\nContext:\n- Plan intent (one sentence): [INTENT]\n- Plan highlights: [rates/accelerators/cliffs/caps briefly]\n- Operating model notes: [territories/channel/renewal ownership]\n- Known pain: [top complaints]\n- Observed signals (if any): [period-end concentration, discounting, exceptions themes]\n\nTask:\n1) Identify the 5 behaviors this plan is likely creating (good and bad).\n2) List the top 5 gaming paths and how to block each with guardrails (definitions, eligibility, ramps, exclusions).\n3) Generate “next month’s exception headlines” (10 items) with likely root cause + fix target.\n4) Output a one-page Bake Card (filled) for this role.\n\nRules:\n- Be concrete. Use examples.\n- Do not invent metrics. If you mention %/$, label as assumptions and list the exact data fields needed to validate.\nReturn as: (A) Exec summary bullets, (B) Risks→Guardrails table, (C) Filled Bake Card.`
  },
  {
    title: "Prompt 02 — Cliff & Retroactivity Detector",
    bestFor: "Catching sandbagging before launch",
    input: "attainment bands, rates, retroactivity rules, caps, kickers",
    output: "Risk list + recommended smoothing options",
    text: `You are an incentive design auditor. Analyze this payout structure for cliffs, retroactivity traps, and behavior distortion.\n\nPlan details:\n- Attainment bands & rates: [PASTE]\n- Retroactivity rules: [YES/NO + explain]\n- Caps/floors/kickers: [PASTE]\n- Deal timing/measurement period: [monthly/quarterly + details]\n\nOutput:\n1) Identify the top 5 cliff risks and the behavior each creates.\n2) Flag any retroactivity patterns that incentivize deal-holding.\n3) Recommend 3 safer alternatives (ramps, blended rates, decoupled kickers) and tradeoffs.\nReturn as a table: Risk | Mechanism | Behavior | Fix | Tradeoff.`
  },
  {
    title: "Prompt 03 — Exception Taxonomy + Reason Codes",
    bestFor: "Turning disputes into governance",
    input: "20–50 exception notes or themes",
    output: "taxonomy + reason codes + required fields",
    text: `You are designing an exception governance system for Sales Comp.\n\nHere are real exception examples/themes:\n[PASTE 20–50 lines OR bullet themes]\n\nCreate:\n1) A reason-code taxonomy (8–15 codes) grouped by category (Credit/Data/Plan/Policy/Operating Model).\n2) For each code, define: description, required fields, decision options, typical fix targets.\n3) A rule: no case closes without root cause + fix owner + due date.\nReturn as: Category | Code | Definition | Required Fields | Fix Target | Owner.`
  },
  {
    title: "Prompt 04 — Credit & Split Policy (1-page)",
    bestFor: "Stopping recurring credit fights",
    input: "roles, coverage model, channel rules, conflict scenarios",
    output: "one-page policy + examples + MUST/MUST NOT",
    text: `Draft a one-page credit & split policy for this sales model:\n\nRoles involved: [AE/CSM/SE/Partner/Overlay/etc]\nCoverage rules: [territory/account ownership details]\nChannel rules: [partner sourced/influenced, co-sell]\nCommon disputes: [PASTE]\n\nDeliver:\n1) Clear split rules for 6–10 scenarios (with examples).\n2) MUST/MUST NOT statements.\n3) Escalation path + documentation required.\nKeep it to one page and written for field consumption.`
  },
  {
    title: "Prompt 05 — Deal Type Definitions",
    bestFor: "Preventing reclassification gaming",
    input: "customer ID logic, product lines, contract rules",
    output: "definitions + validation logic + audit checks",
    text: `Define enforceable deal-type definitions for comp purposes:\n- New logo\n- Expansion\n- Renewal\n- Winback\n\nContext:\n- Systems: [CRM/CPQ/Billing]\n- Customer ID/source of truth: [PASTE]\n- Contract edge cases: [subsidiaries, amendments, restarts, winbacks]\n\nOutput:\n1) Definitions + inclusions/exclusions.\n2) Required fields + validation rules (what must be populated).\n3) 5 audit tests to detect reclassification abuse.\nReturn as a spec: Term | Definition | Required Fields | Validation | Common Abuse Signal.`
  },
  {
    title: "Prompt 06 — Plan Communication Pack",
    bestFor: "Launch readiness",
    input: "plan summary + 5 example deals",
    output: "FAQ + worked examples + “what we will not pay for”",
    text: `Create a comp-plan communication pack for reps and managers.\n\nInputs:\n- Role: [ROLE]\n- Plan summary: [PASTE]\n- 5 example deals (simple): [PASTE]\n\nDeliver:\n1) One-page overview (what matters).\n2) 10 FAQs (including edge cases).\n3) 5 worked examples with simple math.\n4) “What we will NOT pay for” list.\nTone: direct, clear, no legalese.`
  },
  {
    title: "Prompt 07 — Simulation Scenario Generator",
    bestFor: "Pre-launch crash testing",
    input: "plan rules, assumptions, distribution notes",
    output: "scenario set + measures + failure points",
    text: `Generate a 3-simulation test plan for this comp plan:\n- Baseline (historical distribution)\n- Intended behavior shift (what success looks like)\n- Gaming scenario (how reps exploit it)\n\nInputs:\n- Plan rules: [PASTE]\n- Target behavior: [PASTE]\n- Known weak points: [PASTE]\n\nOutput:\n1) Scenario definitions + assumptions.\n2) What to measure (payout distribution, cost vs budget, top drivers, dispute headlines).\n3) Expected failure points + guardrails to test.\nReturn as a checklist and a table.`
  },
  {
    title: "Prompt 08 — Exec Brief",
    bestFor: "Comp committee / CFO/CRO updates",
    input: "key metrics + top issues + decisions",
    output: "one-page brief with decisions + tradeoffs",
    text: `Write an executive brief for the comp committee.\n\nInputs:\n- Role/plan: [PASTE]\n- What changed (if any): [PASTE]\n- Key signals: [exceptions, deal timing, discounting, payout distribution]\n- Decisions needed: [PASTE]\n\nOutput:\n1) 5-bullet summary.\n2) What’s driving outcomes (top 3).\n3) Risks if we do nothing.\n4) Decision options (2–3) with tradeoffs.\nOne page max. No fluff.`
  },
  {
    title: "Prompt 09 — Patch Window Control",
    bestFor: "Kill mid-quarter chaos",
    input: "proposed changes + reason + impacted groups",
    output: "change log entry + comms + test checklist",
    text: `You are the release manager for sales comp governance.\n\nProposed patch:\n- Change description: [PASTE]\n- Reason: [PASTE]\n- Impacted roles/regions: [PASTE]\n- Effective date: [PASTE]\n\nDeliver:\n1) Patch note (internal) + rep-facing summary.\n2) Test checklist (data fields, calc scenarios, edge cases).\n3) Risk assessment + rollback plan.`
  },
  {
    title: "Prompt 10 — Data Quality Audit",
    bestFor: "Fixing pay inputs before redesign",
    input: "pay-driving fields + source systems",
    output: "audit plan + controls + monitoring",
    text: `Design a data quality audit for sales-comp pay-driving fields.\n\nInputs:\n- Pay-driving fields: [PASTE]\n- Source systems: [CRM/CPQ/Billing/HR/ICM]\n- Known issues: [PASTE]\n\nOutput:\n1) Audit tests per field (completeness, validity, timeliness, uniqueness).\n2) Ownership (who fixes what).\n3) Monitoring plan (weekly checks + thresholds + alerts).\nReturn as a table and a 30-day action plan.`
  },
];

export default function PromptPackPage() {
  return (
    <div className="min-h-screen bg-[#1a0e2e]">
      <section className="py-20 px-6 bg-gradient-to-b from-[#1a0e2e] via-[#130a24] to-[#1a0e2e]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel color="#38BDF8">Prompt Pack</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-4">
            IntelligentSPM Prompt Pack
          </h1>
          <p className="text-lg text-[#CBD5E1] max-w-2xl">
            Prompts that create artifacts — not essays. Built for the Bake Loop: launch → observe → measure → patch → redesign.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-[#E2E8F0]">No invented metrics</span>
            <span className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-[#E2E8F0]">Always request an artifact</span>
            <span className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-[#E2E8F0]">Designed for real operators</span>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#1a0e2e] via-[#150b26] to-[#1a0e2e]">
        <div className="max-w-5xl mx-auto grid gap-6">
          {prompts.map((prompt) => (
            <div key={prompt.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#E2E8F0] mb-2">{prompt.title}</h2>
                  <p className="text-sm text-[#CBD5E1]">Best for: {prompt.bestFor}</p>
                </div>
                <div className="text-sm text-[#CBD5E1]">Output: {prompt.output}</div>
              </div>
              <div className="mt-4 text-sm text-[#CBD5E1]">Inputs: {prompt.input}</div>
              <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-[#130a24] border border-white/10 p-4 text-sm text-[#CBD5E1]">
{prompt.text}
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#1a0e2e] via-[#150b27] to-[#1a0e2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#E2E8F0] mb-4">Want a custom prompt pack?</h2>
          <p className="text-[#CBD5E1] mb-8">Reply in the newsletter or contact The Toddfather for a tailored set.</p>
          <PrimaryButton href="/toddfather/contact?topic=confab" variant="cyan" size="large">
            Request a Custom Pack
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
