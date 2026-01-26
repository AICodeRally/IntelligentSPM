import { Metadata } from "next";
import SitDownContent from "./sit-down-content";

export const metadata: Metadata = {
  title: "The Sit-Down | IntelligentSPM",
  description: "Comprehensive SPM vendor guide. When you need to sit down before picking a vendor.",
};

export default function SitDownPage() {
  return <SitDownContent />;
}
