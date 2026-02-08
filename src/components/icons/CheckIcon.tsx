interface CheckIconProps {
  className?: string;
  strokeWidth?: number;
}

export function CheckIcon({ className = "w-4 h-4", strokeWidth = 2 }: CheckIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
