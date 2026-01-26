"use client";

import WaitlistForm from "@/components/forms/WaitlistForm";

const pillars = ["SP", "ICM", "SI", "GC", "TP", "SD", "IC", "LR"];

export default function SPMHealthcheckContent() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#38BDF8] flex items-center justify-center text-2xl font-bold text-[#0F172A] mx-auto mb-8">
            SPM
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            SPM Healthcheck
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            Answer questions about your current SPM state. Get scored against the 8 pillars
            with specific recommendations for improvement.
          </p>

          {/* Waitlist Card */}
          <div className="bg-[#1E293B] rounded-xl p-8 md:p-10 border border-[#38BDF8]/20 max-w-md mx-auto mb-12">
            <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">Coming Soon</h3>
            <p className="text-[#94A3B8] text-sm mb-6">
              Be the first to assess your SPM program against the 8 pillars.
            </p>
            <WaitlistForm
              listName="healthcheck-spm"
              accentColor="#38BDF8"
              successMessage="We'll notify you when SPM Assessment launches."
            />
          </div>

          {/* Pillars Preview */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-[#38BDF8]/10">
            <p className="text-[#64748B] text-sm mb-4">Assessed against the 8 pillars:</p>
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
              {pillars.map((abbr) => (
                <div
                  key={abbr}
                  className="w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center text-sm font-bold text-[#38BDF8] border border-[#38BDF8]/20 mx-auto"
                >
                  {abbr}
                </div>
              ))}
            </div>
          </div>

          {/* What You'll Get */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: "Pillar Scores", desc: "Individual rating for each of the 8 SPM pillars" },
              { title: "Gap Analysis", desc: "Where you're strong and where you need work" },
              { title: "Action Items", desc: "Specific next steps prioritized by impact" },
            ].map((item) => (
              <div key={item.title} className="bg-[#1E293B] rounded-xl p-5 border border-[#38BDF8]/10">
                <h4 className="font-bold text-[#E2E8F0] mb-2">{item.title}</h4>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
