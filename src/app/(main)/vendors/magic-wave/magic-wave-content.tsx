"use client";

import WaitlistForm from "@/components/forms/WaitlistForm";

export default function MagicWaveContent() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8241C8] mb-4">
            Coming Q1 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            The Magic Wave
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            Taking the best of Gartner and Forrester, minus the vendor influence.
            Real positioning based on real implementations.
          </p>

          {/* Preview Visual */}
          <div className="bg-[#1E293B] rounded-xl p-8 md:p-12 border border-[#8241C8]/20 mb-8">
            {/* Quadrant Preview */}
            <div className="aspect-square max-w-md mx-auto relative mb-8">
              <div className="absolute inset-0 border-2 border-[#8241C8]/30 rounded-xl">
                {/* Axes */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#8241C8]/20"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#8241C8]/20"></div>

                {/* Labels */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-[#64748B]">Capability</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-[#64748B]">Limited</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#64748B]" style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)" }}>Execution</span>

                {/* Placeholder dots */}
                <div className="absolute top-[25%] left-[70%] w-3 h-3 rounded-full bg-[#8241C8]/40"></div>
                <div className="absolute top-[35%] left-[55%] w-3 h-3 rounded-full bg-[#8241C8]/40"></div>
                <div className="absolute top-[40%] left-[75%] w-3 h-3 rounded-full bg-[#8241C8]/40"></div>
                <div className="absolute top-[55%] left-[35%] w-3 h-3 rounded-full bg-[#8241C8]/40"></div>
                <div className="absolute top-[60%] left-[45%] w-3 h-3 rounded-full bg-[#8241C8]/40"></div>

                {/* Center badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#0F172A] px-4 py-2 rounded-lg border border-[#8241C8]/30">
                    <p className="text-[#8241C8] font-bold text-lg">2026</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#8241C8]/20 pt-8 max-w-sm mx-auto">
              <p className="text-[#64748B] text-sm mb-4">Get notified when we publish</p>
              <WaitlistForm
                listName="magic-wave"
                accentColor="#8241C8"
                successMessage="We'll notify you when the 2026 Magic Wave drops."
              />
            </div>
          </div>

          {/* What's included */}
          <div className="bg-[#1E293B] rounded-xl p-8 border border-[#8241C8]/10 text-left max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-[#E2E8F0] mb-4">What&apos;s in The Magic Wave?</h3>
            <ul className="space-y-3 text-[#94A3B8]">
              <li className="flex items-start gap-3">
                <span className="text-[#8241C8]">→</span>
                Quadrant positioning based on capability vs. execution
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8241C8]">→</span>
                &quot;Where They Break&quot; section for each vendor
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8241C8]">→</span>
                Implementation reality vs. sales demo
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8241C8]">→</span>
                Best fit by company size and complexity
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8241C8]">→</span>
                Available as interactive web + downloadable PDF
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
