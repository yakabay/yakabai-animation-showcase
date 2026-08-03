type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-label="YK"
      className={className}
    >
      <circle cx="24" cy="24" r="23" fill="#08090b" />
      <circle
        cx="24"
        cy="24"
        r="21.4"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.4"
      />
      <text
        x="16.5"
        y="32.5"
        fontSize="24"
        fontWeight="800"
        fill="#22d3ee"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Y
      </text>
      <text
        x="30"
        y="32.5"
        fontSize="24"
        fontWeight="800"
        fill="#22d3ee"
        stroke="#08090b"
        strokeWidth="3.2"
        paintOrder="stroke"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        K
      </text>
    </svg>
  );
}
