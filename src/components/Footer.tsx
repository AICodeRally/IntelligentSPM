import Link from "next/link";
import { EmailIcon, LinkedInIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="relative py-8 bg-[#0F172A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top row: Logo + Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight font-logo">
            <span className="text-white">Intelligent</span>
            <span className="spm-glow">SPM</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#94A3B8]">
            <Link href="/healthcheck" className="hover:text-white transition-colors">Healthchecks</Link>
            <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
            <Link href="/vendors" className="hover:text-white transition-colors">Vendors</Link>
            <Link href="/toddfather" className="hover:text-white transition-colors">The Toddfather</Link>
            <Link href="/style-guide" className="hover:text-white transition-colors">Style Guide</Link>
          </nav>
        </div>

        {/* Bottom row: Copyright + Powered by + Social */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <p className="text-sm text-[#94A3B8]">
            &copy; {new Date().getFullYear()} IntelligentSPM
          </p>

          <p className="text-xs text-[#94A3B8]">
            Powered by <span className="font-bold gradient-text">AICR</span> and <span className="text-[#FF8737] font-bold">The Toddfather</span> of IntelligentSPM
          </p>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/thetoddfather" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-white transition-colors" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="mailto:todd@intelligentspm.com" className="text-[#94A3B8] hover:text-white transition-colors" aria-label="Email">
              <EmailIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
