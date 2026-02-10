import Link from "next/link";
import { PrimaryButton, SectionLabel } from "@/components/ui";
import newsletterData from "@/data/newsletters.json";

export const metadata = {
  title: "Newsletter Archive | IntelligentSPM",
  description: "The SPM Syndicate newsletter — weekly insights on sales performance management from The Toddfather.",
};

const issues = newsletterData.issues;

export default function NewsletterArchivePage() {
  return (
    <div className="min-h-screen bg-[#1a0e2e]">
      {/* Header */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1a0e2e] via-[#130a24] to-[#1a0e2e]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel color="#FE9200" centered>The SPM Syndicate</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            Newsletter Archive
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-8">
            Weekly dispatch from The Toddfather. One idea, one proof point, one example, one tool. No fluff.
          </p>
          <PrimaryButton href="/syndicate" variant="cyan">
            Subscribe to The Syndicate
          </PrimaryButton>
        </div>
      </section>

      {/* Issues Grid */}
      <section className="py-12 px-6 border-t border-white/10 bg-gradient-to-b from-[#1a0e2e] via-[#150b26] to-[#1a0e2e]">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {issues.map((issue) => (
              <Link key={issue.slug} href={`/newsletter/${issue.slug}`}>
                <div className="rounded-2xl border border-[#FE9200]/30 p-8 transition-all hover:border-[#FE9200]/60 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%), radial-gradient(600px 200px at 0% 0%, rgba(254,146,0,0.12), transparent 60%)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#FE9200]/20 text-[#FE9200]">
                      Issue #{String(issue.number).padStart(3, "0")}
                    </span>
                    <span className="text-sm text-[#64748B]">
                      {new Date(issue.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#E2E8F0] mb-3">
                    {issue.title}
                  </h2>
                  <p className="text-[#94A3B8] mb-4">{issue.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {issue.topics.map((topic) => (
                      <span key={topic} className="px-2 py-1 text-xs rounded bg-white/5 text-[#94A3B8]">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 px-6 border-t border-white/10 bg-gradient-to-b from-[#1a0e2e] via-[#150b27] to-[#1a0e2e]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#E2E8F0] mb-4">
            Get it every Tuesday.
          </h2>
          <p className="text-[#94A3B8] mb-8">
            Join The Syndicate for weekly insights you can forward to your CRO without apologizing.
          </p>
          <PrimaryButton href="/syndicate" variant="cyan" size="large">
            Join The Syndicate
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
