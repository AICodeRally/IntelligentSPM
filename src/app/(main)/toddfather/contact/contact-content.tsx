"use client";

import { useState } from "react";
import { isPersonalEmail } from "@/lib/email-utils";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { SectionLabel } from "@/components/ui";

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
    <div className="min-h-screen bg-[#1a0e2e]">
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <SectionLabel color="#FE9200" centered>Let&apos;s Talk</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6 text-center">
            Contact The Toddfather
          </h1>
          <p className="text-lg text-[#CBD5E1] max-w-xl mx-auto mb-12 text-center">
            Speaking engagement, consulting project, or just have a question. Reach out.
          </p>

          {status === "success" ? (
            <div className="bg-white/5 rounded-xl p-8 border border-[#A3E635]/20 text-center">
              <div className="text-[#A3E635] text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">Message Sent</h3>
              <p className="text-[#CBD5E1]">The Toddfather will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-8 border border-[#FE9200]/20">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#CBD5E1] mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#1a0e2e] border border-[#FE9200]/20 rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FE9200]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#CBD5E1] mb-2">Work Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (status === "personal") setStatus("idle");
                      }}
                      className={`w-full bg-[#1a0e2e] border rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FE9200]/50 ${
                        status === "personal" ? "border-[#EA1B85]" : "border-[#FE9200]/20"
                      }`}
                    />
                    {status === "personal" && (
                      <p className="text-[#EA1B85] text-sm mt-1">Please use your corporate email.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#CBD5E1] mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#1a0e2e] border border-[#FE9200]/20 rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FE9200]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#CBD5E1] mb-2">Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#1a0e2e] border border-[#FE9200]/20 rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FE9200]/50"
                  >
                    <option value="">Select a topic...</option>
                    <option value="speaking">Speaking Engagement</option>
                    <option value="consulting">Consulting Project</option>
                    <option value="askspm">Custom AskSPM</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#CBD5E1] mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#1a0e2e] border border-[#FE9200]/20 rounded-xl px-4 py-3 text-[#E2E8F0] focus:outline-none focus:border-[#FE9200]/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full px-6 py-4 bg-[#FE9200] text-white font-bold rounded-xl hover:bg-[#FE9200]/90 transition-all disabled:opacity-50"
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
                className="px-4 py-2 rounded-lg bg-white/5 text-[#FE9200] hover:bg-white/5/80 transition-colors text-sm"
              >
                todd@intelligentspm.com
              </a>
              <a
                href="https://www.linkedin.com/in/thetoddfather"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors text-sm flex items-center gap-2"
              >
                <LinkedInIcon className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
