import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Scorecards | IntelligentSPM",
  description: "Individual SPM vendor deep-dives. Ratings, gotchas, best and worst use cases.",
};

const vendors = [
  {
    name: "Xactly",
    rating: "B+",
    strength: "Enterprise scale, mature platform",
    weakness: "Complex implementations, steep learning curve",
    bestFor: "Large enterprises with dedicated admin teams",
    color: "#38BDF8",
  },
  {
    name: "CaptivateIQ",
    rating: "A-",
    strength: "Modern UX, fast setup",
    weakness: "Limited enterprise features at scale",
    bestFor: "Mid-market, fast-growing companies",
    color: "#A3E635",
  },
  {
    name: "Varicent",
    rating: "B",
    strength: "Territory planning, analytics",
    weakness: "Aging architecture, slow innovation",
    bestFor: "Companies prioritizing territory optimization",
    color: "#FF8737",
  },
  {
    name: "Spiff",
    rating: "B+",
    strength: "SMB friendly, intuitive UI",
    weakness: "Scale limitations, basic governance",
    bestFor: "Growing sales teams, SMB to lower mid-market",
    color: "#8241C8",
  },
];

export default function ScorecardsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#38BDF8] mb-4 text-center">
            Honest Vendor Reviews
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6 text-center">
            Vendor Scorecards
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12 text-center">
            Individual vendor deep-dives based on real implementation experience.
            What works, what breaks, and who it&apos;s actually for.
          </p>

          {/* Vendor Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.name}
                className="bg-white/5 rounded-xl p-6 border"
                style={{ borderColor: `${vendor.color}30` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#E2E8F0]">{vendor.name}</h3>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: vendor.color }}
                  >
                    {vendor.rating}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#A3E635] font-semibold">Strength: </span>
                    <span className="text-[#94A3B8]">{vendor.strength}</span>
                  </div>
                  <div>
                    <span className="text-[#EA1B85] font-semibold">Weakness: </span>
                    <span className="text-[#94A3B8]">{vendor.weakness}</span>
                  </div>
                  <div className="pt-2 border-t border-[#0F172A]">
                    <span className="text-[#64748B] font-semibold">Best for: </span>
                    <span className="text-[#94A3B8]">{vendor.bestFor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-12 bg-white/5 rounded-xl p-6 border border-[#38BDF8]/10">
            <h4 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">
              Rating Scale
            </h4>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-[#A3E635] font-bold">A</span>
                <span className="text-[#64748B]"> = Excellent</span>
              </div>
              <div>
                <span className="text-[#38BDF8] font-bold">B</span>
                <span className="text-[#64748B]"> = Good</span>
              </div>
              <div>
                <span className="text-[#FF8737] font-bold">C</span>
                <span className="text-[#64748B]"> = Acceptable</span>
              </div>
              <div>
                <span className="text-[#EA1B85] font-bold">D/F</span>
                <span className="text-[#64748B]"> = Problematic</span>
              </div>
            </div>
            <p className="text-[#64748B] text-sm mt-4">
              Ratings based on real implementations, not vendor demos or marketing materials.
            </p>
          </div>

          <p className="text-center text-[#64748B] mt-8">
            More detailed scorecards coming soon—including full &quot;Where They Break&quot; analysis.
          </p>
        </div>
      </section>
    </div>
  );
}
