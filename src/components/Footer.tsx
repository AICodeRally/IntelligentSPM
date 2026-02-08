import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative py-8 bg-[#0F172A]">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-animate" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top row: Logo + Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-white">Intelligent</span>
            <span
              className="text-[#38BDF8]"
              style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.6), 0 0 40px rgba(56, 189, 248, 0.3)' }}
            >SPM</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#999]">
            <Link href="/healthcheck" className="hover:text-white transition-colors">Healthchecks</Link>
            <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
            <Link href="/vendors" className="hover:text-white transition-colors">Vendors</Link>
            <Link href="/toddfather" className="hover:text-white transition-colors">The Toddfather</Link>
          </nav>
        </div>

        {/* Bottom row: Copyright + Powered by + Social */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <p className="text-sm text-[#999]">
            &copy; {new Date().getFullYear()} IntelligentSPM
          </p>

          <p className="text-xs text-[#888]">
            Powered by <span className="font-bold gradient-text">AICR</span> and <span className="text-[#FF8737] font-bold">The Toddfather</span> of IntelligentSPM
          </p>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/thetoddfather" target="_blank" rel="noopener noreferrer" className="text-[#999] hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:todd@intelligentspm.com" className="text-[#999] hover:text-white transition-colors" aria-label="Email">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
