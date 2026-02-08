import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TargetIcon,
  StackIcon,
  BarChartIcon,
  LockClosedIcon,
  GearIcon,
  MixerHorizontalIcon,
  RocketIcon,
  ReaderIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";

// Full lever data with all content
const leverData: Record<string, {
  header: string;
  name: string;
  tagline: string;
  color: string;
  icon: typeof MixerHorizontalIcon;
  whatItIs: string;
  whenToPullBullets: string[];
  commonFailures: string[];
  fastWins: string[];
  evidenceQuestions: string[];
  maturityLadder: { level: number; name: string; desc: string }[];
  starterArtifacts: string;
  whenToPull: string;
  moves: string;
  blast: string;
  scoreboard: string;
  artifacts: string;
  prevSlug: string | null;
  nextSlug: string | null;
}> = {
  "incentive-architecture": {
    header: "Strategy",
    name: "Incentive Architecture",
    tagline: "Reward intent. Predict behavior.",
    color: "#D97706",
    icon: MixerHorizontalIcon,
    whatItIs: "The design layer that turns company goals into rep behavior—by shaping upside, effort, and tradeoffs.",
    whenToPullBullets: [
      "New product launch, new segment, or margin pressure requiring behavior change",
      "Rep churn, or any quarter where \"behavior feels off\"",
    ],
    commonFailures: [
      "Paying for the wrong thing (activity over outcomes, bookings over profitable bookings)",
      "Hidden cliffs and accidental \"all-or-nothing\" thresholds",
      "Complexity inflation (too many measures, exceptions, or role variants)",
      "Upside that's either meaningless (no motivation) or explosive (budget blowups)",
    ],
    fastWins: [
      "Define a complexity budget (max measures, max exceptions, max payout mechanics)",
      "Replace \"clever math\" with clear curves (show the payout shape, not the formula)",
      "Run 3 mandatory sims: base / stretch / edge-case",
      "Hard-cap any mechanic that can compound unintentionally",
    ],
    evidenceQuestions: [
      "Plan blueprint exists and matches what's paid",
      "Payout curve is visualized (not just formulas)",
      "Scenario pack run pre-launch (base/stretch/edge)",
      "Complexity budget enforced (measure count, exceptions)",
      "Plan changes are versioned with rationale",
    ],
    maturityLadder: [
      { level: 1, name: "Gut feel", desc: "plans are argued, not modeled" },
      { level: 2, name: "Documented", desc: "plan one-pagers + role mapping exist" },
      { level: 3, name: "Simulated", desc: "scenario packs required before launch" },
      { level: 4, name: "Governed", desc: "versioning + change control + evidence chain" },
      { level: 5, name: "Adaptive", desc: "in-quarter signals tune guidance and guardrails" },
    ],
    starterArtifacts: "Plan blueprint • payout curve map • complexity budget • role taxonomy • scenario pack",
    whenToPull: "New product, new segment, margin pressure, rep churn, or any quarter where \"behavior feels off.\"",
    moves: "Pay mix • thresholds • accelerators • role differentiation • complexity budget • upside design",
    blast: "Wrong behaviors • runaway cost • comp compression • retention damage • \"plan cynicism\"",
    scoreboard: "Cost of sale % • pay/performance correlation • payout variance • top-tier attrition • plan exception rate",
    artifacts: "Plan blueprint (one-pager) • role taxonomy • payout curve map • scenario pack (3–5 cases)",
    prevSlug: null,
    nextSlug: "compliance-guardrails",
  },
  "compliance-guardrails": {
    header: "Legal",
    name: "Compliance Guardrails",
    tagline: "What you're allowed to do.",
    color: "#6366F1",
    icon: ReaderIcon,
    whatItIs: "The constraint layer—what you can promise, pay, claw back, and enforce… by jurisdiction and role.",
    whenToPullBullets: [
      "Multi-state growth, reclassifying roles, or new clawback terms",
      "Acquisitions or repeated wage disputes",
    ],
    commonFailures: [
      "Treating commission plans like \"policy docs\" instead of enforceable agreements",
      "Copy/paste clauses that don't survive wage & hour rules",
      "Clawbacks that can't legally be executed",
      "Dispute language that creates ambiguity (and lawsuits)",
    ],
    fastWins: [
      "Build a jurisdiction matrix and stop improvising",
      "Standardize a clause library (approved wording only)",
      "Make \"earned vs. paid\" definitions explicit and consistent",
      "Create a dispute policy that's short, firm, and timed",
    ],
    evidenceQuestions: [
      "Jurisdiction matrix exists and is current",
      "Clause library is standardized and used",
      "Clawback terms are legally executable",
      "Dispute terms are unambiguous and time-boxed",
      "Legal sign-off evidence is stored and searchable",
    ],
    maturityLadder: [
      { level: 1, name: "Reactive", desc: "legal shows up after problems" },
      { level: 2, name: "Standard clauses", desc: "templates exist but drift" },
      { level: 3, name: "Jurisdiction-aware", desc: "state-by-state guardrails applied" },
      { level: 4, name: "Audit-ready", desc: "sign-offs + evidence captured" },
      { level: 5, name: "Continuous", desc: "policy exceptions trigger corrective action loops" },
    ],
    starterArtifacts: "Jurisdiction matrix • clause library • clawback policy • dispute policy • sign-off checklist",
    whenToPull: "Multi-state growth, reclassifying roles, new clawback terms, acquisitions, or repeated wage disputes.",
    moves: "Wage & hour compliance • commission/bonus definitions • clawbacks • dispute language • state-by-state constraints",
    blast: "Wage claims • fines/penalties • class action exposure • reputational damage • forced plan reversals",
    scoreboard: "Compliance audit pass rate • open legal matters • policy exception count • dispute aging",
    artifacts: "Jurisdiction matrix • approved clause library • clawback policy • dispute policy",
    prevSlug: "incentive-architecture",
    nextSlug: "capacity-coverage",
  },
  "capacity-coverage": {
    header: "Planning",
    name: "Capacity & Coverage",
    tagline: "Who sells what—and what's actually possible.",
    color: "#3B82F6",
    icon: TargetIcon,
    whatItIs: "The feasibility layer—turning market potential into territory design, quotas, and staffing that humans can actually hit.",
    whenToPullBullets: [
      "Low attainment, churn in specific regions, or long ramp times",
      "Leadership arguing \"it's unfair\" every cycle",
    ],
    commonFailures: [
      "Quotas set from targets, not capacity",
      "\"Fairness\" argued with anecdotes instead of coverage math",
      "Coverage gaps in key segments while other segments are overstaffed",
      "Ramp assumptions borrowed from last year's reality",
    ],
    fastWins: [
      "Publish a quota methodology (even if imperfect) and iterate it",
      "Establish a territory balance score (call imbalance what it is)",
      "Separate quota into new vs. existing motions if the work differs",
      "Model ramp and vacancies explicitly",
    ],
    evidenceQuestions: [
      "Territory logic is documented and repeatable",
      "Quota methodology is documented and applied",
      "Ramp assumptions are modeled and reviewed",
      "Coverage gaps are measured and visible",
      "Annual change log exists (who/what/why)",
    ],
    maturityLadder: [
      { level: 1, name: "Allocation", desc: "quotas are distributed to match a number" },
      { level: 2, name: "Documented", desc: "territory logic and quota logic are written" },
      { level: 3, name: "Modeled", desc: "capacity + ramp + coverage models drive decisions" },
      { level: 4, name: "Scenario-based", desc: "hiring and changes run through scenarios" },
      { level: 5, name: "Continuous", desc: "in-quarter drift triggers adjustments and guidance" },
    ],
    starterArtifacts: "Territory model • capacity model • quota methodology • coverage heatmap • change log",
    whenToPull: "Low attainment, churn in specific regions, long ramp, or leadership arguing \"it's unfair\" every cycle.",
    moves: "Territory design • quota setting • headcount allocation • segment coverage • ramp assumptions",
    blast: "Unfair territories • broken quotas • forecast distortion • coverage gaps • rep churn",
    scoreboard: "Territory balance score • quota attainment distribution • coverage ratio by segment • ramp-to-productivity",
    artifacts: "Territory model • capacity model • quota methodology • coverage heatmap",
    prevSlug: "compliance-guardrails",
    nextSlug: "systems-spine",
  },
  "systems-spine": {
    header: "Technology",
    name: "Systems Spine",
    tagline: "Where data breaks—and how you stop it from breaking.",
    color: "#38BDF8",
    icon: GearIcon,
    whatItIs: "The reliability layer—data contracts, integrations, and lineage that keep crediting and payouts defensible and fast.",
    whenToPullBullets: [
      "Disputes increase, close cycles slow down, or finance distrust rises",
      "\"We fixed it last month\" becomes a common phrase",
    ],
    commonFailures: [
      "No clear \"source of truth\" for crediting inputs",
      "Manual overrides treated as normal operations",
      "Fragile integrations that break silently",
      "Spreadsheet shadow accounting becoming the real system",
    ],
    fastWins: [
      "Define the data contract for crediting (fields, ownership, timing)",
      "Implement reconciliation as a first-class workflow, not an afterthought",
      "Track overrides like incidents (owner, reason, approval, evidence)",
      "Instrument pipeline latency and breakpoints",
    ],
    evidenceQuestions: [
      "Data contract for crediting inputs is defined",
      "Reconciliation is automated or run as a formal workflow",
      "Lineage is known (where numbers come from)",
      "Overrides are tracked with approvals + reason codes",
      "Release/rollback process exists for comp-impacting changes",
    ],
    maturityLadder: [
      { level: 1, name: "Manual", desc: "exports and spreadsheets run the show" },
      { level: 2, name: "Integrated", desc: "basic syncs exist but drift is common" },
      { level: 3, name: "Contracted", desc: "data contracts + reconciliations are enforced" },
      { level: 4, name: "Observable", desc: "lineage + telemetry + incident loops" },
      { level: 5, name: "Resilient", desc: "automated validation + safe rollback + proofs" },
    ],
    starterArtifacts: "Data contract • integration map • lineage diagram • reconciliation playbook • release checklist",
    whenToPull: "Disputes increase, close cycles slow down, finance distrust rises, or \"we fixed it last month\" becomes common.",
    moves: "ICM/CRM integration • crediting pipelines • identity + hierarchy sync • calc engine inputs • data lineage",
    blast: "Garbage-in payouts • slow closes • shadow spreadsheets • broken trust • audit exposure",
    scoreboard: "Reconciliation rate • pipeline latency • uptime/SLA • manual override frequency • defect escape rate",
    artifacts: "Data contract/spec • integration map • lineage diagram • reconciliation playbook",
    prevSlug: "capacity-coverage",
    nextSlug: "payout-engine",
  },
  "payout-engine": {
    header: "Operations",
    name: "Payout Engine",
    tagline: "How money actually moves.",
    color: "#34D399",
    icon: StackIcon,
    whatItIs: "The execution layer—crediting rules, calculation cycles, statements, adjustments, and payment timing.",
    whenToPullBullets: [
      "Trust issues, dispute volume spikes, or quarter-end chaos",
      "Cash flow surprises or \"finance vs. sales\" warfare",
    ],
    commonFailures: [
      "Statements that require a decoder ring",
      "Late payments (trust is gone instantly)",
      "Adjustments handled inconsistently (precedent chaos)",
      "Crediting exceptions that become unofficial rules",
    ],
    fastWins: [
      "Create a statement template that answers: What happened? Why? What's next?",
      "Publish the calc calendar and enforce it",
      "Define an adjustment taxonomy (no free-form \"misc\")",
      "Instrument disputes by root cause, not just volume",
    ],
    evidenceQuestions: [
      "Crediting rules are explicit and testable",
      "Calc calendar is published and met",
      "Statements are readable and consistent",
      "Adjustments use a controlled taxonomy",
      "Disputes are tracked with root causes, not just counts",
    ],
    maturityLadder: [
      { level: 1, name: "Batch", desc: "payouts happen, explanations don't" },
      { level: 2, name: "Repeatable", desc: "cadence stabilizes, statements improve" },
      { level: 3, name: "Controlled", desc: "adjustments governed; evidence captured" },
      { level: 4, name: "Transparent", desc: "statements readable; disputes trend down" },
      { level: 5, name: "Predictive", desc: "risks flagged before pay goes out" },
    ],
    starterArtifacts: "Crediting ruleset • calc calendar • statement template • adjustment taxonomy • dispute workflow",
    whenToPull: "Trust issues, dispute volume spikes, quarter-end chaos, or cash flow surprises.",
    moves: "Crediting rules • calc cadence • payment timing • statements • adjustments • splits/overrides",
    blast: "Late/wrong pay • cash surprises • dispute storms • attrition • \"finance vs sales\" warfare",
    scoreboard: "Payment accuracy • time-to-pay • dispute volume • adjustment rate • statement comprehension score",
    artifacts: "Crediting ruleset • calc calendar • statement template • adjustment taxonomy",
    prevSlug: "systems-spine",
    nextSlug: "signal-forecast",
  },
  "signal-forecast": {
    header: "Analytics",
    name: "Signal & Forecast",
    tagline: "What's real. What's next.",
    color: "#A78BFA",
    icon: BarChartIcon,
    whatItIs: "The decision layer—metrics, leading indicators, and forecasts that tell you what's real and what's about to break.",
    whenToPullBullets: [
      "Missed quarters, surprise shortfalls, or over-hiring",
      "Leadership losing faith in forecasting accuracy",
    ],
    commonFailures: [
      "Forecasting from pipeline fantasy",
      "Incentivizing sandbagging then acting surprised",
      "Tracking everything except the few signals that matter",
      "AI insights with no accountability or validation",
    ],
    fastWins: [
      "Pick 5–7 leading indicators that predict attainment (and kill the rest)",
      "Score forecast confidence, not just the number",
      "Implement anomaly detection on crediting + payout patterns",
      "Validate AI insights against outcomes (precision/recall, not vibes)",
    ],
    evidenceQuestions: [
      "Metric dictionary exists (definitions don't drift)",
      "Leading indicators are identified and monitored",
      "Forecast confidence is scored (not just forecast value)",
      "Scenario dashboard exists (base/up/down)",
      "Alerts exist for attainment drift / payout anomalies",
    ],
    maturityLadder: [
      { level: 1, name: "Reporting", desc: "dashboards describe the past" },
      { level: 2, name: "Scorecards", desc: "consistent KPIs drive reviews" },
      { level: 3, name: "Predictive", desc: "leading indicators forecast outcomes" },
      { level: 4, name: "Automated", desc: "anomalies + alerts + playbooks" },
      { level: 5, name: "Closed-loop", desc: "actions are tracked and measured for impact" },
    ],
    starterArtifacts: "Metric dictionary • signal catalog • forecast scorecard • anomaly rules • scenario dashboard",
    whenToPull: "Missed quarters, surprise shortfalls, over-hiring, or leadership losing faith in forecasting.",
    moves: "Leading indicators • forecast confidence • pipeline hygiene • attainment trajectories • risk flags",
    blast: "Sandbagging • missed quarters • over/under hiring • misallocated spend • \"false confidence\" decisions",
    scoreboard: "Forecast accuracy % • pipeline conversion • signal-to-close correlation • attainment drift",
    artifacts: "Metric dictionary • signal catalog • forecast scorecard • scenario dashboard",
    prevSlug: "payout-engine",
    nextSlug: "controls-evidence",
  },
  "controls-evidence": {
    header: "Governance",
    name: "Controls & Evidence",
    tagline: "Prove it. Audit it. Defend it.",
    color: "#F87171",
    icon: LockClosedIcon,
    whatItIs: "The defensibility layer—approvals, change control, audit trails, and evidence that proves calculations and decisions were valid.",
    whenToPullBullets: [
      "SOX scope, 409A exposure, leadership turnover, or M&A",
      "Anytime payouts become a board-level topic",
    ],
    commonFailures: [
      "Plan changes made \"because exec said so\" with no record",
      "Missing approvals and inconsistent controls",
      "Evidence scattered across email, Slack, and spreadsheets",
      "Audit readiness treated as a last-minute scramble",
    ],
    fastWins: [
      "Build a control matrix and assign owners",
      "Version everything that affects payouts (plans, rates, hierarchies, crediting)",
      "Capture evidence at the moment of decision (not retroactively)",
      "Timebox approvals with escalation paths",
    ],
    evidenceQuestions: [
      "Control matrix exists with owners and frequencies",
      "SoD is enforced for comp-impacting actions",
      "Change control is required and auditable",
      "Evidence is captured at decision time (not retroactive)",
      "Audit packet can be produced on demand",
    ],
    maturityLadder: [
      { level: 1, name: "Informal", desc: "changes happen, records don't" },
      { level: 2, name: "Logged", desc: "change logs exist but aren't enforced" },
      { level: 3, name: "Controlled", desc: "approvals and SoD are systematic" },
      { level: 4, name: "Evidenced", desc: "evidence chain is complete and searchable" },
      { level: 5, name: "Auditable-by-default", desc: "audits become routine, not events" },
    ],
    starterArtifacts: "Control matrix • approval workflow • evidence chain spec • change log standard • audit packet template",
    whenToPull: "SOX scope, 409A exposure, leadership turnover, M&A, or anytime payouts become a board-level topic.",
    moves: "Approvals • segregation of duties • change control • versioning • evidence capture • SOX/409A alignment",
    blast: "Audit findings • restatements • uncontrolled plan changes • exec liability • credibility loss",
    scoreboard: "Control deficiency count • audit cycle time • evidence completeness • change failure rate",
    artifacts: "Control matrix • evidence chain spec • approval workflow • audit packet template",
    prevSlug: "signal-forecast",
    nextSlug: "enablement-loop",
  },
  "enablement-loop": {
    header: "Enablement",
    name: "Enablement Loop",
    tagline: "Make it understood. Make it stick.",
    color: "#FBBF24",
    icon: RocketIcon,
    whatItIs: "The adoption layer—training, manager coaching, communications, and feedback loops that prevent plan drift and rep confusion.",
    whenToPullBullets: [
      "New plan, new roles, dispute spikes, or morale issues",
      "When \"nobody understands comp\" becomes normal",
    ],
    commonFailures: [
      "Launching a plan once and calling it \"done\"",
      "Managers unable to explain the plan (so reps invent one)",
      "Feedback that never changes anything",
      "Enablement treated as a slide deck, not an operating loop",
    ],
    fastWins: [
      "Require manager certification before go-live",
      "Build a rep quick-guide + decision tree (one-page, not a novel)",
      "Run a 30/60/90 feedback loop and publish what changed",
      "Track \"time-to-clarity\" for questions and disputes",
    ],
    evidenceQuestions: [
      "Managers are certified before launch",
      "Rep quick-guide exists + is used",
      "FAQ/decision tree exists and is maintained",
      "Feedback loop cadence exists (30/60/90)",
      "\"Time-to-clarity\" is measured and improving",
    ],
    maturityLadder: [
      { level: 1, name: "Announcement", desc: "info is pushed, understanding is assumed" },
      { level: 2, name: "Training", desc: "sessions exist, retention is unknown" },
      { level: 3, name: "Certified", desc: "managers prove readiness" },
      { level: 4, name: "Feedback-looped", desc: "recurring issues drive fixes" },
      { level: 5, name: "Self-healing", desc: "the system detects confusion and responds" },
    ],
    starterArtifacts: "Plan story deck • manager talk track • rep quick-guide • FAQ decision tree • feedback cadence",
    whenToPull: "New plan, new roles, dispute spikes, morale issues, or when \"nobody understands comp\" becomes normal.",
    moves: "Rep comprehension • manager coaching • comms cadence • onboarding • feedback intake • reinforcement rhythm",
    blast: "Low adoption • gaming • surprise disputes • morale drops • field-led \"alternate rules\"",
    scoreboard: "Plan comprehension score • manager certification • time-to-clarity • repeat-issue rate • enablement NPS",
    artifacts: "Plan story deck • manager talk track • rep quick-guide • FAQ + decision tree",
    prevSlug: "controls-evidence",
    nextSlug: null,
  },
};

