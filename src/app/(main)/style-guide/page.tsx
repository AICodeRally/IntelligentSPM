import { PrimaryButton, SectionLabel } from "@/components/ui";
import { leverConfig, leverOrder } from "@/lib/levers";

export const metadata = {
  title: "Style Guide | IntelligentSPM",
  description: "Brand and UI style guide for IntelligentSPM.",
};

const palette = [
  { name: "Background Dark", color: "#0F172A" },
  { name: "Background Light", color: "#1E293B" },
  { name: "Teal", color: "#38BDF8" },
  { name: "Orange", color: "#FF8737" },
  { name: "AI Purple", color: "#8241C8" },
  { name: "AI Purple Dark", color: "#58108E" },
  { name: "Lime", color: "#A3E635" },
  { name: "Hot Pink", color: "#EA1B85" },
  { name: "Text Primary", color: "#E2E8F0" },
  { name: "Text Muted", color: "#94A3B8" },
];

const levers = leverOrder.map((slug) => leverConfig[slug]);

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6 bg-gradient-to-b from-[#0F172A] via-[#0B1220] to-[#0F172A]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel color="#38BDF8">Style Guide</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-4">
            IntelligentSPM Brand System
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl">
            A single source of truth for typography, colors, and UI patterns. Keep it bold, confident, and clean.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#0F172A] via-[#0E1627] to-[#0F172A]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel color="#FF8737">Typography</SectionLabel>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E2E8F0]">Display Headline</h2>
            <p className="text-lg text-[#94A3B8]">
              Body text should be readable, crisp, and calm. Headlines should be direct and confident.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-[#E2E8F0]">Font: Inter (body)</span>
              <span className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-[#E2E8F0]">Font: Outfit (logo)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#0F172A] via-[#0B1322] to-[#0F172A]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel color="#38BDF8">Core Palette</SectionLabel>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {palette.map((item) => (
              <div key={item.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="h-16 w-full rounded-lg" style={{ backgroundColor: item.color }} />
                <div className="mt-3 text-sm text-[#E2E8F0] font-semibold">{item.name}</div>
                <div className="text-xs text-[#94A3B8]">{item.color}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#0F172A] via-[#0E1627] to-[#0F172A]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel color="#A3E635">The 8 Levers Palette</SectionLabel>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {levers.map((lever) => (
              <div key={lever.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="h-14 w-full rounded-lg" style={{ backgroundColor: lever.color }} />
                <div className="mt-3 text-sm text-[#E2E8F0] font-semibold">{lever.name}</div>
                <div className="text-xs text-[#94A3B8]">{lever.color}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#0F172A] via-[#0E1728] to-[#0F172A]">
        <div className="max-w-5xl mx-auto">
          <SectionLabel color="#38BDF8">Buttons</SectionLabel>
          <div className="flex flex-wrap gap-4">
            <PrimaryButton href="#" variant="cyan">Primary Cyan</PrimaryButton>
            <PrimaryButton href="#" variant="orange">Primary Orange</PrimaryButton>
            <PrimaryButton href="#" variant="purple">Primary Purple</PrimaryButton>
            <PrimaryButton href="#" variant="green">Primary Lime</PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
