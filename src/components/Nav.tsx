"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Software", href: "/software" },
  { label: "Healthchecks", href: "/healthcheck" },
  { label: "Learn", href: "/learn" },
  { label: "Vendors", href: "/vendors" },
  { label: "Blog", href: "/content/blog" },
  { label: "The Toddfather", href: "/toddfather" },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo with SPM glow */}
          <Link href="/" className="flex items-baseline font-logo">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              Intelligent
            </span>
            <span className="text-2xl font-extrabold tracking-tight spm-glow">
              SPM
            </span>
          </Link>

          {/* Desktop Nav - larger, brighter fonts */}
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
              <button className="px-5 py-2.5 text-base font-bold text-white bg-[#FF8737] rounded-lg hover:bg-[#FF8737]/90 hover:scale-105 transition-all">
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
                <button className="w-full px-4 py-3 text-base font-bold text-white bg-[#FF8737] rounded-lg hover:bg-[#FF8737]/90 transition-all mt-2">
                  Join The Syndicate
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
