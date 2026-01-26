"use client";

import Link from "next/link";
import WaitlistForm from "@/components/forms/WaitlistForm";

const sampleQuestions = [
  "What is a clawback policy?",
  "How do accelerators work?",
  "Best practices for quota setting",
];

export default function AskSPMContent() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#FF8737] flex items-center justify-center text-2xl font-bold text-white mx-auto mb-8">
            ASK
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            Ask<span className="text-[#FF8737]">SPM</span>
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            Query The Toddfather&apos;s brain. 30 years of SPM expertise, 929 knowledge base cards,
            powered by RAG.
          </p>

          {/* Chat Preview + Waitlist */}
          <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#FF8737]/20 mb-8">
            {/* Fake chat area */}
            <div className="p-6 border-b border-[#FF8737]/10">
              <p className="text-[#64748B] mb-4">Ask anything about SPM</p>
              <div className="flex flex-wrap justify-center gap-2">
                {sampleQuestions.map((q) => (
                  <span
                    key={q}
                    className="px-4 py-2 text-sm rounded-full bg-[#FF8737]/10 text-[#FF8737]"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* Waitlist form */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">Coming Soon</h3>
              <p className="text-[#94A3B8] text-sm mb-6">
                Be the first to access The Toddfather&apos;s knowledge base.
              </p>
              <div className="max-w-sm mx-auto">
                <WaitlistForm
                  listName="healthcheck-askspm"
                  accentColor="#FF8737"
                  successMessage="We'll notify you when AskSPM launches."
                />
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: "Instant Answers", desc: "Get answers to SPM questions in seconds, not hours" },
              { title: "Real Experience", desc: "Based on 30 years of implementations, not theory" },
              { title: "929 Topics", desc: "Comprehensive knowledge base covering all SPM areas" },
            ].map((item) => (
              <div key={item.title} className="bg-[#1E293B] rounded-xl p-5 border border-[#FF8737]/10">
                <h4 className="font-bold text-[#E2E8F0] mb-2">{item.title}</h4>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-[#64748B] text-sm mt-8">
            Want your own AskSPM for your organization?{" "}
            <Link href="/toddfather/contact" className="text-[#FF8737] hover:underline">
              Contact The Toddfather
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
