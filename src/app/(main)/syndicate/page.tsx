import { Metadata } from "next";
import SyndicateContent from "./syndicate-content";

export const metadata: Metadata = {
  title: "The Syndicate | IntelligentSPM",
  description: "Weekly SPM reality digest. Office hours with The Toddfather. Early access to tools and benchmarks.",
};

export default function SyndicatePage() {
  return <SyndicateContent />;
}
