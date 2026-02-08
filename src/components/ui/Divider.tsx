/**
 * Divider Component
 *
 * A horizontal divider with optional centered text label.
 * Commonly used between form sections (e.g., "or" between auth methods).
 */

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label = "or", className = "my-6" }: DividerProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#64748B]/30" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 bg-white/5 text-[#64748B]">{label}</span>
      </div>
    </div>
  );
}

export default Divider;
