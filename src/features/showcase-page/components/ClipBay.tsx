import { type ReactNode, useState } from "react";

import { BAY_TINT_TRANSITION_MS } from "../showcase-page.data";
import type { ClipKey, ClipTrigger } from "../showcase-page.types";
import { wipeDurationMs } from "../showcase-page.utils";
import { TriggerBorderWipe } from "./TriggerBorderWipe";

interface ClipBayProps {
  clip: ClipKey;
  fileLabel: string;
  sizeLabel: string;
  description: string;
  triggers: Array<{ label: string; trigger: ClipTrigger }>;
  /** 0–1 soft wash strength; crossfades as autoplay focus moves. */
  tint: number;
  /** Derived from clip *Playing state. */
  litTrigger?: ClipTrigger;
  /** Bumped on every trigger fire; restarts the border-wipe animation. */
  activationGen: number;
  borderClassName: string;
  onFire: (trigger: ClipTrigger) => void;
  children: ReactNode;
}

export function ClipBay({
  clip,
  fileLabel,
  sizeLabel,
  description,
  triggers,
  tint,
  litTrigger,
  activationGen,
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
                "relative cursor-pointer rounded-[5px] border border-[#2a3038] bg-[#101318] px-[13px] py-2 font-mono text-xs tracking-[0.06em] select-none touch-manipulation transition-[transform,box-shadow,background-color] duration-150 ease-out",
                lit ? "text-[#22d3ee]" : "text-[#c6cdd6] hover:bg-[#171b23]",
                pressed
                  ? "scale-[0.97] translate-y-px bg-[#0d1016] shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)]"
                  : "",
              ].join(" ")}
            >
              {lit && (
                <TriggerBorderWipe
                  activationGen={activationGen}
                  durationMs={wipeDurationMs(clip, trigger)}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
