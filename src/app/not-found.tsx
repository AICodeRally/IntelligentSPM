import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-[#FF8737] text-8xl font-bold mb-4">404</div>
        <h1 className="text-2xl font-bold text-[#E2E8F0] mb-4">
          Page Not Found
        </h1>
        <p className="text-[#94A3B8] mb-8">
          This page doesn&apos;t exist. Maybe it&apos;s coming soon, or maybe you took a wrong turn.
          Either way, The Toddfather has your back.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-[#FF8737] text-white font-bold rounded-xl hover:bg-[#FF8737]/90 transition-colors"
          >
            Go Home
          </Link>

          <div className="flex gap-3">
            <Link
              href="/learn/spm-101"
              className="flex-1 px-4 py-3 bg-[#1E293B] text-[#E2E8F0] font-semibold rounded-xl hover:bg-[#1E293B]/80 transition-colors text-sm"
            >
              Learn SPM
            </Link>
            <Link
              href="/syndicate"
              className="flex-1 px-4 py-3 bg-[#1E293B] text-[#E2E8F0] font-semibold rounded-xl hover:bg-[#1E293B]/80 transition-colors text-sm"
            >
              Join Syndicate
            </Link>
          </div>
        </div>

        <p className="text-[#64748B] text-sm mt-12">
          Lost? Connect with{" "}
          <a
            href="https://www.linkedin.com/in/thetoddfather"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#38BDF8] hover:underline"
          >
            The Toddfather on LinkedIn
          </a>
        </p>
      </div>
    </div>
  );
}
