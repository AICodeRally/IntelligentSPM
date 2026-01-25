"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import kbData from "@/data/spm-kb-cards.json";

// Pillar config for colors
const pillarColors: Record<string, string> = {
  SALES_PLANNING: "#2563eb",
  ICM: "#16a34a",
  SALES_INTELLIGENCE: "#9333ea",
  GOVERNANCE_COMPLIANCE: "#dc2626",
  TECHNOLOGY_PLATFORMS: "#0891b2",
  STRATEGY_DESIGN: "#ea580c",
  IMPLEMENTATION_CHANGE: "#ca8a04",
  LEGAL_REGULATORY: "#4f46e5",
};

const pillarNames: Record<string, string> = {
  SALES_PLANNING: "Sales Planning",
  ICM: "ICM",
  SALES_INTELLIGENCE: "Sales Intelligence",
  GOVERNANCE_COMPLIANCE: "Governance",
  TECHNOLOGY_PLATFORMS: "Technology",
  STRATEGY_DESIGN: "Strategy",
  IMPLEMENTATION_CHANGE: "Implementation",
  LEGAL_REGULATORY: "Legal",
};

type KBCard = {
  id: string;
  keyword: string;
  content: string;
  metadata: {
    pillar: string;
    category: string;
    cardType: string;
  };
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Extract all concept cards as glossary terms
  const cards = kbData.chunks as KBCard[];

  // Build glossary from concept cards
  const glossaryTerms = useMemo(() => {
    return cards
      .filter((c) => c.metadata.cardType === "concept")
      .map((c) => {
        // Extract definition from content (format: "Keyword. Definition. Related: ...")
        const parts = c.content.split(". ");
        const definition = parts.slice(1).join(". ").split("Related:")[0].trim();
        return {
          term: c.keyword,
          definition: definition || c.content,
          pillar: c.metadata.pillar,
          category: c.metadata.category,
        };
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [cards]);

  // Build alphabet index
  const letters = useMemo(() => {
    const letterSet = new Set(glossaryTerms.map((t) => t.term[0].toUpperCase()));
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => ({
      letter: l,
      hasTerms: letterSet.has(l),
    }));
  }, [glossaryTerms]);

  // Filter terms
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((t) => {
      const matchesSearch =
        !search ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
      const matchesLetter = !selectedLetter || t.term[0].toUpperCase() === selectedLetter;
      return matchesSearch && matchesLetter;
    });
  }, [glossaryTerms, search, selectedLetter]);

  // Group by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof filteredTerms> = {};
    filteredTerms.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredTerms]);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <section className="py-12 px-6 border-b border-[#1E293B]">
        <div className="max-w-5xl mx-auto">
          <Link href="/learn" className="text-[#64748B] hover:text-[#94A3B8] text-sm mb-4 inline-block">
            &larr; Back to Learn
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-2">
                SPM Glossary
              </h1>
              <p className="text-[#94A3B8]">
                <span className="text-[#FF8737] font-bold">{glossaryTerms.length}</span> terms defined in plain language
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedLetter(null);
            }}
            placeholder="Search terms..."
            className="w-full bg-[#1E293B] border border-[#FF8737]/20 rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#FF8737]/50"
          />
        </div>

        {/* Alphabet Index */}
        <div className="flex flex-wrap gap-1 mb-8">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`w-8 h-8 rounded text-sm font-medium transition-all ${
              !selectedLetter
                ? "bg-[#FF8737] text-white"
                : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
            }`}
          >
            All
          </button>
          {letters.map(({ letter, hasTerms }) => (
            <button
              key={letter}
              onClick={() => hasTerms && setSelectedLetter(letter)}
              disabled={!hasTerms}
              className={`w-8 h-8 rounded text-sm font-medium transition-all ${
                selectedLetter === letter
                  ? "bg-[#FF8737] text-white"
                  : hasTerms
                  ? "bg-[#1E293B] text-[#94A3B8] hover:text-white"
                  : "bg-[#1E293B]/50 text-[#64748B]/50 cursor-not-allowed"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-[#64748B] mb-6">
          Showing {filteredTerms.length} of {glossaryTerms.length} terms
        </p>

        {/* Terms */}
        {groupedTerms.length === 0 ? (
          <div className="text-center py-20 text-[#64748B]">
            No terms found matching your search.
          </div>
        ) : (
          <div className="space-y-10">
            {groupedTerms.map(([letter, terms]) => (
              <div key={letter}>
                <h2 className="text-2xl font-bold text-[#FF8737] mb-4 sticky top-0 bg-[#0F172A] py-2">
                  {letter}
                </h2>
                <div className="space-y-3">
                  {terms.map((item) => (
                    <div
                      key={item.term}
                      className="bg-[#1E293B] rounded-xl p-5 border border-[#FF8737]/10 hover:border-[#FF8737]/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#E2E8F0] mb-1">{item.term}</h3>
                          <p className="text-[#94A3B8] text-sm">{item.definition}</p>
                        </div>
                        <div className="shrink-0 flex flex-col gap-1 items-end">
                          <span
                            className="px-2 py-0.5 text-xs font-medium rounded"
                            style={{
                              backgroundColor: `${pillarColors[item.pillar] || "#64748B"}20`,
                              color: pillarColors[item.pillar] || "#64748B",
                            }}
                          >
                            {pillarNames[item.pillar] || item.pillar}
                          </span>
                          <span className="text-xs text-[#64748B]">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
