"use client";

import WaitlistForm from "@/components/forms/WaitlistForm";

export default function VideosContent() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#A3E635] mb-4">
            Coming Soon
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            The Toddfather Videos
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            SPM expertise, visualized. Short-form content that cuts through the noise.
            Built for TikTok, YouTube Shorts, and LinkedIn.
          </p>

          {/* Preview Card */}
          <div className="bg-[#1E293B] rounded-xl p-8 md:p-12 border border-[#A3E635]/20 mb-8">
            <div className="text-[#A3E635] mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#E2E8F0] mb-3">What to Expect</h3>
            <p className="text-[#94A3B8] max-w-lg mx-auto mb-8">
              The Toddfather avatar brings SPM topics to life. Quick hits on compensation pitfalls,
              vendor realities, and governance gaps—designed for the scroll.
            </p>

            <div className="border-t border-[#A3E635]/20 pt-8 max-w-sm mx-auto">
              <p className="text-[#64748B] text-sm mb-4">Get notified when we launch</p>
              <WaitlistForm
                listName="videos"
                accentColor="#A3E635"
                successMessage="We'll notify you when we launch."
              />
            </div>
          </div>

          {/* Platform Preview */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-[#A3E635]/10">
            <h4 className="text-sm font-semibold text-[#A3E635] uppercase tracking-wider mb-4">
              Coming To
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "TikTok", desc: "60-second truths" },
                { name: "YouTube Shorts", desc: "Deep cuts" },
                { name: "LinkedIn", desc: "Professional takes" },
                { name: "Instagram", desc: "Stories & Reels" },
              ].map((platform) => (
                <div
                  key={platform.name}
                  className="px-4 py-3 rounded-xl bg-[#0F172A] border border-[#A3E635]/10"
                >
                  <span className="text-[#E2E8F0] font-semibold">{platform.name}</span>
                  <p className="text-[#64748B] text-xs mt-1">{platform.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
