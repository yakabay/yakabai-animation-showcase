import { type ReactNode, useState } from "react";

import { BAY_TINT_TRANSITION_MS } from "../showcase-page.data";
import type { ClipTrigger } from "../showcase-page.types";

interface ClipBayProps {
  fileLabel: string;
  sizeLabel: string;
  description: string;
  triggers: Array<{ label: string; trigger: ClipTrigger }>;
  /** 0–1 soft wash strength; crossfades as autoplay focus moves. */
  tint: number;
  /** Derived from clip *Playing state. */
  litTrigger?: ClipTrigger;
  borderClassName: string;
  onFire: (trigger: ClipTrigger) => void;
  children: ReactNode;
}

export function ClipBay({
  fileLabel,
  sizeLabel,
  description,
  triggers,
  tint,
  litTrigger,
  borderClassName,
  onFire,
  children,
}: ClipBayProps) {
  const [pressing, setPressing] = useState<ClipTrigger | null>(null);

  const clearPress = () => setPressing(null);

  return (
    <div
      className={`flex min-w-0 flex-col gap-5 px-5 py-6 sm:px-8 sm:py-8 ${borderClassName}`}
      style={{
        backgroundColor: `rgb(34 211 238 / ${0.045 * tint})`,
        transition: `background-color ${BAY_TINT_TRANSITION_MS}ms ease`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[0.16em] text-[#9aa2ad] uppercase">{fileLabel}</span>
        <span className="text-[11px] tracking-[0.1em] text-[#565d66]">{sizeLabel}</span>
      </div>

      <div className="flex h-[180px] items-center justify-center sm:h-[220px] lg:h-[270px]">
        {children}
      </div>

      <div className="min-h-[72px] font-sans text-sm leading-[1.55] text-[#8f97a1]">
        {description}
      </div>

      <div className="flex flex-wrap gap-2">
        {triggers.map(({ label, trigger }) => {
          const lit = litTrigger === trigger;
          const pressed = pressing === trigger;
          return (
            <button
              key={label}
              type="button"
              onPointerDown={() => {
                setPressing(trigger);
              }}
              onPointerUp={clearPress}
              onPointerLeave={clearPress}
              onPointerCancel={clearPress}
              onClick={() => {
                onFire(trigger);
              }}
              className={[
                "cursor-pointer rounded-[5px] border px-[13px] py-2 font-mono text-xs tracking-[0.06em] select-none touch-manipulation transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out",
                lit
                  ? "border-[#22d3ee] bg-[#101318] text-[#22d3ee]"
                  : "border-[#2a3038] bg-[#101318] text-[#c6cdd6] hover:border-[#22d3ee] hover:text-[#22d3ee]",
                pressed
                  ? "scale-[0.97] translate-y-px border-[#22d3ee] bg-[#0a0e14] text-[#22d3ee] shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)]"
                  : "",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
