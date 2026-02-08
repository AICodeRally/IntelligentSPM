"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import kbData from "@/data/spm-kb-cards.json";

// Pillar config
const pillarConfig: Record<string, { name: string; color: string; abbr: string }> = {
  SALES_PLANNING: { name: "Sales Planning", color: "#2563eb", abbr: "SP" },
  ICM: { name: "ICM", color: "#16a34a", abbr: "ICM" },
  SALES_INTELLIGENCE: { name: "Sales Intelligence", color: "#9333ea", abbr: "SI" },
  GOVERNANCE_COMPLIANCE: { name: "Governance", color: "#dc2626", abbr: "GC" },
  TECHNOLOGY_PLATFORMS: { name: "Technology", color: "#0891b2", abbr: "TP" },
  STRATEGY_DESIGN: { name: "Strategy", color: "#ea580c", abbr: "SD" },
  IMPLEMENTATION_CHANGE: { name: "Implementation", color: "#ca8a04", abbr: "IC" },
  LEGAL_REGULATORY: { name: "Legal", color: "#4f46e5", abbr: "LR" },
};

type KBCard = {
  id: string;
  cardId: string;
  keyword: string;
  content: string;
  metadata: {
    pillar: string;
    category: string;
    cardType: string;
    tags: string[];
  };
};

