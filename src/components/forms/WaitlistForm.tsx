"use client";

import { useState } from "react";

const PERSONAL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "live.com",
  "msn.com",
  "protonmail.com",
  "proton.me",
  "mail.com",
  "ymail.com",
  "gmx.com",
  "gmx.net",
  "zoho.com",
  "fastmail.com",
  "tutanota.com",
  "hey.com",
];

function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return PERSONAL_DOMAINS.includes(domain);
}

interface WaitlistFormProps {
  listName: string;
  accentColor?: string;
  successMessage?: string;
}

export default function WaitlistForm({
  listName,
  accentColor = "#38BDF8",
  successMessage = "We'll notify you when we launch.",
}: WaitlistFormProps) {
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
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, list: listName }),
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

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="text-[#A3E635] text-3xl mb-3">✓</div>
        <p className="text-[#E2E8F0] font-semibold">You&apos;re on the list!</p>
        <p className="text-[#94A3B8] text-sm mt-1">{successMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
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
            className="w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none transition-colors"
            style={{
              borderColor: status === "personal" ? "#EA1B85" : `${accentColor}30`,
            }}
            onFocus={(e) => {
              if (status !== "personal") {
                e.target.style.borderColor = `${accentColor}60`;
              }
            }}
            onBlur={(e) => {
              if (status !== "personal") {
                e.target.style.borderColor = `${accentColor}30`;
              }
            }}
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
          className="w-full px-6 py-3 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {status === "loading" ? "..." : "Get Notified"}
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
  );
}
