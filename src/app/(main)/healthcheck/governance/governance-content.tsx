"use client";

import WaitlistForm from "@/components/forms/WaitlistForm";

const policies = ["Clawback", "Quota", "Windfall", "SPIF", "409A", "Crediting", "Draws", "Termination"];

export default function GovernanceContent() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#A3E635] flex items-center justify-center text-2xl font-bold text-[#0F172A] mx-auto mb-8">
            GOV
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            Governance Healthcheck
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            Upload your governance or policy document. Get gap analysis against our
            17 SCP (Sales Compensation Policy) standards.
          </p>

          {/* Waitlist Card */}
          <div className="bg-[#1E293B] rounded-xl p-8 md:p-10 border border-[#A3E635]/20 max-w-md mx-auto mb-12">
            <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">Coming Soon</h3>
            <p className="text-[#94A3B8] text-sm mb-6">
              Be the first to check your governance against the 17 SCP policies.
            </p>
            <WaitlistForm
              listName="healthcheck-governance"
              accentColor="#A3E635"
              successMessage="We'll notify you when Governance Checker launches."
            />
          </div>

          {/* SCP Policies */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-[#A3E635]/10 mb-8">
            <p className="text-[#64748B] text-sm mb-4">Analyzed against 17 SCP policies including:</p>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {policies.map((policy) => (
                <span
                  key={policy}
                  className="px-3 py-1 text-xs rounded-full bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20"
                >
                  {policy}
                </span>
              ))}
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-[#1E293B] text-[#64748B] border border-[#64748B]/20">
              +9 more policies
            </span>
          </div>

          {/* What You'll Get */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: "Coverage Report", desc: "Which of the 17 policies are addressed vs. missing" },
              { title: "Gap Analysis", desc: "Specific gaps in your governance documentation" },
              { title: "Priority Actions", desc: "What to fix first based on risk and impact" },
            ].map((item) => (
              <div key={item.title} className="bg-[#1E293B] rounded-xl p-5 border border-[#A3E635]/10">
                <h4 className="font-bold text-[#E2E8F0] mb-2">{item.title}</h4>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-[#64748B] text-sm mt-8">
            Supports PDF and Word documents. Analyzed securely and not stored.
          </p>
        </div>
      </section>
    </div>
  );
}
