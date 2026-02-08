import Link from "next/link";
import { SectionLabel } from "@/components/ui";

export const metadata = {
  title: "Vendor Intelligence | IntelligentSPM",
  description: "The Magic Wave, The Sit-Down, and vendor scorecards. Honest SPM vendor analysis.",
};

const sections = [
  {
    name: "The Magic Wave",
    description: "Annual SPM vendor landscape analysis. Quadrant positioning, honest strengths/weaknesses, and where they break.",
    href: "/vendors/magic-wave",
    color: "#8241C8",
    tag: "Annual Report",
  },
  {
    name: "The Sit-Down",
    description: "When you need to sit down before picking a vendor. Comprehensive comparison and decision framework.",
    href: "/vendors/sit-down",
    color: "#FF8737",
    tag: "Vendor Guide",
  },
  {
    name: "Vendor Scorecards",
    description: "Individual vendor deep-dives. Ratings, gotchas, best/worst use cases. Updated as they ship and break.",
    href: "/vendors/scorecards",
    color: "#38BDF8",
    tag: "4 Vendors",
  },
];

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel color="#8241C8" centered>No Vendor Agenda</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            Vendor Intelligence
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            Honest SPM vendor analysis. Not sponsored reviews. Not the demo version. What actually happens in implementation.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section) => (
            <Link key={section.name} href={section.href}>
              <div
                className="bg-white/5 rounded-xl p-8 border transition-all hover:scale-[1.02] cursor-pointer"
                style={{ borderColor: `${section.color}30` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#E2E8F0]">
                    {section.name}
                  </h2>
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{ backgroundColor: `${section.color}20`, color: section.color }}
                  >
                    {section.tag}
                  </span>
                </div>
                <p className="text-[#94A3B8]">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/5 rounded-xl p-8 border border-[#64748B]/20">
            <p className="text-[#64748B] text-sm">
              <span className="text-[#E2E8F0] font-semibold">The Toddfather Promise:</span>
              {" "}These analyses are based on real implementation experience, not vendor partnerships.
              We don&apos;t take money from vendors. We tell you what breaks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
