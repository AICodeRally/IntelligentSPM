"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Import all policies
import SCP001 from "@/data/policies/SCP-001.json";
import SCP002 from "@/data/policies/SCP-002.json";
import SCP003 from "@/data/policies/SCP-003.json";
import SCP004 from "@/data/policies/SCP-004.json";
import SCP005 from "@/data/policies/SCP-005.json";
import SCP006 from "@/data/policies/SCP-006.json";
import SCP007 from "@/data/policies/SCP-007.json";
import SCP008 from "@/data/policies/SCP-008.json";
import SCP009 from "@/data/policies/SCP-009.json";
import SCP010 from "@/data/policies/SCP-010.json";
import SCP011 from "@/data/policies/SCP-011.json";
import SCP012 from "@/data/policies/SCP-012.json";
import SCP013 from "@/data/policies/SCP-013.json";
import SCP014 from "@/data/policies/SCP-014.json";
import SCP015 from "@/data/policies/SCP-015.json";
import SCP016 from "@/data/policies/SCP-016.json";
import SCP017 from "@/data/policies/SCP-017.json";

// Policy type definition
interface PolicyJSON {
  code: string;
  name: string;
  category: string;
  frameworkArea: string;
  status: string;
  version: string;
  effectiveDate: string;
  legalReviewRequired: boolean;
  purpose: {
    summary: string;
    objectives: string[];
  };
  scope: {
    appliesTo: string[];
    exclusions: string[];
    geographic: string[];
  };
  definitions: Array<{
    term: string;
    definition: string;
    examples: string[];
  }>;
  provisions: Array<{
    id: string;
    title: string;
    content: string;
    priority: string;
    subProvisions: Array<{
      id: string;
      title: string;
      content: string;
      items: string[];
    }>;
    tables: Array<{
      id: string;
      caption: string;
      headers: string[];
      rows: string[][];
    }>;
  }>;
  compliance: {
    federalLaws: string[];
    stateLaws: string[];
    industryStandards: string[];
    keywords: string[];
  };
  relatedPolicies: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    approvedBy: string;
    sourceFile: string;
    wordCount: number;
    changeLog: Array<{
      version: string;
      date: string;
      author: string;
      description: string;
    }>;
  };
}

const policies: Record<string, PolicyJSON> = {
  "scp-001": SCP001 as PolicyJSON,
  "scp-002": SCP002 as PolicyJSON,
  "scp-003": SCP003 as PolicyJSON,
  "scp-004": SCP004 as PolicyJSON,
  "scp-005": SCP005 as PolicyJSON,
  "scp-006": SCP006 as PolicyJSON,
  "scp-007": SCP007 as PolicyJSON,
  "scp-008": SCP008 as PolicyJSON,
  "scp-009": SCP009 as PolicyJSON,
  "scp-010": SCP010 as PolicyJSON,
  "scp-011": SCP011 as PolicyJSON,
  "scp-012": SCP012 as PolicyJSON,
  "scp-013": SCP013 as PolicyJSON,
  "scp-014": SCP014 as PolicyJSON,
  "scp-015": SCP015 as PolicyJSON,
  "scp-016": SCP016 as PolicyJSON,
  "scp-017": SCP017 as PolicyJSON,
};

const categoryColors: Record<string, string> = {
  "Financial Controls": "#dc2626",
  "Performance Management": "#8B5CF6",
  "Deal Governance": "#FACC15",
  "Incentive Programs": "#16a34a",
  "Legal Compliance": "#4f46e5",
  "Commission Rules": "#ea580c",
  "HR Policies": "#0891b2",
  "Plan Administration": "#38BDF8",
  Payroll: "#ca8a04",
  "IT Governance": "#9333ea",
  Governance: "#A3E635",
  "Territory Rules": "#2563eb",
};

