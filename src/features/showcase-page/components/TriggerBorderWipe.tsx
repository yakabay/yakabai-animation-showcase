import { useLayoutEffect, useRef, useState } from "react";

const STROKE = "#22d3ee";
const STROKE_WIDTH = 1.5;
const RADIUS = 4;
const INSET = 1;

interface TriggerBorderWipeProps {
  /** Bumped on every trigger fire; restarts the wipe from full cyan. */
  activationGen: number;
  durationMs: number;
}

/** Rounded-rect outline path starting at top-center, traced clockwise. */
function topCenterRoundedRectPath(width: number, height: number, r: number): string {
  return [
    `M ${width / 2} 0`,
    `L ${width - r} 0`,
    `A ${r} ${r} 0 0 1 ${width} ${r}`,
    `L ${width} ${height - r}`,
    `A ${r} ${r} 0 0 1 ${width - r} ${height}`,
    `L ${r} ${height}`,
    `A ${r} ${r} 0 0 1 0 ${height - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    `L ${width / 2} 0`,
  ].join(" ");
}

/** Cyan border that wipes away starting from top-center, revealing the resting gray border underneath. */
export function TriggerBorderWipe({ activationGen, durationMs }: TriggerBorderWipeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!size) return <div ref={containerRef} className="pointer-events-none absolute inset-0" />;

  const width = size.width - INSET * 2;
  const height = size.height - INSET * 2;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <svg
        key={activationGen}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${size.width} ${size.height}`}
      >
        <path
          d={topCenterRoundedRectPath(width, height, RADIUS)}
          transform={`translate(${INSET} ${INSET})`}
          fill="none"
          stroke={STROKE}
          strokeWidth={STROKE_WIDTH}
          pathLength={1}
          strokeDasharray="1 1"
          style={{ animation: `borderWipe ${durationMs}ms linear forwards` }}
        />
      </svg>
    </div>
  );
}
