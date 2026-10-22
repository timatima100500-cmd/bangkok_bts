const LINE_STROKE_COLORS = {
  sukhumvit: "#45B26B", // light green
  silom: "#0E9F6E", // dark green
  pink: "#EC4899",
} as const;

/**
 * Three nested arcs — one per line concept (light green / dark green / pink).
 * Fixed palette reads well on both light and dark backgrounds.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="BTS Fare Calculator logo"
    >
      <g fill="none" strokeWidth="3.5" strokeLinecap="round">
        <path d="M26 26 A20 20 0 0 0 6 6" stroke={LINE_STROKE_COLORS.sukhumvit} />
        <path d="M22 26 A16 16 0 0 0 6 10" stroke={LINE_STROKE_COLORS.silom} />
        <path d="M18 26 A12 12 0 0 0 6 14" stroke={LINE_STROKE_COLORS.pink} />
      </g>
    </svg>
  );
}
