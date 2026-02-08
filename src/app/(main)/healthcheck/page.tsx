import Link from "next/link";
import { PrimaryButton, SectionLabel } from "@/components/ui";

export const metadata = {
  title: "Healthchecks | IntelligentSPM",
  description: "AI-powered tools to analyze your SPM program, comp plans, and governance.",
};

const tools = [
  {
    name: "SPM Healthcheck",
    description: "Quiz your current state against the 8 levers of SPM. Get scores and recommendations.",
    href: "/healthcheck/spm",
    color: "#38BDF8",
    abbr: "SPM",
  },
  {
    name: "Comp Plan Healthcheck",
    description: "Upload your comp plan. AI analyzes, scores, and returns suggestions in card format.",
    href: "/healthcheck/comp-plan",
    color: "#8241C8",
    abbr: "AI",
    isAI: true,
  },
  {
    name: "Governance Healthcheck",
    description: "Upload your governance policy. Get gap analysis against 17 SCP policies.",
    href: "/healthcheck/governance",
    color: "#A3E635",
    abbr: "GOV",
  },
  {
    name: "AskSPM",
    description: "Query The Toddfather's brain. RAG-powered answers from 929 knowledge base cards.",
    href: "/healthcheck/askspm",
    color: "#FF8737",
    abbr: "ASK",
  },
];

export default function HealthcheckPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel color="#38BDF8" centered>Tools That Actually Work</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            SPM Healthchecks
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            Stop guessing. Upload your docs, answer some questions, and get real answers about what&apos;s working and what&apos;s broken.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <div
                className="bg-white/5 rounded-xl p-8 border transition-all hover:scale-105 cursor-pointer h-full"
                style={{ borderColor: `${tool.color}30` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                    style={{ backgroundColor: tool.color }}
                  >
                    {tool.abbr}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-[#E2E8F0]">
                        {tool.name}
                      </h2>
                      {tool.isAI && (
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-[#8241C8]/20 text-[#8241C8]">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-[#94A3B8]">{tool.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#64748B] mb-4">
            Not sure where to start?
          </p>
          <PrimaryButton href="/healthcheck/spm" variant="cyan" size="large">
            Start with SPM Healthcheck
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
