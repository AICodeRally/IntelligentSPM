import { Metadata } from "next";
import GovernanceContent from "./governance-content";

export const metadata: Metadata = {
  title: "Governance Healthcheck | IntelligentSPM",
  description: "Upload your governance policy. Get gap analysis against 17 SCP policies.",
};

export default function GovernanceHealthcheckPage() {
  return <GovernanceContent />;
}
