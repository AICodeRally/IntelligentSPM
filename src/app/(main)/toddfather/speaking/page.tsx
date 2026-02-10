import { PrimaryButton, SectionLabel } from "@/components/ui";

export const metadata = {
  title: "Speaking | The Toddfather",
  description: "Keynotes, workshops, and executive sessions on SPM governance, comp strategy, and implementation reality.",
};

const topics = [
  {
    title: "SPM Governance: The Operating Model That Prevents Chaos",
    description: "How to build change management, approval workflows, and controls that scale. For RevOps leaders, Finance teams, and SPM admins.",
    duration: "60-90 min",
    format: "Workshop or Keynote",
  },
  {
    title: "Vendor Reality: Who's Good at What, Who Breaks Where",
    description: "Real implementation truth about SPM vendors. Not the demo, not the sales pitch—what actually happens.",
    duration: "45-60 min",
    format: "Keynote",
  },
  {
    title: "Comp Design Patterns: What Works, What Breaks, and Why",
    description: "Deep dive into quota models, accelerator structures, territory design, and the patterns that survive contact with reality.",
    duration: "90 min",
    format: "Workshop",
  },
  {
    title: "Executive Briefing: SPM as Strategic Lever",
    description: "How comp design shapes sales behavior, revenue outcomes, and operational complexity. For CROs, CFOs, and executive teams.",
    duration: "30-45 min",
    format: "Executive Session",
  },
];

export default function SpeakingPage() {
  return (
    <div className="min-h-screen bg-[#1a0e2e]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionLabel color="#FE9200" centered>The Toddfather</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6 text-center">
            Speaking
          </h1>
          <p className="text-lg text-[#CBD5E1] max-w-2xl mx-auto mb-12 text-center">
            Keynotes, workshops, and executive sessions. No slides. No buzzwords. Just truth.
          </p>

          {/* Topics */}
          <div className="space-y-6 mb-12">
            {topics.map((topic) => (
              <div key={topic.title} className="bg-white/5 rounded-xl p-6 border-l-4 border-[#FE9200]">
                <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">{topic.title}</h3>
                <p className="text-[#CBD5E1] mb-3">{topic.description}</p>
                <p className="text-sm text-[#64748B]">{topic.duration} • {topic.format}</p>
              </div>
            ))}
          </div>

          {/* Format & Audience */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/5 rounded-xl p-6 border border-[#FE9200]/10">
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-4">Format</h3>
              <ul className="space-y-2 text-[#CBD5E1]">
                <li>• No PowerPoint slides (conversation + whiteboard)</li>
                <li>• No vendor marketing speak</li>
                <li>• No consultant frameworks</li>
                <li>• Real examples, real patterns, real truth</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-[#FE9200]/10">
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-4">Audience</h3>
              <ul className="space-y-2 text-[#CBD5E1]">
                <li>• Sales Performance Management teams</li>
                <li>• RevOps and Sales Operations leaders</li>
                <li>• CFO/CRO executive teams</li>
                <li>• Compensation and Finance teams</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white/5 rounded-xl p-8 border border-[#FE9200]/20 text-center">
            <h3 className="text-xl font-bold text-[#E2E8F0] mb-4">Book The Toddfather</h3>
            <p className="text-[#CBD5E1] mb-6">
              Conference keynote, internal workshop, or executive briefing. Let&apos;s talk.
            </p>
            <PrimaryButton href="/toddfather/contact" size="large">
              Start the Conversation
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
