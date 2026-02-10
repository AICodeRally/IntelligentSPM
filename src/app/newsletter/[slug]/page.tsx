import { notFound } from "next/navigation";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui";
import newsletterData from "@/data/newsletters.json";
import fs from "fs";
import path from "path";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return newsletterData.issues.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const issue = newsletterData.issues.find((i) => i.slug === slug);
  if (!issue) return { title: "Not Found" };
  return {
    title: `Issue #${String(issue.number).padStart(3, "0")}: ${issue.title} | SPM Syndicate`,
    description: issue.excerpt,
  };
}

/**
 * Loads the newsletter HTML template from disk.
 * SAFETY: These are our own trusted templates checked into the repo,
 * not user-generated content. No XSS risk.
 */
function loadTemplate(templateFile: string, slug: string): { body: string; styles: string } {
  const templatePath = path.join(process.cwd(), "src/lib/email-templates", templateFile);
  try {
    const raw = fs.readFileSync(templatePath, "utf-8");

    const styleMatch = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);

    let body = bodyMatch ? bodyMatch[1] : "";
    body = body
      .replace(/max-width:\s*700px/g, "max-width: 800px")
      .replace(/\{\{VIEW_IN_BROWSER_URL\}\}/g, `/newsletter/${slug}`)
      .replace(/\{\{UNSUBSCRIBE_URL\}\}/g, "mailto:todd@intelligentspm.com?subject=Unsubscribe");

    return { body, styles: styleMatch ? styleMatch[1] : "" };
  } catch {
    return { body: "<p>Newsletter content could not be loaded.</p>", styles: "" };
  }
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = newsletterData.issues.find((i) => i.slug === slug);
  if (!issue) notFound();

  const issueIndex = newsletterData.issues.findIndex((i) => i.slug === slug);
  const prevIssue = issueIndex < newsletterData.issues.length - 1 ? newsletterData.issues[issueIndex + 1] : null;
  const nextIssue = issueIndex > 0 ? newsletterData.issues[issueIndex - 1] : null;

  const { body, styles } = loadTemplate(issue.templateFile, slug);

  return (
    <div className="min-h-screen bg-[#1a0e2e]">
      {/* Issue Header */}
      <section className="py-12 px-6 bg-gradient-to-b from-[#1a0e2e] via-[#130a24] to-[#1a0e2e] border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <Link href="/newsletter" className="text-[#94A3B8] hover:text-white transition-colors text-sm mb-6 inline-block">
            ← Back to Archive
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#FE9200]/20 text-[#FE9200]">
              Issue #{String(issue.number).padStart(3, "0")}
            </span>
            <span className="text-sm text-[#64748B]">
              {new Date(issue.publishedAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#E2E8F0]">
            {issue.title}
          </h1>
        </div>
      </section>

      {/* Newsletter Content — trusted template from repo, not user input */}
      <section className="py-8 px-6">
        <div className="newsletter-embed max-w-[800px] mx-auto rounded-2xl overflow-hidden border border-white/10">
          <style dangerouslySetInnerHTML={{ __html: styles }} />
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      </section>

      {/* Navigation + Subscribe */}
      <section className="py-12 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            {prevIssue ? (
              <Link href={`/newsletter/${prevIssue.slug}`} className="text-[#94A3B8] hover:text-white transition-colors">
                ← Issue #{String(prevIssue.number).padStart(3, "0")}
              </Link>
            ) : <div />}
            {nextIssue ? (
              <Link href={`/newsletter/${nextIssue.slug}`} className="text-[#94A3B8] hover:text-white transition-colors">
                Issue #{String(nextIssue.number).padStart(3, "0")} →
              </Link>
            ) : <div />}
          </div>

          <div className="text-center">
            <p className="text-[#94A3B8] mb-4">Get this in your inbox every Tuesday.</p>
            <PrimaryButton href="/syndicate" variant="cyan">
              Join The Syndicate
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
