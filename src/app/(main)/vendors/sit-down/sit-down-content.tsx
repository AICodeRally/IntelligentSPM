"use client";

import WaitlistForm from "@/components/forms/WaitlistForm";

const sections = [
  {
    title: "Vendor Comparison Matrix",
    desc: "Side-by-side feature comparison with reality scores. Not what they claim—what they actually deliver.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    title: "Implementation Checklist",
    desc: "What to verify before signing. The technical and operational questions that reveal readiness.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Questions They Hate",
    desc: "The questions vendors hope you won't ask. Scripted deflections won't work against these.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Red Flags Guide",
    desc: "Warning signs from real implementations. What looks normal but spells trouble later.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
  },
];

export default function SitDownContent() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF8737] mb-4">
            Coming Soon
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            The Sit-Down
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            When you need to sit down before picking a vendor.
            The honest conversation you should have before signing anything.
          </p>

          {/* Main teaser card */}
          <div className="bg-[#1E293B] rounded-xl p-8 md:p-12 border border-[#FF8737]/20 mb-8">
            <div className="text-[#FF8737] mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#E2E8F0] mb-3">Before You Sign</h3>
            <p className="text-[#94A3B8] max-w-lg mx-auto mb-8">
              A comprehensive vendor comparison guide. Decision frameworks, implementation checklists,
              and the questions you should ask that vendors hope you won&apos;t.
            </p>

            <div className="border-t border-[#FF8737]/20 pt-8 max-w-sm mx-auto">
              <p className="text-[#64748B] text-sm mb-4">Get notified when we publish</p>
              <WaitlistForm
                listName="sit-down"
                accentColor="#FF8737"
                successMessage="We'll notify you when The Sit-Down is ready."
              />
            </div>
          </div>

          {/* What it covers */}
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {sections.map((item) => (
              <div key={item.title} className="bg-[#1E293B] rounded-xl p-6 border border-[#FF8737]/10">
                <div className="text-[#FF8737] mb-3">
                  {item.icon}
                </div>
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
