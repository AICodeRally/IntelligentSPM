import { Metadata } from "next";
import SPMHealthcheckClient from "./spm-client";

export const metadata: Metadata = {
  title: "SPM Healthcheck | IntelligentSPM",
  description: "Quiz your current SPM state against the 8 levers. Get scores and recommendations.",
};

export default function SPMHealthcheckPage() {
  return <SPMHealthcheckClient />;
}
