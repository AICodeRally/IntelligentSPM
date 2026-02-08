"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { leverConfig, leverOrder } from "@/lib/levers";

// Get levers in order from shared config
const levers = leverOrder.map((slug) => leverConfig[slug]);

// Hero configurations with IntelligentSPM branding
const heroes = [
  {
    id: 1,
    kicker: "The Foundation",
    headlinePre: "What is ",
    highlight: "SPM",
    headlinePost: "?",
    subheadline: "Sales Performance Management is the discipline of designing, managing, and optimizing how you pay your sales team—aligning incentive plans, territories, quotas, and governance to drive the behaviors you actually want.",
    highlightColor: "#38BDF8", // Teal
    primaryCta: "Explore the 8 Levers →",
    primaryHref: "/levers",
    secondaryCta: "Learn SPM 101",
    secondaryHref: "/learn/spm-101",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)",
  },
  {
    id: 2,
    kicker: "AskSPM by The Toddfather",
    headlinePre: "Does your organization have a custom ",
    highlight: "SPM Expert",
    headlinePost: "?",
    subheadline: "The Toddfather's brain — minus the coffee addiction. Ask anything, anytime.",
    highlightColor: "#8241C8", // Purple
    primaryCta: "AskSPM →",
    primaryHref: "/healthcheck/askspm",
    secondaryCta: "Book a Toddfather Confab",
    secondaryHref: "/toddfather/contact?topic=confab",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #2D1B4E 50%, #0F172A 100%)",
  },
  {
    id: 3,
    kicker: "AI That Actually Knows Comp",
    headlinePre: "Your ",
    highlight: "Comp Plan",
    headlinePost: " has an opinion. Now you can hear it.",
    subheadline: "Upload your plan. Get instant AI analysis. No consultants required.",
    highlightColor: "#FF8737", // Orange
    primaryCta: "Run Comp Plan Healthcheck →",
    primaryHref: "/healthcheck/comp-plan",
    secondaryCta: "Book a Plan Autopsy",
    secondaryHref: "/toddfather/contact?topic=autopsy",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #3D2814 50%, #0F172A 100%)",
  },
  {
    id: 4,
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
    id: 5,
    kicker: "SPM 101",
    headlinePre: "What the ",
    highlight: "vendors",
    headlinePost: " won't tell you.",
    subheadline: "The real fundamentals of Sales Performance Management, from someone who's seen it all.",
    highlightColor: "#F472B6", // Pink
    primaryCta: "Learn SPM 101 →",
    primaryHref: "/learn/spm-101",
    secondaryCta: "Book an SPM Bootcamp",
    secondaryHref: "/toddfather/contact?topic=bootcamp",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #4A1942 50%, #0F172A 100%)",
  },
  {
    id: 6,
    kicker: "The SPM Authority",
    headlinePre: "The ",
    highlight: "Clearing House",
    headlinePost: " for SPM",
    subheadline: "No vendor agenda. No consultant spin. Just 30 years of sales compensation expertise.",
    highlightColor: "#94A3B8", // Silver
    primaryCta: "Run SPM Healthcheck →",
    primaryHref: "/healthcheck/spm",
    secondaryCta: "Book an SPM Intervention",
    secondaryHref: "/toddfather/contact?topic=intervention",
    bgGradient: "linear-gradient(135deg, #0F172A 0%, #334155 50%, #0F172A 100%)",
  },
];

const navItems = [
  { label: "Healthchecks", href: "/healthcheck" },
  { label: "Learn", href: "/learn" },
  { label: "Vendors", href: "/vendors" },
  { label: "Blog", href: "/content/blog" },
  { label: "The Toddfather", href: "/toddfather" },
];

