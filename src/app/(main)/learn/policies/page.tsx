import Link from "next/link";
import { SectionLabel } from "@/components/ui";

export const metadata = {
  title: "17 SCP Policies | IntelligentSPM",
  description: "Sales Compensation Policies covering clawback, quota, windfall, 409A, and more.",
};

const policies = [
  { code: "SCP-001", name: "Clawback and Recovery", category: "Financial Controls" },
  { code: "SCP-002", name: "Quota Management", category: "Performance Management" },
  { code: "SCP-003", name: "Windfall and Large Deal", category: "Deal Governance" },
  { code: "SCP-004", name: "SPIF Governance", category: "Incentive Programs" },
  { code: "SCP-005", name: "Section 409A Compliance", category: "Legal Compliance" },
  { code: "SCP-006", name: "State Wage Law Compliance", category: "Legal Compliance" },
  { code: "SCP-007", name: "Sales Crediting", category: "Commission Rules" },
  { code: "SCP-008", name: "Draws and Guarantees", category: "Financial Controls" },
  { code: "SCP-009", name: "Leave of Absence", category: "HR Policies" },
  { code: "SCP-010", name: "Mid-Period Change", category: "Plan Administration" },
  { code: "SCP-011", name: "Payment Timing", category: "Payroll" },
  { code: "SCP-012", name: "Termination and Final Pay", category: "HR Policies" },
  { code: "SCP-013", name: "Data and Systems Controls", category: "IT Governance" },
  { code: "SCP-014", name: "Territory Management", category: "Territory Rules" },
  { code: "SCP-015", name: "Exception and Dispute Resolution", category: "Governance" },
  { code: "SCP-016", name: "New Hire and Onboarding", category: "HR Policies" },
  { code: "SCP-017", name: "International Requirements", category: "Legal Compliance" },
];

const categories = [...new Set(policies.map((p) => p.category))];

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-[#1a0e2e]">
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionLabel color="#A3E635" centered>Governance Framework</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6 text-center">
            17 SCP Policies
          </h1>
          <p className="text-lg text-[#CBD5E1] max-w-2xl mx-auto mb-12 text-center">
            Sales Compensation Policies. The governance layer every SPM program needs but few have.
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 text-sm rounded-full bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Policy List */}
          <div className="space-y-4">
            {policies.map((policy) => (
              <Link key={policy.code} href={`/learn/policies/${policy.code.toLowerCase()}`}>
                <div className="bg-white/5 rounded-xl p-6 border border-[#A3E635]/10 hover:border-[#A3E635]/30 transition-all cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[#A3E635] font-mono font-bold">{policy.code}</span>
                    <span className="text-[#E2E8F0] font-semibold">{policy.name}</span>
                  </div>
                  <span className="text-xs text-[#64748B] bg-[#1a0e2e] px-3 py-1 rounded-full">
                    {policy.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
