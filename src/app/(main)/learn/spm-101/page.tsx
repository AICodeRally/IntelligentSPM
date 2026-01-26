import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SPM 101 | IntelligentSPM",
  description: "The fundamentals of Sales Performance Management. What the vendors won't tell you.",
};

const pillars = [
  { abbr: "SP", name: "Sales Planning", desc: "Territory design, quota allocation, and capacity modeling" },
  { abbr: "ICM", name: "Incentive Compensation", desc: "Plan design, calculation, and payment accuracy" },
  { abbr: "SI", name: "Sales Insights", desc: "Analytics, dashboards, and performance visibility" },
  { abbr: "GC", name: "Governance & Compliance", desc: "Policies, controls, and audit readiness" },
  { abbr: "TP", name: "Territory Planning", desc: "Account assignment, coverage, and balance" },
  { abbr: "SD", name: "Sales Data", desc: "Transactions, hierarchies, and data quality" },
  { abbr: "IC", name: "Integration & Connectivity", desc: "CRM, ERP, and HRIS connections" },
  { abbr: "LR", name: "Legal & Regulatory", desc: "State wage laws, 409A, international compliance" },
];

const mistakes = [
  {
    title: "Starting with the Tool",
    description: "Buying software before defining processes. The tool amplifies whatever you put into it—including chaos.",
  },
  {
    title: "Ignoring Governance",
    description: "No exception policy, no dispute process, no audit trail. When things go wrong—and they will—you have nothing.",
  },
  {
    title: "Copy-Paste Plans",
    description: "Reusing last year's plan without analysis. Markets change, roles change, but somehow the accelerator curve stays the same.",
  },
  {
    title: "Data as Afterthought",
    description: "Assuming clean data will appear. It won't. Every SPM failure I've seen traces back to data.",
  },
];

export default function SPM101Page() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#38BDF8] mb-4">
              The Foundation
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
              SPM 101
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              What the vendors won&apos;t tell you. The real fundamentals of Sales Performance Management,
              from someone who&apos;s seen it all.
            </p>
          </div>

          {/* What is SPM */}
          <div className="bg-[#1E293B] rounded-xl p-8 border border-[#38BDF8]/20 mb-8">
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-4">What is SPM?</h2>
            <div className="space-y-4 text-[#94A3B8]">
              <p>
                <span className="text-[#38BDF8] font-semibold">Sales Performance Management</span> is the discipline
                of designing, managing, and optimizing how you pay your sales team. But that definition sells it short.
              </p>
              <p>
                SPM is really about <span className="text-[#E2E8F0]">alignment</span>—making sure your incentive plans,
                territories, quotas, and governance all work together to drive the behaviors you actually want.
              </p>
              <p>
                Get it right, and your top performers stay, your middle performers rise, and your company hits its numbers.
                Get it wrong, and you&apos;re explaining to the board why your best seller just joined a competitor.
              </p>
            </div>
          </div>

          {/* The 8 Pillars */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-6">The 8 Pillars of SPM</h2>
            <p className="text-[#94A3B8] mb-6">
              Every mature SPM practice rests on these eight pillars. Miss one, and the whole thing wobbles.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.abbr}
                  className="bg-[#1E293B] rounded-xl p-5 border border-[#38BDF8]/10 hover:border-[#38BDF8]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] font-bold text-sm">
                      {pillar.abbr}
                    </span>
                    <h3 className="font-bold text-[#E2E8F0]">{pillar.name}</h3>
                  </div>
                  <p className="text-sm text-[#94A3B8] pl-[52px]">{pillar.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/learn/8-pillars"
                className="inline-flex items-center gap-2 text-[#38BDF8] hover:text-[#38BDF8]/80 font-semibold"
              >
                Deep dive into each pillar
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Why Governance Matters */}
          <div className="bg-gradient-to-r from-[#8241C8]/20 to-[#38BDF8]/20 rounded-xl p-8 border border-[#8241C8]/20 mb-8">
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-4">Why Governance Matters</h2>
            <div className="space-y-4 text-[#94A3B8]">
              <p>
                Ask most companies about their SPM governance and you&apos;ll get a blank stare. Or worse—a drawer full of
                dusty PDFs that nobody follows.
              </p>
              <p>
                <span className="text-[#E2E8F0]">Governance is the layer everyone skips.</span> And it&apos;s exactly why
                SPM programs fail. Without clear policies for exceptions, disputes, clawbacks, and mid-period changes,
                you&apos;re flying blind.
              </p>
              <p>
                When a top performer disputes a commission, what happens? When someone leaves mid-quarter, how do you
                calculate their final pay? When a deal gets clawed back 14 months later, who eats the cost?
              </p>
              <p className="text-[#8241C8]">
                If you don&apos;t have documented answers to these questions, you have a governance gap.
              </p>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-6">Common Mistakes</h2>
            <p className="text-[#94A3B8] mb-6">
              After 30 years in this space, I&apos;ve seen the same mistakes over and over. Here are the big ones:
            </p>
            <div className="space-y-4">
              {mistakes.map((mistake, i) => (
                <div
                  key={mistake.title}
                  className="bg-[#1E293B] rounded-xl p-5 border border-[#EA1B85]/10 flex gap-4"
                >
                  <span className="text-[#EA1B85] font-mono text-sm mt-1">0{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-[#E2E8F0] mb-1">{mistake.title}</h3>
                    <p className="text-sm text-[#94A3B8]">{mistake.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Where to Start */}
          <div className="bg-[#1E293B] rounded-xl p-8 border border-[#A3E635]/20">
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-4">Where to Start</h2>
            <div className="space-y-4 text-[#94A3B8] mb-6">
              <p>
                If you&apos;re new to SPM or trying to fix a broken program, start here:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li><span className="text-[#E2E8F0]">Audit your current state.</span> What policies exist? What&apos;s actually followed?</li>
                <li><span className="text-[#E2E8F0]">Map your data flow.</span> Where does transaction data live? How clean is it?</li>
                <li><span className="text-[#E2E8F0]">Document your exceptions.</span> Start tracking how disputes are resolved today.</li>
                <li><span className="text-[#E2E8F0]">Assess your 8 pillars.</span> Score yourself honestly on each one.</li>
              </ol>
            </div>
            <Link
              href="/healthcheck/spm"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#A3E635] text-[#0F172A] font-bold rounded-xl hover:bg-[#A3E635]/90 transition-colors"
            >
              Take the SPM Healthcheck
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
