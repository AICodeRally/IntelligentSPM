"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Hero configurations with IntelligentSPM branding
const heroes = [
  {
    id: 1,
    kicker: "The SPM Authority",
    headlinePre: "The ",
    highlight: "Clearing House",
    headlinePost: " for SPM",
    subheadline: "No vendor agenda. No consultant spin. Just 30 years of sales compensation expertise.",
    highlightColor: "#38BDF8", // Teal
    primaryCta: "Run SPM Healthcheck →",
    primaryHref: "/healthcheck/spm",
    secondaryCta: "Book an SPM Intervention",
    secondaryHref: "/toddfather/contact?topic=intervention",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)",
  },
  {
    id: 2,
    kicker: "AI That Actually Knows Comp",
    headlinePre: "Your ",
    highlight: "Comp Plan",
    headlinePost: " has an opinion. Now you can hear it.",
    subheadline: "Upload your plan. Get instant AI analysis. No consultants required.",
    highlightColor: "#8241C8", // Purple
    primaryCta: "Run Comp Plan Healthcheck →",
    primaryHref: "/healthcheck/comp-plan",
    secondaryCta: "Book a Plan Autopsy",
    secondaryHref: "/toddfather/contact?topic=autopsy",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #2D1B4E 50%, #0F172A 100%)",
  },
  {
    id: 3,
    kicker: "Sales Performance Management",
    headlinePre: "Your ",
    highlight: "Comp Oversight",
    headlinePost: " is held together with duct tape.",
    subheadline: "17 governance policies. Zero ambiguity. Finally, controls that make sense.",
    highlightColor: "#A3E635", // Lime
    primaryCta: "Run Governance Healthcheck →",
    primaryHref: "/healthcheck/governance",
    secondaryCta: "Book a Policy Teardown",
    secondaryHref: "/toddfather/contact?topic=teardown",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #1A2F1A 50%, #0F172A 100%)",
  },
  {
    id: 4,
    kicker: "AskSPM by The Toddfather",
    headlinePre: "Does your organization have a custom ",
    highlight: "SPM Expert",
    headlinePost: " for immediate support?",
    subheadline: "The Toddfather's brain — minus the coffee addiction. Ask anything, anytime.",
    highlightColor: "#FF8737", // Orange
    primaryCta: "AskSPM →",
    primaryHref: "/healthcheck/askspm",
    secondaryCta: "Book a Toddfather Confab",
    secondaryHref: "/toddfather/contact?topic=confab",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #3D2814 50%, #0F172A 100%)",
  },
];

const navItems = [
  { label: "Healthchecks", href: "/healthcheck" },
  { label: "Learn", href: "/learn" },
  { label: "Vendors", href: "/vendors" },
  { label: "Blog", href: "/content/blog" },
  { label: "The Toddfather", href: "/toddfather" },
];