export default async function LeverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lever = leverData[slug];

  if (!lever) {
    notFound();
  }

  const Icon = lever.icon;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Levers
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Category badge */}
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-white mb-4"
            style={{ backgroundColor: lever.color }}
          >
            {lever.header}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {lever.name}
          </h1>

          {/* Tagline */}
          <p className="text-xl text-slate-300 mb-6">
            {lever.tagline}
          </p>

          {/* What it is */}
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mb-6">
            {lever.whatItIs}
          </p>

          {/* When to pull */}
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: lever.color }}>
              When to Pull This Lever
            </h3>
            <ul className="space-y-2">
              {lever.whenToPullBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span style={{ color: lever.color }}>•</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The Consequences Section */}
      <section className="py-12 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">The Consequences</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* What It Moves */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: lever.color }}>
                What It Moves
              </h3>
              <p className="text-slate-200 leading-relaxed">{lever.moves}</p>
            </div>

            {/* Blast Radius */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-red-400">
                Blast Radius
              </h3>
              <p className="text-slate-200 leading-relaxed">{lever.blast}</p>
            </div>

            {/* Scoreboard */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-emerald-400">
                Scoreboard
              </h3>
              <p className="text-slate-200 leading-relaxed">{lever.scoreboard}</p>
            </div>

            {/* Default Artifacts */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-sky-400">
                Default Artifacts
              </h3>
              <p className="text-slate-200 leading-relaxed">{lever.artifacts}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Failures */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Common Failures</h2>
          <ul className="space-y-3">
            {lever.commonFailures.map((failure, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-red-400 mt-1">•</span>
                <span className="text-slate-300">{failure}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fast Wins */}
      <section className="py-12 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Fast Wins</h2>
          <ul className="space-y-3">
            {lever.fastWins.map((win, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span className="text-slate-300">{win}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Evidence Questions (Score This Lever) */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Score This Lever</h2>
          <p className="text-slate-400 mb-6 text-sm">
            If you can&apos;t answer &quot;yes&quot; with proof, you don&apos;t score above 2.
          </p>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-4">
              {lever.evidenceQuestions.map((question, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded border-2 border-slate-500 shrink-0 flex items-center justify-center">
                    <span className="text-slate-500 text-xs">{idx + 1}</span>
                  </div>
                  <span className="text-slate-200">{question}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-slate-500 text-xs mt-4 italic">
            Score: 0 (Missing) → 1 (Documented) → 2 (Repeatable) → 3 (Controlled) → 4 (Optimized)
          </p>
        </div>
      </section>

      {/* Maturity Ladder */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Maturity Ladder</h2>
          <div className="space-y-4">
            {lever.maturityLadder.map((level) => (
              <div key={level.level} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: lever.color, opacity: 0.2 + (level.level * 0.16) }}
                >
                  {level.level}
                </div>
                <div>
                  <p className="text-white font-semibold">{level.name}</p>
                  <p className="text-slate-400 text-sm">{level.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Kit */}
      <section className="py-12 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">The Kit</h2>

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-sky-400">
              Starter Artifacts
            </h3>
            <p className="text-slate-200">{lever.starterArtifacts}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: lever.color }}>
              When to Pull This Lever
            </h3>
            <p className="text-slate-200">{lever.whenToPull}</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {lever.prevSlug ? (
            <Link
              href={`/levers/${lever.prevSlug}`}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Previous Lever
            </Link>
          ) : (
            <div />
          )}

          {lever.nextSlug ? (
            <Link
              href={`/levers/${lever.nextSlug}`}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              Next Lever
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              Back to Home
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(leverData).map((slug) => ({ slug }));
}
