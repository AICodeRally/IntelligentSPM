"use client";

import { useState } from "react";

const PERSONAL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "me.com", "mac.com", "live.com", "msn.com",
  "protonmail.com", "proton.me", "mail.com", "ymail.com", "gmx.com",
  "gmx.net", "zoho.com", "fastmail.com", "tutanota.com", "hey.com",
];

function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return PERSONAL_DOMAINS.includes(domain);
}

export default function SyndicateContent() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "personal">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isPersonalEmail(email)) {
      setStatus("personal");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF8737] mb-4">
            By The Toddfather
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            The Syndicate
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            Weekly SPM reality digest. Office hours with The Toddfather.
            Early access to tools, benchmarks, and The Magic Wave.
          </p>

          {/* Signup Form */}
          <div className="bg-white/5 rounded-xl p-8 border border-[#FF8737]/20 max-w-md mx-auto">
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="text-[#A3E635] text-4xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">You&apos;re In</h3>
                <p className="text-[#94A3B8]">Welcome to The Syndicate. Check your inbox.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "personal") setStatus("idle");
                      }}
                      placeholder="work@company.com"
                      required
                      className={`w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#FF8737]/50 ${
                        status === "personal" ? "border-[#EA1B85]" : "border-[#FF8737]/20"
                      }`}
                    />
                    {status === "personal" && (
                      <p className="text-[#EA1B85] text-sm mt-2">
                        Please use your corporate email address.
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full px-6 py-3 bg-[#FF8737] text-white font-bold rounded-xl hover:bg-[#FF8737]/90 transition-all disabled:opacity-50"
                  >
                    {status === "loading" ? "Joining..." : "Join The Syndicate"}
                  </button>
                  {status === "error" && (
                    <p className="text-[#EA1B85] text-sm text-center">Something went wrong. Try again.</p>
                  )}
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#64748B]/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white/5 text-[#64748B]">or</span>
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/thetoddfather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#0A66C2] text-white font-bold rounded-xl hover:bg-[#0A66C2]/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Connect on LinkedIn
                </a>

                <p className="text-[#64748B] text-xs text-center">
                  Corporate email required. No personal addresses.
                </p>
              </div>
            )}
          </div>

          {/* What you get */}
          <div className="mt-16 grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            {[
              { title: "Weekly Digest", desc: "SPM reality delivered every Tuesday" },
              { title: "Office Hours", desc: "Monthly Q&A with The Toddfather" },
              { title: "Early Access", desc: "Tools and benchmarks before anyone else" },
              { title: "The Network", desc: "Connect with SPM professionals" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-[#FF8737] mt-1">→</span>
                <div>
                  <h4 className="font-bold text-[#E2E8F0]">{item.title}</h4>
                  <p className="text-sm text-[#94A3B8]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[#64748B] text-sm mt-12">
            No spam. Unsubscribe anytime. Just SPM truth.
          </p>
        </div>
      </section>
    </div>
  );
}
