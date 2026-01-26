import { Metadata } from "next";
import AskSPMContent from "./askspm-content";

export const metadata: Metadata = {
  title: "AskSPM | IntelligentSPM",
  description: "Query The Toddfather's brain. 30 years of SPM expertise powered by RAG.",
};

export default function AskSPMPage() {
  return <AskSPMContent />;
}
