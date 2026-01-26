import { Metadata } from "next";
import SPMHealthcheckContent from "./spm-content";

export const metadata: Metadata = {
  title: "SPM Healthcheck | IntelligentSPM",
  description: "Quiz your current SPM state against the 8 pillars. Get scores and recommendations.",
};

export default function SPMHealthcheckPage() {
  return <SPMHealthcheckContent />;
}
