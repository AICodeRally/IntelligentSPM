import { Metadata } from "next";
import CompPlanContent from "./comp-plan-content";

export const metadata: Metadata = {
  title: "Comp Plan Healthcheck | IntelligentSPM",
  description: "Upload your comp plan. AI analyzes, scores, and returns suggestions.",
};

export default function CompPlanHealthcheckPage() {
  return <CompPlanContent />;
}
