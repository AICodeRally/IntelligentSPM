import Link from "next/link";
import { PrimaryButton, SectionLabel } from "@/components/ui";

export const metadata = {
  title: "Learn | IntelligentSPM",
  description: "SPM 101, 8 levers framework, 17 policies, and glossary. Everything you need to master SPM.",
};

const sections = [
  {
    name: "SPM 101",
    description: "New to SPM? Start here. The fundamentals of sales performance management without the vendor spin.",
    href: "/learn/spm-101",
    color: "#38BDF8",
    count: "Foundation",
  },
  {
    name: "The 8 Levers",
    description: "Deep dive into the SPM framework. 929 knowledge base cards organized by lever.",
    href: "/levers",
    color: "#F59E0B",
    count: "929 cards",
  },
  {
    name: "17 SCP Policies",
    description: "Sales Compensation Policies covering clawback, quota, windfall, 409A, and more.",
    href: "/learn/policies",
    color: "#A3E635",
    count: "17 policies",
  },
  {
    name: "Glossary",
    description: "SPM terms defined. No jargon, no confusion. Plain language definitions.",
    href: "/learn/glossary",
    color: "#FF8737",
    count: "50+ terms",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0F172A] via-[#0B1220] to-[#0F172A]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel color="#38BDF8" centered>The SPM Clearing House</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            Learn SPM
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            30 years of sales compensation expertise, organized and accessible. No vendor agenda, no consultant spin.
          </p>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-12 px-6 border-t border-white/10 bg-gradient-to-b from-[#0F172A] via-[#0E1627] to-[#0F172A]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <Link key={section.name} href={section.href}>
              <div
                className="rounded-2xl p-8 border transition-all hover:border-white/30 cursor-pointer h-full"
                style={{
                  borderColor: `${section.color}40`,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%), radial-gradient(600px 200px at 0% 0%, ${section.color}22, transparent 60%)`,
                }}
              >
                <div className="h-1.5 w-14 rounded-full mb-5" style={{ backgroundColor: section.color }} />
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#E2E8F0]">
                    {section.name}
                  </h2>
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{ backgroundColor: `${section.color}20`, color: section.color }}
                  >
                    {section.count}
                  </span>
                </div>
                <p className="text-[#94A3B8]">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-6 border-t border-white/10 bg-gradient-to-b from-[#0F172A] via-[#0E1728] to-[#0F172A]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#64748B] mb-4">
            New to SPM?
          </p>
          <PrimaryButton href="/learn/spm-101" variant="cyan" size="large">
            Start with SPM 101
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
