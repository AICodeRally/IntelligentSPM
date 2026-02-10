import Link from "next/link";
import { leverConfig, leverOrder } from "@/lib/levers";
import { PrimaryButton, SectionLabel } from "@/components/ui";

const levers = leverOrder.map((slug) => leverConfig[slug]);

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const credibility = [
  { label: "Years in SPM", value: "30" },
  { label: "Enterprise Transformations", value: "100+" },
  { label: "Comp Plans Designed", value: "1,000+" },
  { label: "Plan Rollovers Survived", value: "200+" },
];

const tools = [
  {
    name: "SPM Healthcheck",
    description: "Score your current state across the 8 levers and get a clear roadmap.",
    href: "/healthcheck/spm",
    color: "#38BDF8",
  },
  {
    name: "Comp Plan Healthcheck",
    description: "Upload your plan and get AI-backed analysis in minutes.",
    href: "/healthcheck/comp-plan",
    color: "#58108E",
  },
  {
    name: "Governance Healthcheck",
    description: "Find policy gaps before finance or legal finds them.",
    href: "/healthcheck/governance",
    color: "#A3E635",
  },
  {
    name: "AskSPM",
    description: "The Toddfather’s brain on demand. Precise, fast, no fluff.",
    href: "/healthcheck/askspm",
    color: "#FE9200",
  },
];

