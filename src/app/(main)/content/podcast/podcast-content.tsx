"use client";

import WaitlistForm from "@/components/forms/WaitlistForm";
import { SectionLabel } from "@/components/ui";

export default function PodcastContent() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel color="#8241C8" centered>Coming Soon</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            The Toddfather Podcast
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            30 years of SPM expertise, distilled into audio. Each episode tackles a critical topic
            from the trenches—no vendor spin, just reality.
          </p>

          {/* Preview Card */}
          <div className="bg-white/5 rounded-xl p-8 md:p-12 border border-[#8241C8]/20 mb-8">
            <div className="text-[#8241C8] mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#E2E8F0] mb-3">What to Expect</h3>
            <p className="text-[#94A3B8] max-w-lg mx-auto mb-8">
              Deep dives into quota setting, clawback policies, territory design, and the governance
              gaps that sink SPM programs. Real stories from real implementations.
            </p>

            <div className="border-t border-[#8241C8]/20 pt-8 max-w-sm mx-auto">
              <p className="text-[#64748B] text-sm mb-4">Get notified when we launch</p>
              <WaitlistForm
                listName="podcast"
                accentColor="#8241C8"
                successMessage="We'll notify you when we launch."
              />
            </div>
          </div>

          {/* Episode Preview */}
          <div className="bg-white/5 rounded-xl p-6 border border-[#8241C8]/10 text-left">
            <h4 className="text-sm font-semibold text-[#8241C8] uppercase tracking-wider mb-4">
              First Episodes Preview
            </h4>
            <div className="space-y-4">
              {[
                { num: "01", title: "Why 70% of SPM Implementations Fail", duration: "~25 min" },
                { num: "02", title: "The Clawback Conversation Nobody Wants to Have", duration: "~20 min" },
                { num: "03", title: "Governance: The Layer Everyone Skips", duration: "~30 min" },
              ].map((ep) => (
                <div key={ep.num} className="flex items-center gap-4 py-2">
                  <span className="text-[#8241C8] font-mono text-sm">{ep.num}</span>
                  <span className="text-[#E2E8F0] flex-1">{ep.title}</span>
                  <span className="text-[#64748B] text-sm">{ep.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
