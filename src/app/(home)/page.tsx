"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TargetIcon,
  StackIcon,
  BarChartIcon,
  LockClosedIcon,
  GearIcon,
  MixerHorizontalIcon,
  RocketIcon,
  ReaderIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";

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
    headlinePost: "?",
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

const pillars = [
  {
    id: "sales-planning",
    name: "Sales Planning",
    color: "#2563eb",
    desc: "Territory, quota, capacity",
    icon: TargetIcon,
    bullets: [
      "Territory design and alignment",
      "Quota setting methodology",
      "Capacity planning and headcount",
      "Coverage model optimization",
    ],
    why: "Bad territories kill good reps.",
    link: "/learn/spm-101",
  },
  {
    id: "icm",
    name: "ICM",
    color: "#16a34a",
    desc: "Plans, payments, statements",
    icon: StackIcon,
    bullets: [
      "Compensation plan design",
      "Commission calculations and payments",
      "Statement generation and delivery",
      "Plan modeling and simulation",
    ],
    why: "This is where the money moves.",
    link: "/learn/spm-101",
  },
  {
    id: "sales-intelligence",
    name: "Sales Intelligence",
    color: "#9333ea",
    desc: "Analytics, forecasting, AI",
    icon: BarChartIcon,
    bullets: [
      "Pipeline analytics and forecasting",
      "Performance dashboards",
      "AI-driven insights",
      "Predictive modeling",
    ],
    why: "You can't manage what you can't measure.",
    link: "/learn/spm-101",
  },
  {
    id: "governance",
    name: "Governance",
    color: "#dc2626",
    desc: "SOX, 409A, controls",
    icon: LockClosedIcon,
    bullets: [
      "Segregation of duties and approvals",
      "Audit trails and change management",
      "SOX and 409A compliance",
      "Policy documentation standards",
    ],
    why: "Most orgs have zero formal comp governance.",
    link: "/healthcheck/governance",
  },
  {
    id: "technology",
    name: "Technology",
    color: "#0891b2",
    desc: "Vendors, integrations",
    icon: GearIcon,
    bullets: [
      "Vendor evaluation and selection",
      "System integrations (CRM, ERP, HRIS)",
      "Data architecture and flows",
      "Build vs buy decisions",
    ],
    why: "The wrong tool costs more than no tool.",
    link: "/vendors",
  },
  {
    id: "strategy",
    name: "Strategy",
    color: "#ea580c",
    desc: "Pay philosophy, design",
    icon: MixerHorizontalIcon,
    bullets: [
      "Pay philosophy and positioning",
      "Plan design principles",
      "Pay mix and leverage decisions",
      "Competitive benchmarking",
    ],
    why: "Strategy before spreadsheets.",
    link: "/learn/framework",
  },
  {
    id: "implementation",
    name: "Implementation",
    color: "#ca8a04",
    desc: "Change, training",
    icon: RocketIcon,
    bullets: [
      "Change management approach",
      "Training and enablement",
      "Rollout and communication",
      "Adoption tracking",
    ],
    why: "A perfect plan poorly rolled out is a failed plan.",
    link: "/learn/spm-101",
  },
  {
    id: "legal",
    name: "Legal",
    color: "#4f46e5",
    desc: "Wage laws, compliance",
    icon: ReaderIcon,
    bullets: [
      "State wage law compliance",
      "Plan document requirements",
      "Clawback and forfeiture rules",
      "International considerations",
    ],
    why: "Comp lawsuits are expensive and avoidable.",
    link: "/learn/policies",
  },
];

export default function HomePage() {
  const [currentHero, setCurrentHero] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

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
            Click any pillar to explore what it covers
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isExpanded = expandedPillar === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setExpandedPillar(isExpanded ? null : pillar.id)}
                  className={`
                    bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center
                    border border-white/10 cursor-pointer
                    transition-all duration-300 ease-out
                    hover:border-opacity-50 hover:shadow-lg
                    ${isExpanded ? "col-span-2 md:col-span-2" : ""}
                  `}
                  style={{
                    borderColor: isExpanded ? `${pillar.color}50` : undefined,
                    boxShadow: isExpanded ? `0 10px 40px ${pillar.color}20` : undefined,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                        style={{ backgroundColor: pillar.color }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3
                          className="font-semibold text-base"
                          style={{ color: pillar.color }}
                        >
                          {pillar.name}
                        </h3>
                        <p className="text-xs text-slate-400">{pillar.desc}</p>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Expanded Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-white/10 pt-4 text-left">
                      <ul className="space-y-2 mb-4">
                        {pillar.bullets.map((bullet, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span style={{ color: pillar.color }}>•</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-slate-400 italic mb-4">
                        Why it matters: {pillar.why}
                      </p>
                      <Link
                        href={pillar.link}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
                        style={{ color: pillar.color }}
                      >
                        Learn more →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
