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

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    topic: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "personal">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isPersonalEmail(formData.email)) {
      setStatus("personal");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
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
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF8737] mb-4 text-center">
            Let&apos;s Talk
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6 text-center">
            Contact The Toddfather
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-xl mx-auto mb-12 text-center">
            Speaking engagement, consulting project, or just have a question. Reach out.
          </p>

          {status === "success" ? (
            <div className="bg-[#1E293B] rounded-xl p-8 border border-[#A3E635]/20 text-center">
              <div className="text-[#A3E635] text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">Message Sent</h3>
              <p className="text-[#94A3B8]">The Toddfather will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#1E293B] rounded-xl p-8 border border-[#FF8737]/20">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#94A3B8] mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0F172A] border border-[#FF8737]/20 rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FF8737]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#94A3B8] mb-2">Work Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (status === "personal") setStatus("idle");
                      }}
                      className={`w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FF8737]/50 ${
                        status === "personal" ? "border-[#EA1B85]" : "border-[#FF8737]/20"
                      }`}
                    />
                    {status === "personal" && (
                      <p className="text-[#EA1B85] text-sm mt-1">Please use your corporate email.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#94A3B8] mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#FF8737]/20 rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FF8737]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#94A3B8] mb-2">Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#FF8737]/20 rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FF8737]/50"
                  >
                    <option value="">Select a topic...</option>
                    <option value="speaking">Speaking Engagement</option>
                    <option value="consulting">Consulting Project</option>
                    <option value="askspm">Custom AskSPM</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#94A3B8] mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#FF8737]/20 rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FF8737]/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full px-6 py-4 bg-[#FF8737] text-white font-bold rounded-xl hover:bg-[#FF8737]/90 transition-all disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>

                {status === "error" && (
                  <p className="text-[#EA1B85] text-sm text-center">Something went wrong. Try again.</p>
                )}
              </div>
            </form>
          )}

          <div className="mt-8 text-center space-y-4">
            <p className="text-[#64748B] text-sm">
              Or connect directly:
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:todd@intelligentspm.com"
                className="px-4 py-2 rounded-lg bg-[#1E293B] text-[#FF8737] hover:bg-[#1E293B]/80 transition-colors text-sm"
              >
                todd@intelligentspm.com
              </a>
              <a
                href="https://www.linkedin.com/in/thetoddfather"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
