"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import kbData from "@/data/spm-kb-cards.json";
import { getLeverColorByPillarKey, getLeverByPillarKey } from "@/lib/levers";

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
    <div className="min-h-screen bg-[#1a0e2e]">
      {/* Header */}
      <section className="py-12 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <Link href="/learn" className="text-[#64748B] hover:text-[#CBD5E1] text-sm mb-4 inline-block">
            &larr; Back to Learn
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-2">
                SPM Glossary
              </h1>
              <p className="text-[#CBD5E1]">
                <span className="text-[#FE9200] font-bold">{glossaryTerms.length}</span> terms defined in plain language
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
            className="w-full bg-white/5 border border-[#FE9200]/20 rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#FE9200]/50"
          />
        </div>

        {/* Alphabet Index */}
        <div className="flex flex-wrap gap-1 mb-8">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`w-8 h-8 rounded text-sm font-medium transition-all ${
              !selectedLetter
                ? "bg-[#FE9200] text-white"
                : "bg-white/5 text-[#CBD5E1] hover:text-white"
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
                  ? "bg-[#FE9200] text-white"
                  : hasTerms
                  ? "bg-white/5 text-[#CBD5E1] hover:text-white"
                  : "bg-white/5/50 text-[#64748B]/50 cursor-not-allowed"
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
                <h2 className="text-2xl font-bold text-[#FE9200] mb-4 sticky top-0 bg-[#1a0e2e] py-2">
                  {letter}
                </h2>
                <div className="space-y-3">
                  {terms.map((item) => (
                    <div
                      key={item.term}
                      className="bg-white/5 rounded-xl p-5 border border-[#FE9200]/10 hover:border-[#FE9200]/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#E2E8F0] mb-1">{item.term}</h3>
                          <p className="text-[#CBD5E1] text-sm">{item.definition}</p>
                        </div>
                        <div className="shrink-0 flex flex-col gap-1 items-end">
                          <span
                            className="px-2 py-0.5 text-xs font-medium rounded"
                            style={{
                              backgroundColor: `${getLeverColorByPillarKey(item.pillar)}20`,
                              color: getLeverColorByPillarKey(item.pillar),
                            }}
                          >
                            {getLeverByPillarKey(item.pillar)?.header || item.pillar}
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
