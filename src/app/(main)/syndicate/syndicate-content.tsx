"use client";

import { useState } from "react";
import { isPersonalEmail } from "@/lib/email-utils";
import { Divider, LinkedInButton, SectionLabel } from "@/components/ui";

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
    <div className="min-h-screen bg-[#1a0e2e]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel color="#FE9200">By The Toddfather</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            The Syndicate
          </h1>
          <p className="text-lg text-[#CBD5E1] max-w-2xl mx-auto mb-12">
            Weekly SPM reality digest. Office hours with The Toddfather.
            Early access to tools, benchmarks, and The Magic Wave.
          </p>

          {/* Signup Form */}
          <div className="bg-white/5 rounded-xl p-8 border border-[#FE9200]/20 max-w-md mx-auto">
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="text-[#A3E635] text-4xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">You&apos;re In</h3>
                <p className="text-[#CBD5E1]">Welcome to The Syndicate. Check your inbox.</p>
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
                      className={`w-full bg-[#1a0e2e] border rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#FE9200]/50 ${
                        status === "personal" ? "border-[#EA1B85]" : "border-[#FE9200]/20"
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
                    className="w-full px-6 py-3 bg-[#FE9200] text-white font-bold rounded-xl hover:bg-[#FE9200]/90 transition-all disabled:opacity-50"
                  >
                    {status === "loading" ? "Joining..." : "Join The Syndicate"}
                  </button>
                  {status === "error" && (
                    <p className="text-[#EA1B85] text-sm text-center">Something went wrong. Try again.</p>
                  )}
                </form>

                <Divider className="my-4" />

                <LinkedInButton />

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
                <span className="text-[#FE9200] mt-1">→</span>
                <div>
                  <h4 className="font-bold text-[#E2E8F0]">{item.title}</h4>
                  <p className="text-sm text-[#CBD5E1]">{item.desc}</p>
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
