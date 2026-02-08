"use client";

import Link from "next/link";

// The 6 steps of the Intelligent SPM System
const systemSteps = [
  {
    number: 1,
    name: "Diagnose",
    description: "Plan clarity, logic integrity, risk exposure, tool fit",
    color: "#38BDF8", // Cyan
  },
  {
    number: 2,
    name: "Design",
    description: "Fix structure: definitions, rules, measures, guardrails",
    color: "#A3E635", // Green
  },
  {
    number: 3,
    name: "Implement",
    description: "Translate plan → executable logic (ICM + controls)",
    color: "#FACC15", // Yellow
  },
  {
    number: 4,
    name: "Govern",
    description: "Policies, approvals, exception handling, audit trails",
    color: "#FB923C", // Orange
  },
  {
    number: 5,
    name: "Monitor",
    description: "Drift detection, dispute analytics, payout anomaly alerts",
    color: "#F472B6", // Pink
  },
  {
    number: 6,
    name: "Evolve",
    description: "Controlled changes, simulations, comms, training updates",
    color: "#8B5CF6", // Purple
  },
];

// Pain points that comp admins face
const painPoints = [
  "Forecasting comp cost? That's adorable.",
  "Quota and territory changes don't \"require adjustments.\" They trigger a controlled burn.",
  "Month 1: 1 exception. Month 12: 2,000 exceptions. That's not edge cases—that's a parallel plan.",
  "Your plan contradicts itself—then contradicts reality for fun.",
  "Sales leadership treats overrides like ATMs: swipe, approve, move on.",
  "You don't have a plan. You have a collection of interpretations.",
  "Disputes don't \"rise.\" They detonate mid-year.",
  "\"Just make it work\" becomes the most common payout rule.",
  "Reps find loopholes faster than Ops can find the original spreadsheet.",
];

export default function SoftwarePage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Hero Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #38BDF820 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, #8B5CF620 0%, transparent 40%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#38BDF8] mb-4">
            Intelligent SPM Software
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E2E8F0] mb-6 leading-tight">
            The tools and modules that power{" "}
            <span className="text-[#38BDF8]">evidence-based</span> sales performance management.
          </h1>
          <div className="mt-10">
            <Link href="/toddfather/contact">
              <button className="px-8 py-4 rounded-xl text-white font-bold bg-[#FF8737] hover:bg-[#FF8737]/90 transition-all hover:scale-105 text-lg">
                Request a Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-8 md:p-12 border border-[#38BDF8]/20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#E2E8F0] mb-6">
              I&apos;m Building Intelligent Software for People Who Get Blamed When It Breaks...
            </h2>
            <p className="text-xl text-[#94A3B8] mb-8">
              ...and literally just want to take their kid to baseball practice.{" "}
              <span className="text-[#38BDF8] font-semibold">
                Intelligent SPM monitors the system so comp admins get their lives back.
              </span>
            </p>

            <div className="space-y-4">
              {painPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#0F172A]/50 border border-[#64748B]/10 hover:border-[#FF8737]/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF8737]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-[#FF8737]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-[#94A3B8] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Intelligent SPM System */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-4">
              The Intelligent SPM System
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-3xl mx-auto">
              I run SPM like a governed product: define the spec, prove the logic, control
              exceptions, and continuously monitor drift. It&apos;s a loop—because comp isn&apos;t a project.{" "}
              <span className="text-[#38BDF8] font-semibold">It&apos;s an operating system.</span>
            </p>
          </div>

          {/* Loop Visualization */}
          <div className="relative">
            {/* Center loop indicator */}
            <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed border-[#38BDF8]/30 items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-8 h-8 text-[#38BDF8] mx-auto mb-1 animate-spin"
                  style={{ animationDuration: "8s" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-xs text-[#38BDF8] font-medium">CONTINUOUS</span>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemSteps.map((step) => (
                <div
                  key={step.number}
                  className="group relative bg-white/5 rounded-2xl p-6 border transition-all hover:scale-[1.02] hover:shadow-xl"
                  style={{ borderColor: `${step.color}30` }}
                >
                  {/* Step number */}
                  <div
                    className="absolute -top-4 -left-2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>

                  {/* Arrow to next (hidden on last item and mobile) */}
                  {step.number < 6 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <svg
                        className="w-6 h-6 text-[#64748B]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Loop back arrow from step 6 */}
                  {step.number === 6 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <svg
                        className="w-6 h-6"
                        style={{ color: step.color }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="pt-4">
                    <h3
                      className="text-xl font-bold mb-2 group-hover:opacity-90 transition-opacity"
                      style={{ color: step.color }}
                    >
                      {step.name}
                    </h3>
                    <p className="text-[#94A3B8]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile loop indicator */}
          <div className="lg:hidden flex justify-center mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#38BDF8]/30">
              <svg
                className="w-5 h-5 text-[#38BDF8] animate-spin"
                style={{ animationDuration: "8s" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm text-[#38BDF8] font-medium">Continuous Loop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-6 border-t border-white/10 bg-[#0F172A]/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-xl p-6 border border-[#38BDF8]/20">
              <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#38BDF8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-2">Plan Validation</h3>
              <p className="text-[#94A3B8] text-sm">
                Catch contradictions, ambiguities, and loopholes before reps find them.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-[#A3E635]/20">
              <div className="w-12 h-12 rounded-xl bg-[#A3E635]/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#A3E635]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-2">Exception Governance</h3>
              <p className="text-[#94A3B8] text-sm">
                Track, categorize, and control exceptions before they become the plan.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-[#F472B6]/20">
              <div className="w-12 h-12 rounded-xl bg-[#F472B6]/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#F472B6]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-2">Drift Monitoring</h3>
              <p className="text-[#94A3B8] text-sm">
                Real-time alerts when payouts deviate from expected patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-6">
            Ready to govern your comp like an operating system?
          </h2>
          <p className="text-xl text-[#94A3B8] mb-10">
            Let&apos;s talk about what&apos;s breaking—and how to fix it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/toddfather/contact">
              <button className="px-8 py-4 rounded-xl text-white font-bold bg-[#FF8737] hover:bg-[#FF8737]/90 transition-all hover:scale-105">
                Request a Demo
              </button>
            </Link>
            <Link href="/healthcheck/spm">
              <button className="px-8 py-4 rounded-xl text-[#E2E8F0] font-bold bg-white/5 border border-[#38BDF8]/30 hover:border-[#38BDF8]/60 transition-all">
                Take the SPM Healthcheck
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
