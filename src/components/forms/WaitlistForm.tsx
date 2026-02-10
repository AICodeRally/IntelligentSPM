"use client";

import { useState } from "react";
import { isPersonalEmail } from "@/lib/email-utils";
import { Divider } from "@/components/ui/Divider";
import { LinkedInButton } from "@/components/ui/LinkedInButton";

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
        <p className="text-[#CBD5E1] text-sm mt-1">{successMessage}</p>
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
            className="w-full bg-[#1a0e2e] border rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none transition-colors"
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

      <Divider className="my-4" />

      <LinkedInButton />

      <p className="text-[#64748B] text-xs text-center">
        Corporate email required. No personal addresses.
      </p>
    </div>
  );
}
