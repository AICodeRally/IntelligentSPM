import { Metadata } from "next";
import PodcastContent from "./podcast-content";

export const metadata: Metadata = {
  title: "Podcast | IntelligentSPM",
  description: "The Toddfather podcast. SPM reality in audio form.",
};

export default function PodcastPage() {
  return <PodcastContent />;
}
