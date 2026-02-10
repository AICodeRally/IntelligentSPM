import Link from "next/link";
import { PrimaryButton } from "@/components/ui";

const quips: Record<string, string> = {
  spm: "We're still calibrating the truth meter. Unlike your quota targets, this will actually be accurate when it ships.",
  "comp-plan": "The AI is still learning how many ways a comp plan can break. It's a long list.",
  governance: "We're still cataloging all the policies you probably don't have. Check back soon.",
  askspm: "The Toddfather is loading 30 years of SPM into the machine. That doesn't compress overnight.",
};

export function ComingSoon({ tool }: { tool: string }) {
  const quip = quips[tool] || "This tool isn't live yet. But unlike your comp plan, it'll work when it launches.";

  return (
    <div className="min-h-screen bg-[#1a0e2e] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="text-6xl mb-6">🚧</div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-4">
          Coming Soon.
        </h1>
        <p className="text-lg text-[#CBD5E1] mb-8 leading-relaxed">
          {quip}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <PrimaryButton href="/syndicate" variant="cyan">
            Join The Syndicate
          </PrimaryButton>
          <Link
            href="/"
            className="text-sm font-semibold text-[#CBD5E1] hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
