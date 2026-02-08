import Link from "next/link";
import {
  TargetIcon,
  StackIcon,
  BarChartIcon,
  LockClosedIcon,
  GearIcon,
  MixerHorizontalIcon,
  RocketIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";

// Condensed lever data for the grid
const levers = [
  {
    id: "strategy",
    header: "Strategy",
    name: "Incentive Architecture",
    tagline: "Reward intent. Predict behavior.",
    consequence: "Pull wrong → behavior + cost drift.",
    color: "#ea580c",
    icon: MixerHorizontalIcon,
    slug: "incentive-architecture",
  },
  {
    id: "legal",
    header: "Legal",
    name: "Compliance Guardrails",
    tagline: "What you're allowed to do.",
    consequence: "Pull wrong → legal exposure.",
    color: "#4f46e5",
    icon: ReaderIcon,
    slug: "compliance-guardrails",
  },
  {
    id: "planning",
    header: "Planning",
    name: "Capacity & Coverage",
    tagline: "Who sells what—and what's possible.",
    consequence: "Pull wrong → unfair quotas + gaps.",
    color: "#2563eb",
    icon: TargetIcon,
    slug: "capacity-coverage",
  },
  {
    id: "technology",
    header: "Technology",
    name: "Systems Spine",
    tagline: "Stop data breaks before payouts do.",
    consequence: "Pull wrong → spreadsheets + distrust.",
    color: "#0891b2",
    icon: GearIcon,
    slug: "systems-spine",
  },
  {
    id: "operations",
    header: "Operations",
    name: "Payout Engine",
    tagline: "How money actually moves.",
    consequence: "Pull wrong → late pay + disputes.",
    color: "#16a34a",
    icon: StackIcon,
    slug: "payout-engine",
  },
  {
    id: "analytics",
    header: "Analytics",
    name: "Signal & Forecast",
    tagline: "What's real. What's next.",
    consequence: "Pull wrong → bad calls + missed quarters.",
    color: "#9333ea",
    icon: BarChartIcon,
    slug: "signal-forecast",
  },
  {
    id: "governance",
    header: "Governance",
    name: "Controls & Evidence",
    tagline: "Prove it. Audit it. Defend it.",
    consequence: "Pull wrong → findings + liability.",
    color: "#dc2626",
    icon: LockClosedIcon,
    slug: "controls-evidence",
  },
  {
    id: "enablement",
    header: "Enablement",
    name: "Enablement Loop",
    tagline: "Make it understood. Make it stick.",
    consequence: "Pull wrong → confusion + gaming.",
    color: "#ca8a04",
    icon: RocketIcon,
    slug: "enablement-loop",
  },
];

export default function LeversPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-white">Intelligent</span>
            <span className="text-[#38BDF8]">SPM</span>
          </Link>
        </div>
      </header>

      {/* Intro Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The 8 Levers of SPM
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Pull a lever. See the consequences.
          </p>

          {/* What this is */}
          <div className="text-left bg-white/5 rounded-xl p-8 border border-white/10 mb-12">
            <h2 className="text-lg font-bold text-white mb-4">What this is</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              SPM isn&apos;t a department—it&apos;s a control system. These eight levers are the knobs that shape behavior, payout accuracy, audit defensibility, and forecast truth.
            </p>

            <h2 className="text-lg font-bold text-white mb-4">How to use it</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-[#38BDF8] font-bold">Explore:</span>
                Click a lever to see what it moves, the blast radius, the scoreboard, and the default artifacts.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#38BDF8] font-bold">Diagnose:</span>
                Score each lever 0–4. The gaps tell you what&apos;s breaking (or about to).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#38BDF8] font-bold">Fix:</span>
                Prioritize the lowest scores with the biggest blast radius. Ship artifacts, not opinions.
              </li>
            </ul>
          </div>

          {/* The Loop */}
          <div className="mb-12">
            <h2 className="text-lg font-bold text-white mb-4">The Map (how the levers work together)</h2>
            <p className="text-slate-400 mb-4">SPM runs as a closed loop:</p>
            <div className="bg-black/30 rounded-xl p-6 border border-white/10 overflow-x-auto">
              <div className="flex items-center justify-center gap-4 text-sm font-mono min-w-max">
                <div className="text-center">
                  <div className="text-[#ea580c] font-bold">DESIGN</div>
                  <div className="text-slate-500 text-xs">(Intent)</div>
                </div>
                <span className="text-slate-500">→</span>
                <div className="text-center">
                  <div className="text-[#16a34a] font-bold">EXECUTE</div>
                  <div className="text-slate-500 text-xs">(Payout)</div>
                </div>
                <span className="text-slate-500">→</span>
                <div className="text-center">
                  <div className="text-[#dc2626] font-bold">PROVE</div>
                  <div className="text-slate-500 text-xs">(Audit)</div>
                </div>
                <span className="text-slate-500">→</span>
                <div className="text-center">
                  <div className="text-[#9333ea] font-bold">LEARN</div>
                  <div className="text-slate-500 text-xs">(Signals)</div>
                </div>
                <span className="text-slate-500">→</span>
                <div className="text-center">
                  <div className="text-[#ca8a04] font-bold">ADOPT</div>
                  <div className="text-slate-500 text-xs">(Field)</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-2 min-w-max">
                <span>Strategy/Legal/Planning</span>
                <span className="opacity-0">→</span>
                <span>Ops/Tech</span>
                <span className="opacity-0">→</span>
                <span>Governance</span>
                <span className="opacity-0">→</span>
                <span>Analytics</span>
                <span className="opacity-0">→</span>
                <span>Enablement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lever Grid */}
      <section className="py-12 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {levers.map((lever) => (
              <Link
                key={lever.id}
                href={`/levers/${lever.slug}`}
                className="group bg-white/5 rounded-xl border border-white/10 p-6 hover:border-white/30 hover:bg-white/10 transition-all"
              >
                {/* Category */}
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-3"
                  style={{ backgroundColor: lever.color }}
                >
                  {lever.header}
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:underline">
                  {lever.name}
                </h3>

                {/* Tagline */}
                <p className="text-sm text-slate-300 mb-3">
                  {lever.tagline}
                </p>

                {/* Consequence */}
                <p className="text-sm text-red-400 italic">
                  {lever.consequence}
                </p>
              </Link>
            ))}
          </div>

          {/* Closing line */}
          <p className="text-center text-slate-400 mt-10 text-sm">
            Each lever includes <span className="text-white font-medium">Moves / Blast Radius / Scoreboard / Artifacts</span> playbook.
          </p>
        </div>
      </section>

      {/* What Good Looks Like */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What &quot;good&quot; looks like</h2>
          <p className="text-slate-400 text-center mb-8">When this works, you get:</p>
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-emerald-400">✓</span>
              <span className="text-slate-200">Plans people understand and finance can defend</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-emerald-400">✓</span>
              <span className="text-slate-200">Payouts that are accurate and explainable</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-emerald-400">✓</span>
              <span className="text-slate-200">Forecasts that don&apos;t rely on hope</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-emerald-400">✓</span>
              <span className="text-slate-200">Exceptions that shrink over time (because causes get fixed)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 bg-black/20 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/healthcheck/spm"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#38BDF8] text-black font-bold rounded-lg hover:bg-[#38BDF8]/90 transition-colors"
          >
            Run the 10-minute Self-Check →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
