"use client";

import Link from "next/link";

const credentials = [
  "Led SPM transformations at 50+ enterprises",
  "Implemented every major ICM platform (Xactly, Varicent, Anaplan, CaptivateIQ, SAP, Oracle)",
  "Designed comp plans for sales teams from 50 to 50,000",
  "Survived 200+ plan year rollovers",
  "Resolved thousands of commission disputes",
  "Built governance frameworks that actually work",
];

const whatIveSeen = [
  {
    title: "The $4M Calculation Error",
    description: "A single formula mistake that took 6 months to unwind.",
  },
  {
    title: "The Accelerator That Broke the CFO",
    description: "Uncapped upside + whale deal = board-level crisis.",
  },
  {
    title: "The Exception Queue That Became the Plan",
    description: "2,000 exceptions per quarter. Nobody knew what the actual rules were.",
  },
  {
    title: "The Territory Change Massacre",
    description: "Mid-year realignment with no transition rules. Lawsuits followed.",
  },
  {
    title: "The Clawback That Wasn't Legal",
    description: "California wage law doesn't care about your plan document.",
  },
  {
    title: "The ICM Implementation That Never Ended",
    description: "Three years, four vendors, zero adoption.",
  },
];

export default function ToddfatherPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, #FF873730 0%, transparent 50%)",
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#FF8737] to-[#FF8737]/50 flex items-center justify-center text-6xl font-bold text-white shadow-2xl">
                TF
              </div>
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#FF8737] mb-3">
                The Voice Behind IntelligentSPM
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-4">
                The Toddfather
              </h1>
              <p className="text-2xl text-[#94A3B8]">
                30 Years of Knowing What Breaks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#E2E8F0] mb-8">The Short Version</h2>
          <div className="space-y-6 text-lg text-[#94A3B8] leading-relaxed">
            <p>
              I&apos;ve spent three decades inside the machine—building comp plans, implementing ICM systems,
              designing governance frameworks, and cleaning up the messes when they break. And they always break.
            </p>
            <p>
              I&apos;ve worked with startups burning through their first commission spreadsheet and enterprises
              running billion-dollar sales organizations. I&apos;ve seen every vendor pitch, survived every
              &ldquo;best practice&rdquo; framework, and fixed the problems that neither could solve.
            </p>
            <p>
              <span className="text-[#E2E8F0] font-semibold">The pattern is always the same:</span>
              {" "}Plans get designed in theory, implemented in chaos, and governed by exceptions.
              Nobody tells you this upfront. I do.
            </p>
          </div>
        </div>
      </section>

      {/* What I've Seen */}
      <section className="py-16 px-6 border-t border-white/10 bg-[#0F172A]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#E2E8F0] mb-4">What I&apos;ve Seen</h2>
          <p className="text-[#94A3B8] mb-10">
            These aren&apos;t hypotheticals. These are scars.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {whatIveSeen.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-6 border border-[#FF8737]/10 hover:border-[#FF8737]/30 transition-all"
              >
                <h3 className="text-lg font-bold text-[#FF8737] mb-2">{item.title}</h3>
                <p className="text-[#94A3B8]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#E2E8F0] mb-8">The Resume Version</h2>
          <div className="space-y-4">
            {credentials.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#FF8737]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 text-[#FF8737]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-[#94A3B8] text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Promise */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-10 border border-[#FF8737]/20 text-center">
            <h2 className="text-3xl font-bold text-[#FF8737] mb-8">The Toddfather Promise</h2>
            <div className="space-y-4 text-xl">
              <p className="text-[#E2E8F0]">No vendor spin.</p>
              <p className="text-[#E2E8F0]">No consultant theater.</p>
              <p className="text-[#E2E8F0]">No &ldquo;best practice&rdquo; bullshit.</p>
            </div>
            <div className="mt-8 pt-8 border-t border-[#64748B]/20">
              <p className="text-[#94A3B8] text-lg">
                Just the truth about what works, what breaks, and why.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why I Built This */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#E2E8F0] mb-8">Why I Built IntelligentSPM</h2>
          <div className="space-y-6 text-lg text-[#94A3B8] leading-relaxed">
            <p>
              Because comp admins deserve to go home on time. Because finance leaders shouldn&apos;t
              fear the audit. Because sales reps should trust their paychecks.
            </p>
            <p>
              I&apos;ve watched too many talented people burn out fighting systems that were
              designed wrong from day one. I&apos;ve seen too many &ldquo;transformations&rdquo; that
              transformed nothing except the vendor&apos;s revenue.
            </p>
            <p className="text-[#E2E8F0] font-semibold">
              IntelligentSPM is the toolset I wish existed 20 years ago. Now it does.
            </p>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-12 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
          <Link href="/content/blog">
            <div className="bg-white/5 rounded-xl p-6 border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 transition-all cursor-pointer h-full">
              <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[#38BDF8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-2">Blog</h3>
              <p className="text-[#94A3B8] text-sm">SPM reality. No fluff.</p>
            </div>
          </Link>
          <Link href="/toddfather/speaking">
            <div className="bg-white/5 rounded-xl p-6 border border-[#A3E635]/20 hover:border-[#A3E635]/40 transition-all cursor-pointer h-full">
              <div className="w-10 h-10 rounded-lg bg-[#A3E635]/20 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[#A3E635]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-2">Speaking</h3>
              <p className="text-[#94A3B8] text-sm">Keynotes & workshops.</p>
            </div>
          </Link>
          <Link href="/toddfather/contact">
            <div className="bg-white/5 rounded-xl p-6 border border-[#FF8737]/20 hover:border-[#FF8737]/40 transition-all cursor-pointer h-full">
              <div className="w-10 h-10 rounded-lg bg-[#FF8737]/20 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[#FF8737]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-2">Contact</h3>
              <p className="text-[#94A3B8] text-sm">Let&apos;s talk.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#E2E8F0] mb-4">Stay Connected</h2>
          <p className="text-[#94A3B8] mb-8">
            Weekly SPM insights. No spam. Unsubscribe anytime.
          </p>
          <Link href="/syndicate">
            <button className="px-8 py-4 rounded-xl text-white font-bold text-lg bg-[#FF8737] hover:bg-[#FF8737]/90 transition-all hover:scale-105">
              Join The Syndicate
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