const leverBlobs = [
  { a: { top: 10, right: -10 }, b: { bottom: 10, left: -20 }, c: { top: 70, right: 40 }, delays: [0, -8, -14] },
  { a: { top: 20, left: -20 }, b: { bottom: 30, right: -10 }, c: { top: 80, left: 40 }, delays: [-4, -12, -18] },
  { a: { bottom: 20, right: -10 }, b: { top: 25, left: 30 }, c: { top: 70, left: -10 }, delays: [-6, -10, -2] },
  { a: { top: 30, right: 20 }, b: { bottom: 40, left: -15 }, c: { top: 15, left: 55 }, delays: [-9, -16, -5] },
  { a: { top: 15, left: 10 }, b: { top: 80, right: -20 }, c: { bottom: 20, left: 50 }, delays: [-11, -7, -1] },
  { a: { bottom: 30, left: -10 }, b: { top: 20, right: 10 }, c: { top: 80, left: 60 }, delays: [-13, -20, -4] },
  { a: { top: 35, left: -15 }, b: { bottom: 20, right: 10 }, c: { top: 15, right: 55 }, delays: [-17, -3, -9] },
  { a: { top: 20, right: -10 }, b: { top: 80, left: -20 }, c: { bottom: 25, right: 50 }, delays: [-21, -6, -12] },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1a0e2e]">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 10%, rgba(254,146,0,0.20) 0%, transparent 45%), radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.18) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div>
            <SectionLabel color="#38BDF8">Home of “The Toddfather”</SectionLabel>
            <h1 className="text-4xl md:text-6xl font-bold text-[#E2E8F0] leading-tight mb-5">
              The SPM authority who tells you what actually breaks.
            </h1>
            <p className="text-lg md:text-xl text-[#CBD5E1] max-w-2xl mb-8">
              30 years inside compensation plans, governance frameworks, and implementation fallout.
              No vendor agenda. No consultant theater. Just the truth about what works.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <PrimaryButton href="/toddfather/contact?topic=confab" variant="cyan" size="large">
                Book a Toddfather Confab
              </PrimaryButton>
              <Link href="#levers" className="text-[#E2E8F0] font-semibold hover:text-white transition-colors">
                Explore the 8 Levers →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 p-7">
            <p className="text-2xl md:text-3xl font-semibold text-[#E2E8F0] leading-snug">
              “Comp plans break because they’re designed in theory, implemented in chaos, and governed by exceptions.”
            </p>
            <p className="text-[#CBD5E1] italic mt-4">— The Toddfather</p>
          </div>
        </div>
      </section>

      {/* Fading Separator */}
      <div className="px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)" }} />
        </div>
      </div>

      {/* Credibility Strip */}
      <section className="px-6 py-12 bg-gradient-to-b from-[#1a0e2e] via-[#130a24] to-[#1a0e2e]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {credibility.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
              <div className="text-2xl font-bold text-[#E2E8F0]">{item.value}</div>
              <div className="text-sm text-[#CBD5E1] mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8 Levers */}
      <section id="levers" className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#1a0e2e] via-[#130a24] to-[#1a0e2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel color="#38BDF8" centered>
              The Operating System
            </SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-3">
              The 8 Levers of IntelligentSPM
            </h2>
            <p className="text-[#CBD5E1] max-w-2xl mx-auto">
              Pull a lever. See the consequences. Fix the root cause instead of chasing exceptions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {levers.map((lever, index) => {
              const blobs = leverBlobs[index % leverBlobs.length];
              return (
              <Link
                key={lever.id}
                href={`/levers/${lever.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition-all hover:border-white/30"
                style={{
                  borderColor: `${lever.color}40`,
                  boxShadow: `0 0 0 1px ${lever.color}18 inset, 0 20px 60px -40px ${lever.color}50`,
                  background: `linear-gradient(145deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 55%, ${hexToRgba(lever.color, 0.18)} 100%)`,
                }}
              >
                <div
                  className="lever-blob lever-blob-1"
                  style={{
                    ...blobs.a,
                    background: `linear-gradient(135deg, ${hexToRgba(lever.color, 0.28)} 0%, ${hexToRgba(lever.color, 0.08)} 100%)`,
                    animationDelay: `${blobs.delays[0]}s`,
                  }}
                />
                <div
                  className="lever-blob lever-blob-2"
                  style={{
                    ...blobs.b,
                    background: `linear-gradient(225deg, ${hexToRgba(lever.color, 0.22)} 0%, ${hexToRgba(lever.color, 0.06)} 100%)`,
                    animationDelay: `${blobs.delays[1]}s`,
                  }}
                />
                <div
                  className="lever-blob lever-blob-3"
                  style={{
                    ...blobs.c,
                    background: `linear-gradient(180deg, ${hexToRgba(lever.color, 0.18)} 0%, ${hexToRgba(lever.color, 0.05)} 100%)`,
                    animationDelay: `${blobs.delays[2]}s`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/60" />
                <div className="relative z-10">
                  <div className="h-1.5 w-full rounded-full mb-4" style={{ backgroundColor: lever.color }} />
                  <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: lever.color }}>
                    {lever.header}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{lever.name}</h3>
                  <p className="text-sm text-[#CBD5E1] mb-4">{lever.tagline}</p>
                  <p className="text-sm text-red-300 italic mb-6">{lever.consequence}</p>
                  <span className="text-sm font-semibold" style={{ color: lever.color }}>
                    Learn more →
                  </span>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* 5 Applied Layers — AI Bridge */}
      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#1a0e2e] via-[#150b26] to-[#1a0e2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <SectionLabel color="#FE9200" centered>
              Where AI Actually Fits
            </SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-3">
              The 5 Applied Layers
            </h2>
            <p className="text-[#CBD5E1] max-w-2xl mx-auto mb-10">
              The 8 Levers are the full picture. But when your vendor tells you they
              &ldquo;added AI,&rdquo; the question is: which levers does AI actually pull?
              That&apos;s what the five layers are.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                num: "01",
                name: "Plan Interpretation",
                desc: "AI reads the plan and surfaces ambiguities, contradictions, and gaps before reps find them.",
              },
              {
                num: "02",
                name: "Simulation",
                desc: "Model behavior under the plan before a single dollar pays out.",
              },
              {
                num: "03",
                name: "Telemetry",
                desc: "Continuous monitoring of payout patterns, gaming signals, and drift.",
              },
              {
                num: "04",
                name: "Exceptions",
                desc: "Classify, track, and root-cause every exception instead of rubber-stamping.",
              },
              {
                num: "05",
                name: "Governance",
                desc: "Enforce policy guardrails automatically, not through email chains.",
              },
            ].map((layer) => (
              <div
                key={layer.num}
                className="rounded-2xl border border-[#FE9200]/20 p-5 transition-all hover:border-[#FE9200]/40"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 55%, rgba(254,146,0,0.08) 100%)",
                }}
              >
                <div className="text-xs font-bold font-mono text-[#FE9200] mb-2">
                  {layer.num}
                </div>
                <h3 className="text-base font-bold text-[#E2E8F0] mb-2">
                  {layer.name}
                </h3>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {layer.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/newsletter/001"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#FE9200] hover:text-[#FE9200]/80 transition-colors"
            >
              Read the deep dive in Issue #001 →
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#1a0e2e] via-[#150b26] to-[#1a0e2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel color="#38BDF8" centered>The Toolset</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-3">
              IntelligentSPM Tools That Actually Work
            </h2>
            <p className="text-[#CBD5E1] max-w-2xl mx-auto">
              Practical, opinionated tools built from a career of fixing broken compensation programs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link key={tool.name} href={tool.href} className="group">
                <div
                  className="h-full rounded-2xl border border-white/10 p-7 transition-all hover:border-white/30"
                  style={{
                    borderColor: `${tool.color}40`,
                    background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%), radial-gradient(600px 200px at 0% 0%, ${tool.color}22, transparent 60%)`,
                  }}
                >
                  <div className="h-1.5 w-14 rounded-full mb-5" style={{ backgroundColor: tool.color }} />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#E2E8F0]">{tool.name}</h3>
                    <span className="text-sm font-semibold" style={{ color: tool.color }}>
                      Coming Soon →
                    </span>
                  </div>
                  <p className="text-[#CBD5E1] mb-5">{tool.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm text-[#CBD5E1]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tool.color }} />
                    Built by The Toddfather
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#1a0e2e] via-[#150b27] to-[#1a0e2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#E2E8F0] mb-4">
            Want straight answers on your comp plan?
          </h2>
          <p className="text-[#CBD5E1] mb-8">
            Join the Syndicate for weekly insights, frameworks, and real-world lessons.
          </p>
          <PrimaryButton href="/syndicate" size="large" variant="cyan">
            Join The Syndicate
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
