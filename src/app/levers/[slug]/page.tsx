"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { leverConfig } from "@/lib/levers";
import kbData from "@/data/spm-kb-cards.json";

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

export default function LeverPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const lever = leverConfig[slug as keyof typeof leverConfig];

  const [kbExpanded, setKbExpanded] = useState(false);
  const [kbSearch, setKbSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState<KBCard | null>(null);

  if (!lever) {
    notFound();
  }

  // Filter KB cards for this lever
  const cards = kbData.chunks as KBCard[];
  const leverCards = useMemo(() => {
    return cards.filter((card) => card.metadata.pillar === lever.oldPillarKey);
  }, [cards, lever.oldPillarKey]);

  const filteredCards = useMemo(() => {
    if (!kbSearch) return leverCards;
    const search = kbSearch.toLowerCase();
    return leverCards.filter(
      (card) =>
        card.keyword.toLowerCase().includes(search) ||
        card.content.toLowerCase().includes(search) ||
        card.metadata.category.toLowerCase().includes(search)
    );
  }, [leverCards, kbSearch]);

  // Group by category
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
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/levers" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Levers
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Category badge */}
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-white mb-4"
            style={{ backgroundColor: lever.color }}
          >
            {lever.header}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {lever.name}
          </h1>

          {/* Tagline */}
          <p className="text-xl text-slate-300 mb-6">
            {lever.tagline}
          </p>

          {/* What it is */}
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mb-6">
            {lever.whatItIs}
          </p>

          {/* When to pull */}
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: lever.color }}>
              When to Pull This Lever
            </h3>
            <ul className="space-y-2">
              {lever.whenToPullBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span style={{ color: lever.color }}>•</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The Consequences Section */}
      <section className="py-12 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">The Consequences</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* What It Moves */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: lever.color }}>
                What It Moves
              </h3>
              <p className="text-slate-200 leading-relaxed">{lever.moves}</p>
            </div>

            {/* Blast Radius */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-red-400">
                Blast Radius
              </h3>
              <p className="text-slate-200 leading-relaxed">{lever.blast}</p>
            </div>

            {/* Scoreboard */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-emerald-400">
                Scoreboard
              </h3>
              <p className="text-slate-200 leading-relaxed">{lever.scoreboard}</p>
            </div>

            {/* Default Artifacts */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-sky-400">
                Default Artifacts
              </h3>
              <p className="text-slate-200 leading-relaxed">{lever.artifacts}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Failures */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Common Failures</h2>
          <ul className="space-y-3">
            {lever.commonFailures.map((failure, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-red-400 mt-1">•</span>
                <span className="text-slate-300">{failure}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fast Wins */}
      <section className="py-12 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Fast Wins</h2>
          <ul className="space-y-3">
            {lever.fastWins.map((win, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span className="text-slate-300">{win}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setKbExpanded(!kbExpanded)}
            className="w-full flex items-center justify-between bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
              <span
                className="px-3 py-1 text-sm font-bold rounded-full"
                style={{ backgroundColor: `${lever.color}30`, color: lever.color }}
              >
                {leverCards.length} cards
              </span>
            </div>
            {kbExpanded ? (
              <ChevronUpIcon className="w-6 h-6 text-slate-400" />
            ) : (
              <ChevronDownIcon className="w-6 h-6 text-slate-400" />
            )}
          </button>

          {kbExpanded && (
            <div className="mt-6 space-y-6">
              {/* Search */}
              <input
                type="text"
                value={kbSearch}
                onChange={(e) => setKbSearch(e.target.value)}
                placeholder="Search cards in this lever..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-white/30"
              />

              {/* Results count */}
              <p className="text-sm text-slate-500">
                Showing {filteredCards.length} of {leverCards.length} cards
              </p>

              {/* Cards by category */}
              <div className="space-y-8">
                {categorizedCards.map(([category, catCards]) => (
                  <div key={category}>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      {category}
                      <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full">
                        {catCards.length}
                      </span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {catCards.slice(0, 6).map((card) => (
                        <div
                          key={card.id}
                          onClick={() => setSelectedCard(card)}
                          className="bg-white/5 rounded-xl p-5 border border-white/10 cursor-pointer transition-all hover:scale-[1.02] hover:border-white/20"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className="px-2 py-0.5 text-xs font-bold rounded"
                              style={{
                                backgroundColor: `${lever.color}20`,
                                color: lever.color,
                              }}
                            >
                              {lever.header}
                            </span>
                            <span className="text-xs text-slate-500">{card.metadata.cardType}</span>
                          </div>
                          <h4 className="font-bold text-white mb-2">{card.keyword}</h4>
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {card.content.split(". ")[1] || card.content}
                          </p>
                        </div>
                      ))}
                    </div>
                    {catCards.length > 6 && (
                      <p className="text-sm text-slate-500 mt-4">
                        + {catCards.length - 6} more cards in this category
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Evidence Questions (Score This Lever) */}
      <section className="py-12 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Score This Lever</h2>
          <p className="text-slate-400 mb-6 text-sm">
            If you can&apos;t answer &quot;yes&quot; with proof, you don&apos;t score above 2.
          </p>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-4">
              {lever.evidenceQuestions.map((question, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded border-2 border-slate-500 shrink-0 flex items-center justify-center">
                    <span className="text-slate-500 text-xs">{idx + 1}</span>
                  </div>
                  <span className="text-slate-200">{question}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-slate-500 text-xs mt-4 italic">
            Score: 0 (Missing) → 1 (Documented) → 2 (Repeatable) → 3 (Controlled) → 4 (Optimized)
          </p>
        </div>
      </section>

      {/* Maturity Ladder */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Maturity Ladder</h2>
          <div className="space-y-4">
            {lever.maturityLadder.map((level) => (
              <div key={level.level} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: lever.color, opacity: 0.2 + (level.level * 0.16) }}
                >
                  {level.level}
                </div>
                <div>
                  <p className="text-white font-semibold">{level.name}</p>
                  <p className="text-slate-400 text-sm">{level.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Kit */}
      <section className="py-12 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">The Kit</h2>

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-sky-400">
              Starter Artifacts
            </h3>
            <p className="text-slate-200">{lever.starterArtifacts}</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {lever.prevSlug ? (
            <Link
              href={`/levers/${lever.prevSlug}`}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Previous Lever
            </Link>
          ) : (
            <div />
          )}

          {lever.nextSlug ? (
            <Link
              href={`/levers/${lever.nextSlug}`}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              Next Lever
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/levers"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              Back to All Levers
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-[#0F172A] border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 text-sm font-bold rounded"
                style={{ backgroundColor: `${lever.color}20`, color: lever.color }}
              >
                {lever.header}
              </span>
              <span className="text-sm text-slate-400">{selectedCard.metadata.category}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{selectedCard.keyword}</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedCard.content}
              </p>
            </div>
            {selectedCard.metadata.tags && selectedCard.metadata.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded bg-white/5 text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setSelectedCard(null)}
              className="mt-6 w-full py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