export default function FrameworkPage() {
  const [search, setSearch] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<KBCard | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const cards = kbData.chunks as KBCard[];
  const pillarCounts = kbData.pillarCounts as Record<string, number>;

  // Filter cards
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        !search ||
        card.keyword.toLowerCase().includes(search.toLowerCase()) ||
        card.content.toLowerCase().includes(search.toLowerCase()) ||
        card.metadata.category.toLowerCase().includes(search.toLowerCase());
      const matchesPillar = !selectedPillar || card.metadata.pillar === selectedPillar;
      return matchesSearch && matchesPillar;
    });
  }, [cards, search, selectedPillar]);

  // Group by category for current filter
  const categorizedCards = useMemo(() => {
    const byCategory: Record<string, KBCard[]> = {};
    filteredCards.forEach((card) => {
      const cat = card.metadata.category;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(card);
    });
    return Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length);
  }, [filteredCards]);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <section className="py-12 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <Link href="/learn" className="text-[#64748B] hover:text-[#94A3B8] text-sm mb-4 inline-block">
            &larr; Back to Learn
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-2">
                The 8 Pillars of SPM
              </h1>
              <p className="text-[#94A3B8]">
                <span className="text-[#9333ea] font-bold">{kbData.totalChunks}</span> knowledge base cards
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-[#9333ea] text-white"
                    : "bg-white/5 text-[#94A3B8] hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-[#9333ea] text-white"
                    : "bg-white/5 text-[#94A3B8] hover:text-white"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Pillars */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-4 space-y-4">
              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards..."
                className="w-full bg-white/5 border border-[#9333ea]/20 rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#9333ea]/50"
              />

              {/* Pillar Filter */}
              <div className="bg-white/5 rounded-xl p-4 border border-[#9333ea]/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                  Pillars
                </h3>
                <button
                  onClick={() => setSelectedPillar(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-2 transition-all ${
                    !selectedPillar
                      ? "bg-[#9333ea]/20 text-[#9333ea]"
                      : "text-[#94A3B8] hover:bg-[#0F172A]"
                  }`}
                >
                  All Pillars ({kbData.totalChunks})
                </button>
                <div className="space-y-1">
                  {Object.entries(pillarConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPillar(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-all ${
                        selectedPillar === key
                          ? "text-white"
                          : "text-[#94A3B8] hover:bg-[#0F172A]"
                      }`}
                      style={{
                        backgroundColor: selectedPillar === key ? `${config.color}30` : undefined,
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        {config.name}
                      </span>
                      <span className="text-xs" style={{ color: config.color }}>
                        {pillarCounts[key] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white/5 rounded-xl p-4 border border-[#64748B]/20">
                <p className="text-xs text-[#64748B]">
                  Showing <span className="text-white font-bold">{filteredCards.length}</span> of{" "}
                  {kbData.totalChunks} cards
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {categorizedCards.length === 0 ? (
              <div className="text-center py-20 text-[#64748B]">
                No cards found matching your search.
              </div>
            ) : viewMode === "grid" ? (
              /* Grid View */
              <div className="space-y-10">
                {categorizedCards.map(([category, catCards]) => (
                  <div key={category}>
                    <h2 className="text-lg font-bold text-[#E2E8F0] mb-4 flex items-center gap-2">
                      {category}
                      <span className="text-xs text-[#64748B] bg-[#0F172A] px-2 py-1 rounded-full">
                        {catCards.length}
                      </span>
                    </h2>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {catCards.slice(0, 12).map((card) => {
                        const pillar = pillarConfig[card.metadata.pillar];
                        return (
                          <div
                            key={card.id}
                            onClick={() => setSelectedCard(card)}
                            className="bg-white/5 rounded-xl p-5 border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                            style={{ borderColor: `${pillar?.color || "#64748B"}30` }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className="px-2 py-0.5 text-xs font-bold rounded"
                                style={{
                                  backgroundColor: `${pillar?.color || "#64748B"}20`,
                                  color: pillar?.color || "#64748B",
                                }}
                              >
                                {pillar?.abbr || "?"}
                              </span>
                              <span className="text-xs text-[#64748B]">{card.metadata.cardType}</span>
                            </div>
                            <h3 className="font-bold text-[#E2E8F0] mb-2">{card.keyword}</h3>
                            <p className="text-sm text-[#94A3B8] line-clamp-3">
                              {card.content.split(". ")[1] || card.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {catCards.length > 12 && (
                      <p className="text-sm text-[#64748B] mt-4">
                        + {catCards.length - 12} more cards in this category
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-2">
                {filteredCards.slice(0, 100).map((card) => {
                  const pillar = pillarConfig[card.metadata.pillar];
                  return (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="bg-white/5 rounded-lg px-4 py-3 border border-[#64748B]/10 cursor-pointer transition-all hover:bg-white/5/80 flex items-center gap-4"
                    >
                      <span
                        className="px-2 py-0.5 text-xs font-bold rounded shrink-0"
                        style={{
                          backgroundColor: `${pillar?.color || "#64748B"}20`,
                          color: pillar?.color || "#64748B",
                        }}
                      >
                        {pillar?.abbr || "?"}
                      </span>
                      <span className="font-medium text-[#E2E8F0]">{card.keyword}</span>
                      <span className="text-xs text-[#64748B] shrink-0">{card.metadata.category}</span>
                    </div>
                  );
                })}
                {filteredCards.length > 100 && (
                  <p className="text-center text-[#64748B] py-4">
                    Showing first 100 of {filteredCards.length} results
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white/5 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 text-sm font-bold rounded"
                style={{
                  backgroundColor: `${pillarConfig[selectedCard.metadata.pillar]?.color || "#64748B"}20`,
                  color: pillarConfig[selectedCard.metadata.pillar]?.color || "#64748B",
                }}
              >
                {pillarConfig[selectedCard.metadata.pillar]?.name || selectedCard.metadata.pillar}
              </span>
              <span className="text-sm text-[#64748B]">{selectedCard.metadata.category}</span>
            </div>
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-4">{selectedCard.keyword}</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#94A3B8] leading-relaxed whitespace-pre-wrap">
                {selectedCard.content}
              </p>
            </div>
            {selectedCard.metadata.tags && selectedCard.metadata.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#64748B]/20">
                <p className="text-xs text-[#64748B] uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded bg-[#0F172A] text-[#94A3B8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setSelectedCard(null)}
              className="mt-6 w-full py-3 rounded-xl bg-[#0F172A] text-[#94A3B8] hover:text-white transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