export default function PolicyDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const policy = policies[code.toLowerCase()];

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["prov-001"])
  );

  if (!policy) {
    notFound();
  }

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const color = categoryColors[policy.category] || "#A3E635";

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <section
        className="py-12 px-6 border-b border-[#1E293B]"
        style={{
          background: `linear-gradient(135deg, ${color}15, transparent)`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/learn/policies"
            className="text-[#64748B] hover:text-[#94A3B8] text-sm mb-6 inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Policies
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 text-sm font-bold rounded-full"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {policy.code}
            </span>
            <span
              className="px-3 py-1 text-xs font-medium rounded-full bg-[#1E293B]"
              style={{ color }}
            >
              {policy.category}
            </span>
            {policy.status === "DRAFT" && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400">
                Draft
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-4">
            {policy.name}
          </h1>

          <p className="text-lg text-[#94A3B8] mb-6">{policy.purpose.summary}</p>

          <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
            <span>Version {policy.version}</span>
            <span>•</span>
            <span>{policy.metadata.wordCount.toLocaleString()} words</span>
            {policy.legalReviewRequired && (
              <>
                <span>•</span>
                <span className="text-amber-400">Legal Review Required</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Purpose & Objectives */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ backgroundColor: `${color}20`, color }}
            >
              1
            </span>
            Purpose & Objectives
          </h2>
          <div className="bg-[#1E293B] rounded-xl p-6 border border-white/10">
            <p className="text-[#94A3B8] mb-4">{policy.purpose.summary}</p>
            {policy.purpose.objectives.length > 0 && (
              <ul className="space-y-2">
                {policy.purpose.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#94A3B8]">
                    <span style={{ color }}>•</span>
                    {obj}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Scope */}
        {policy.scope && policy.scope.appliesTo.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: `${color}20`, color }}
              >
                2
              </span>
              Scope
            </h2>
            <div className="bg-[#1E293B] rounded-xl p-6 border border-white/10">
              <p className="text-sm text-[#64748B] uppercase tracking-wider mb-3">
                Applies To
              </p>
              <ul className="space-y-2">
                {policy.scope.appliesTo.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#94A3B8]">
                    <span style={{ color }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Definitions */}
        {policy.definitions && policy.definitions.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: `${color}20`, color }}
              >
                3
              </span>
              Definitions
            </h2>
            <div className="grid gap-3">
              {policy.definitions.map((def, i) => (
                <div
                  key={i}
                  className="bg-[#1E293B] rounded-xl p-4 border border-white/10"
                >
                  <p className="font-semibold text-[#E2E8F0] mb-1">{def.term}</p>
                  <p className="text-sm text-[#94A3B8]">{def.definition}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Provisions */}
        {policy.provisions && policy.provisions.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: `${color}20`, color }}
              >
                4
              </span>
              Key Provisions
            </h2>
            <div className="space-y-3">
              {policy.provisions.map((prov) => {
                const isExpanded = expandedSections.has(prov.id);
                return (
                  <div
                    key={prov.id}
                    className="bg-[#1E293B] rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(prov.id)}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded ${
                            prov.priority === "CRITICAL"
                              ? "bg-red-500/20 text-red-400"
                              : prov.priority === "HIGH"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {prov.priority}
                        </span>
                        <span className="font-semibold text-[#E2E8F0]">
                          {prov.title}
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-[#64748B] transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-white/10 pt-4">
                        <p className="text-[#94A3B8] mb-4">{prov.content}</p>

                        {/* Sub-provisions */}
                        {prov.subProvisions && prov.subProvisions.length > 0 && (
                          <div className="space-y-4 mt-4">
                            {prov.subProvisions.map((sub) => (
                              <div
                                key={sub.id}
                                className="bg-[#0F172A] rounded-lg p-4"
                              >
                                <p className="font-medium text-[#E2E8F0] mb-2">
                                  {sub.title}
                                </p>
                                {sub.content && (
                                  <p className="text-sm text-[#94A3B8] mb-2">
                                    {sub.content}
                                  </p>
                                )}
                                {sub.items && sub.items.length > 0 && (
                                  <ul className="space-y-1">
                                    {sub.items.map((item, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-[#94A3B8]"
                                      >
                                        <span style={{ color }}>•</span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tables */}
                        {prov.tables && prov.tables.length > 0 && (
                          <div className="mt-4">
                            {prov.tables.map((table) => (
                              <div key={table.id} className="overflow-x-auto">
                                {table.caption && (
                                  <p className="text-sm text-[#64748B] mb-2">
                                    {table.caption}
                                  </p>
                                )}
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-white/10">
                                      {table.headers.map((h, i) => (
                                        <th
                                          key={i}
                                          className="text-left py-2 px-3 text-[#E2E8F0] font-semibold"
                                        >
                                          {h}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {table.rows.map((row, ri) => (
                                      <tr
                                        key={ri}
                                        className="border-b border-white/5"
                                      >
                                        {row.map((cell, ci) => (
                                          <td
                                            key={ci}
                                            className="py-2 px-3 text-[#94A3B8]"
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Compliance */}
        {policy.compliance && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: `${color}20`, color }}
              >
                5
              </span>
              Compliance References
            </h2>
            <div className="bg-[#1E293B] rounded-xl p-6 border border-white/10 space-y-4">
              {policy.compliance.federalLaws.length > 0 && (
                <div>
                  <p className="text-sm text-[#64748B] uppercase tracking-wider mb-2">
                    Federal Laws
                  </p>
                  <ul className="space-y-1">
                    {policy.compliance.federalLaws.map((law, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[#94A3B8]"
                      >
                        <span style={{ color }}>•</span>
                        {law}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {policy.compliance.stateLaws.length > 0 && (
                <div>
                  <p className="text-sm text-[#64748B] uppercase tracking-wider mb-2">
                    State Laws
                  </p>
                  <ul className="space-y-1">
                    {policy.compliance.stateLaws.map((law, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[#94A3B8]"
                      >
                        <span style={{ color }}>•</span>
                        {law}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Related Policies */}
        {policy.relatedPolicies && policy.relatedPolicies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: `${color}20`, color }}
              >
                6
              </span>
              Related Policies
            </h2>
            <div className="flex flex-wrap gap-3">
              {policy.relatedPolicies.map((code) => (
                <Link key={code} href={`/learn/policies/${code.toLowerCase()}`}>
                  <span
                    className="px-4 py-2 rounded-lg font-mono font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {code}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-12 pt-8 border-t border-[#1E293B]">
          <div className="bg-gradient-to-r from-[#A3E635]/10 to-[#38BDF8]/10 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-[#E2E8F0] mb-2">
              Need help implementing this policy?
            </h3>
            <p className="text-[#94A3B8] mb-6">
              Book a Toddfather consultation for customized governance guidance.
            </p>
            <Link href="/toddfather/contact?topic=policy-implementation">
              <button className="px-8 py-3 bg-[#FF8737] text-white font-bold rounded-xl hover:bg-[#FF8737]/90 transition-all hover:scale-105">
                Book a Consultation
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
