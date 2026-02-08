/**
 * LinkedIn Button Component
 *
 * A styled button/link to connect on LinkedIn.
 * Uses the official LinkedIn brand color (#0A66C2).
 */

import { LinkedInIcon } from "@/components/icons/LinkedInIcon";

interface LinkedInButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function LinkedInButton({
  href = "https://www.linkedin.com/in/thetoddfather",
  label = "Connect on LinkedIn",
  className = "",
}: LinkedInButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#0A66C2] text-white font-bold rounded-xl hover:bg-[#0A66C2]/90 transition-colors ${className}`}
    >
      <LinkedInIcon />
      {label}
    </a>
  );
}

export default LinkedInButton;
