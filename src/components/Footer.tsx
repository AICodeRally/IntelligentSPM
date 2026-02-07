import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#0F172A] border-t border-[#38BDF8]/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="text-[12px] font-medium text-[#FF8737] tracking-wide mb-1">
              Home of the Toddfather for
            </p>
            <Link href="/" className="flex items-baseline mb-4">
              <span className="text-lg font-light text-[#E2E8F0]">Intelligent</span>
              <span className="text-lg font-bold text-[#38BDF8]">SPM</span>
            </Link>
            <p className="text-sm text-[#64748B]">
              The Clearing House for Sales Performance Management.
            </p>
            <p className="text-xs text-[#64748B] mt-2">
              Powered by <span className="text-[#FF8737]">AICR</span>
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-[#E2E8F0] mb-3">Healthchecks</h4>
            <div className="space-y-2 text-sm">
              <Link href="/healthcheck/spm" className="block text-[#94A3B8] hover:text-[#E2E8F0]">SPM Healthcheck</Link>
              <Link href="/healthcheck/comp-plan" className="block text-[#94A3B8] hover:text-[#E2E8F0]">Comp Plan</Link>
              <Link href="/healthcheck/governance" className="block text-[#94A3B8] hover:text-[#E2E8F0]">Governance</Link>
              <Link href="/healthcheck/askspm" className="block text-[#94A3B8] hover:text-[#E2E8F0]">AskSPM</Link>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-bold text-[#E2E8F0] mb-3">Learn</h4>
            <div className="space-y-2 text-sm">
              <Link href="/learn/spm-101" className="block text-[#94A3B8] hover:text-[#E2E8F0]">SPM 101</Link>
              <Link href="/learn/framework" className="block text-[#94A3B8] hover:text-[#E2E8F0]">8 Pillars</Link>
              <Link href="/learn/policies" className="block text-[#94A3B8] hover:text-[#E2E8F0]">17 Policies</Link>
              <Link href="/learn/glossary" className="block text-[#94A3B8] hover:text-[#E2E8F0]">Glossary</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-[#E2E8F0] mb-3">Connect</h4>
            <div className="space-y-2 text-sm">
              <Link href="/syndicate" className="block text-[#94A3B8] hover:text-[#E2E8F0]">The Syndicate</Link>
              <Link href="/content/blog" className="block text-[#94A3B8] hover:text-[#E2E8F0]">Blog</Link>
              <Link href="/toddfather" className="block text-[#94A3B8] hover:text-[#E2E8F0]">The Toddfather</Link>
              <Link href="/toddfather/contact" className="block text-[#94A3B8] hover:text-[#E2E8F0]">Contact</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#38BDF8]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#64748B]">
            &copy; {new Date().getFullYear()} IntelligentSPM. All rights reserved.
          </p>
          <p className="text-sm text-[#64748B]">
            No vendor agenda. No consultant spin.
          </p>
        </div>
      </div>
    </footer>
  );
}
