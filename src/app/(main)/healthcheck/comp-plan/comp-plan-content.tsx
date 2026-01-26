"use client";

import WaitlistForm from "@/components/forms/WaitlistForm";

export default function CompPlanContent() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#8241C8] flex items-center justify-center text-2xl font-bold text-white mx-auto mb-8">
            AI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            Comp Plan Healthcheck
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            Upload your comp plan document. AI analyzes structure, identifies risks,
            and returns actionable suggestions.
          </p>

          {/* Waitlist Card */}
          <div className="bg-[#1E293B] rounded-xl p-8 md:p-10 border border-[#8241C8]/20 max-w-md mx-auto mb-12">
            <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">Coming Soon</h3>
            <p className="text-[#94A3B8] text-sm mb-6">
              Be the first to get AI-powered analysis of your compensation plans.
            </p>
            <WaitlistForm
              listName="healthcheck-comp-plan"
              accentColor="#8241C8"
              successMessage="We'll notify you when Plan Analyzer launches."
            />
          </div>

          {/* How It Works */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-[#8241C8]/10 mb-8">
            <h4 className="text-sm font-semibold text-[#8241C8] uppercase tracking-wider mb-4">
              How It Works
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#8241C8]/20 flex items-center justify-center text-[#8241C8] font-bold">1</span>
                <span className="text-[#94A3B8]">Upload plan</span>
              </div>
              <span className="text-[#64748B] hidden md:block">→</span>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#8241C8]/20 flex items-center justify-center text-[#8241C8] font-bold">2</span>
                <span className="text-[#94A3B8]">AI analyzes</span>
              </div>
              <span className="text-[#64748B] hidden md:block">→</span>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#8241C8]/20 flex items-center justify-center text-[#8241C8] font-bold">3</span>
                <span className="text-[#94A3B8]">Get insights</span>
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: "Structure Analysis", desc: "Is your plan clear, complete, and legally sound?" },
              { title: "Risk Identification", desc: "Potential issues with accelerators, caps, and clawbacks" },
              { title: "Improvement Suggestions", desc: "Specific recommendations ranked by priority" },
            ].map((item) => (
              <div key={item.title} className="bg-[#1E293B] rounded-xl p-5 border border-[#8241C8]/10">
                <h4 className="font-bold text-[#E2E8F0] mb-2">{item.title}</h4>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-[#64748B] text-sm mt-8">
            Supports PDF, Word, and Excel. Documents analyzed securely and not stored.
          </p>
        </div>
      </section>
    </div>
  );
}
