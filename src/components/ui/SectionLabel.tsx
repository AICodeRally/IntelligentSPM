/**
 * SectionLabel Component
 *
 * A styled uppercase label used for section headings.
 * Commonly appears above main page titles.
 */

interface SectionLabelProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  centered?: boolean;
}

export function SectionLabel({
  children,
  color = "#38BDF8",
  className = "",
  centered = false,
}: SectionLabelProps) {
  return (
    <p
      className={`text-sm font-semibold uppercase tracking-widest mb-4 ${centered ? "text-center" : ""} ${className}`}
      style={{ color }}
    >
      {children}
    </p>
  );
}

export default SectionLabel;
