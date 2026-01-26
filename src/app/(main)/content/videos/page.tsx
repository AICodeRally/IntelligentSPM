import { Metadata } from "next";
import VideosContent from "./videos-content";

export const metadata: Metadata = {
  title: "Videos | IntelligentSPM",
  description: "The Toddfather on video. SPM reality in visual form.",
};

export default function VideosPage() {
  return <VideosContent />;
}