export default function HomePage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-rotate heroes every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentHero((prev) => (prev + 1) % heroes.length);
        setIsTransitioning(false);
      }, 300);
    }, 10000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToHero = (index: number) => {
    setIsPaused(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentHero(index);
      setIsTransitioning(false);
    }, 300);
    // Resume auto-rotate after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const hero = heroes[currentHero];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Dynamic Navbar - SPM color syncs with hero */}
      <nav className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - larger, brighter */}
            <Link href="/" className="flex items-baseline">
              <span className="text-2xl font-light text-white tracking-tight">
                Intelligent
              </span>
              <span
                className="text-2xl font-bold tracking-tight transition-colors duration-500"
                style={{ color: hero.highlightColor }}
              >
                SPM
              </span>
            </Link>

            {/* Desktop Nav - larger, brighter font */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-[#E2E8F0] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/syndicate">
                <button
                  className="px-5 py-2.5 text-base font-bold text-white rounded-lg transition-all hover:scale-105"
                  style={{ backgroundColor: hero.highlightColor }}
                >
                  Join The Syndicate
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg text-[#E2E8F0] hover:text-white transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/syndicate" onClick={() => setMobileOpen(false)}>
                  <button
                    className="w-full px-4 py-3 text-base font-bold text-white rounded-lg mt-2"
                    style={{ backgroundColor: hero.highlightColor }}
                  >
                    Join The Syndicate
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - fixed height, auto-rotating */}
      <section
        className="relative py-16 md:py-24 min-h-[520px] md:min-h-[500px] flex flex-col justify-center transition-all duration-500"
        style={{ background: hero.bgGradient }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div
          className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Main Headline - fixed height container */}
          <div className="h-[140px] md:h-[120px] flex items-center justify-center mb-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#E2E8F0] leading-tight">
              {hero.headlinePre}
              <span style={{ color: hero.highlightColor }}>{hero.highlight}</span>
              {hero.headlinePost}
            </h1>
          </div>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-6">
            {hero.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href={hero.primaryHref}>
              <button
                className="px-6 py-3 rounded-xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{ backgroundColor: hero.highlightColor }}
              >
                {hero.primaryCta}
              </button>
            </Link>
            <Link href={hero.secondaryHref}>
              <button className="px-6 py-3 rounded-xl text-white font-medium text-base border-2 border-white/30 hover:border-white/60 transition-all">
                {hero.secondaryCta}
              </button>
            </Link>
          </div>

          {/* Navigation Dots + Toddfather tagline */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-center gap-3 mb-3">
              {heroes.map((h, idx) => (
                <button
                  key={h.id}
                  onClick={() => goToHero(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentHero ? "scale-125" : "opacity-50 hover:opacity-75"
                  }`}
                  style={{
                    backgroundColor: idx === currentHero ? h.highlightColor : "#94A3B8",
                  }}
                  aria-label={`Go to hero ${idx + 1}`}
                />
              ))}
            </div>
            <p className="text-base md:text-lg text-[#E2E8F0]">
              Powered by <span className="text-[#FF8737] font-bold">The Toddfather</span> — 30 years of comp expertise
            </p>
          </div>
        </div>
      </section>

      {/* 8 SPM Pillars Section */}
      <section className="py-16 px-6 bg-[#1E293B]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#E2E8F0] mb-3">
            The 8 Pillars of SPM
          </h2>
          <p className="text-center text-[#94A3B8] mb-10 max-w-2xl mx-auto">
            Comprehensive sales performance management across every critical dimension.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Sales Planning", abbr: "SP", color: "#2563eb", desc: "Territory, quota, capacity" },
              { name: "ICM", abbr: "ICM", color: "#16a34a", desc: "Plans, payments, statements" },
              { name: "Sales Intelligence", abbr: "SI", color: "#9333ea", desc: "Analytics, forecasting, AI" },
              { name: "Governance", abbr: "GC", color: "#dc2626", desc: "SOX, 409A, controls" },
              { name: "Technology", abbr: "TP", color: "#0891b2", desc: "Vendors, integrations" },
              { name: "Strategy", abbr: "SD", color: "#ea580c", desc: "Pay philosophy, design" },
              { name: "Implementation", abbr: "IC", color: "#ca8a04", desc: "Change, training" },
              { name: "Legal", abbr: "LR", color: "#4f46e5", desc: "Wage laws, compliance" },
            ].map((pillar) => (
              <div
                key={pillar.name}
                className="bg-[#0F172A] rounded-xl p-4 text-center border transition-all hover:scale-105"
                style={{ borderColor: `${pillar.color}30` }}
              >
                <div
                  className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: pillar.color }}
                >
                  {pillar.abbr}
                </div>
                <h3
                  className="font-semibold text-xs mb-1"
                  style={{ color: pillar.color }}
                >
                  {pillar.name}
                </h3>
                <p className="text-xs text-[#64748B]">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-6 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#E2E8F0] mb-10">
            Quick Access
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {heroes.map((h) => (
              <Link key={h.id} href={h.primaryHref}>
                <div
                  className="rounded-xl p-5 border border-white/10 hover:border-white/30 transition-all hover:scale-105 cursor-pointer h-full"
                  style={{
                    background: `linear-gradient(135deg, #1E293B 0%, ${h.highlightColor}15 100%)`,
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: h.highlightColor }}
                  >
                    {h.kicker}
                  </p>
                  <h3 className="text-base font-bold text-[#E2E8F0] mb-2">
                    {h.highlight}
                  </h3>
                  <p className="text-sm text-[#94A3B8]">
                    {h.primaryCta.replace(" →", "")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