// Blob configurations for each lever - different starting positions (adjusted for larger tiles)
const blobConfigs = [
  { blob1: { top: 30, right: -20 }, blob2: { top: 80, left: 10 }, blob3: { bottom: 120, right: 40 }, delays: [0, -7, -12] },
  { blob1: { top: 40, left: -25 }, blob2: { bottom: 130, right: -10 }, blob3: { top: 90, right: 50 }, delays: [-3, -10, -16] },
  { blob1: { bottom: 100, right: -15 }, blob2: { top: 35, left: 40 }, blob3: { top: 80, left: -10 }, delays: [-6, -13, -2] },
  { blob1: { top: 50, right: 20 }, blob2: { bottom: 140, left: -15 }, blob3: { top: 30, left: 60 }, delays: [-9, -17, -4] },
  { blob1: { top: 35, left: 10 }, blob2: { top: 100, right: -20 }, blob3: { bottom: 110, left: 50 }, delays: [-12, -8, -1] },
  { blob1: { bottom: 120, left: -10 }, blob2: { top: 40, right: 10 }, blob3: { top: 110, left: 70 }, delays: [-15, -22, -5] },
  { blob1: { top: 60, left: -15 }, blob2: { bottom: 110, right: 10 }, blob3: { top: 35, right: 60 }, delays: [-18, -3, -11] },
  { blob1: { top: 40, right: -10 }, blob2: { top: 110, left: -20 }, blob3: { bottom: 130, right: 50 }, delays: [-21, -6, -14] },
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
    <div className="min-h-screen bg-[#0F172A] pt-16">
      {/* Navbar - AICR style with gradient bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo - extrabold AICR style */}
            <Link href="/" className="flex items-center font-logo">
              <span className="text-3xl font-extrabold tracking-tight">
                <span className="text-white">Intelligent</span>
                <span
                  className="text-[#38BDF8] transition-all duration-500"
                  style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.6), 0 0 40px rgba(56, 189, 248, 0.3)' }}
                >
                  SPM
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-[#ccc] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/syndicate">
                <button
                  className="px-5 py-2.5 text-sm font-medium text-white rounded-full hover:brightness-110 transition-all"
                  style={{ backgroundColor: hero.highlightColor }}
                >
                  Join The Syndicate
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-[#999] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="border-white/10" />
                <Link href="/syndicate" onClick={() => setMobileOpen(false)}>
                  <button
                    className="w-full px-5 py-2.5 text-sm font-medium text-white rounded-full hover:brightness-110 transition-all"
                    style={{ backgroundColor: hero.highlightColor }}
                  >
                    Join The Syndicate
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
        {/* Gradient line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 gradient-animate" />
      </nav>

      {/* Hero Section - fixed height, auto-rotating */}
      <section
        className="relative py-16 md:py-24 min-h-[650px] md:min-h-[625px] flex flex-col justify-center transition-all duration-500"
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
              Powered by <span className="text-[#FF8737] font-bold">The Toddfather</span> of IntelligentSPM — 30 years of comp expertise
            </p>
          </div>
        </div>
      </section>

      {/* 8 Levers of IntelligentSPM Section */}
      <section className="py-16 px-6 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-logo">
            <span className="text-[#E2E8F0]">The 8 Levers of </span>
            <span className="text-white">Intelligent</span>
            <span
              className="text-[#38BDF8]"
              style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.6), 0 0 40px rgba(56, 189, 248, 0.3)' }}
            >SPM</span>
          </h2>
          <p className="text-center text-[#94A3B8] mb-10 max-w-2xl mx-auto">
            Pull a lever. See the consequences.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {levers.map((lever, index) => {
              const config = blobConfigs[index];

              // Generate gradient colors for blobs
              const blobColor1 = lever.color;
              const blobColor2 = lever.color;

              return (
                <Link
                  key={lever.id}
                  href={`/levers/${lever.slug}`}
                  className="relative overflow-hidden rounded-2xl group border border-white/10 transition-all duration-300 ease-out hover:border-white/30 hover:shadow-xl hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #0F172A 0%, #1c2636 100%)",
                  }}
                >
                  {/* Animated Blobs */}
                  <div
                    className="lever-blob lever-blob-1"
                    style={{
                      ...config.blob1,
                      background: `linear-gradient(135deg, ${blobColor1}80 0%, ${blobColor2}4D 100%)`,
                      animationDelay: `${config.delays[0]}s`,
                    }}
                  />
                  <div
                    className="lever-blob lever-blob-2"
                    style={{
                      ...config.blob2,
                      background: `linear-gradient(225deg, ${blobColor1}73 0%, ${blobColor2}40 100%)`,
                      animationDelay: `${config.delays[1]}s`,
                    }}
                  />
                  <div
                    className="lever-blob lever-blob-3"
                    style={{
                      ...config.blob3,
                      background: `linear-gradient(180deg, ${blobColor1}73 0%, ${blobColor2}4D 100%)`,
                      animationDelay: `${config.delays[2]}s`,
                    }}
                  />

                  {/* Header badge - full width at top */}
                  <div
                    className="py-3 text-center text-base font-bold uppercase tracking-wider text-white relative z-20"
                    style={{ backgroundColor: lever.color }}
                  >
                    {lever.header}
                  </div>

                  {/* Content - condensed 4-line format */}
                  <div className="relative z-10 p-5 flex flex-col justify-between min-h-[180px] bg-gradient-to-b from-black/20 via-black/40 to-black/60">
                    <div>
                      {/* Lever name */}
                      <h3 className="font-bold text-xl text-white mb-2">
                        {lever.name}
                      </h3>
                      {/* Tagline */}
                      <p className="text-sm text-slate-300 mb-3">
                        {lever.tagline}
                      </p>
                      {/* Consequence hook */}
                      <p className="text-sm text-red-400 italic">
                        {lever.consequence}
                      </p>
                    </div>

                    {/* Learn more indicator */}
                    <p
                      className="inline-flex items-center gap-1 text-sm font-semibold mt-4 group-hover:underline"
                      style={{ color: lever.color }}
                    >
                      Learn more →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Closing insight */}
          <p className="text-center text-slate-400 mt-10 max-w-2xl mx-auto text-sm">
            Each lever has a <span className="text-white font-medium">moves / blast radius / scoreboard / artifacts</span> playbook.
          </p>
          <p className="text-center text-slate-500 italic mt-3 max-w-2xl mx-auto text-xs">
            "Most SPM programs fail because one lever drifts quietly while another gets optimized loudly."
          </p>
        </div>
      </section>

    </div>
  );
}
