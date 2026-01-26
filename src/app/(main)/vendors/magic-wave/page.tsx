import { Metadata } from "next";
import MagicWaveContent from "./magic-wave-content";

export const metadata: Metadata = {
  title: "The Magic Wave | IntelligentSPM",
  description: "Annual SPM vendor landscape analysis. Honest strengths, weaknesses, and where they break.",
};

export default function MagicWavePage() {
  return <MagicWaveContent />;
}
