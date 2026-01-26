import { Metadata } from "next";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
  title: "Contact The Toddfather | IntelligentSPM",
  description: "Speaking engagement, consulting project, or just have a question. Reach out.",
};

export default function ContactPage() {
  return <ContactContent />;
}
