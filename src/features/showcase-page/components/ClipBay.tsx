import { type ReactNode } from "react";

import { BAY_TINT_TRANSITION_MS } from "../showcase-page.data";
import type {
  BlockedAttempt,
  ClipKey,
  ClipTrigger,
} from "../showcase-page.types";
import { TriggerButton } from "./TriggerButton";

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
  /** Set when the user just tapped a currently-illegal trigger on any bay. */
  blockedAttempt: BlockedAttempt | null;
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
  blockedAttempt,
  borderClassName,
  onFire,
  children,
}: ClipBayProps) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-5 px-5 py-6 sm:px-8 sm:py-8 ${borderClassName}`}
      style={{
        backgroundColor: `rgb(34 211 238 / ${0.045 * tint})`,
        transition: `background-color ${BAY_TINT_TRANSITION_MS}ms ease`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[0.16em] text-[#9aa2ad] uppercase">
          {fileLabel}
        </span>
        <span className="text-[11px] tracking-[0.1em] text-[#565d66]">
          {sizeLabel}
        </span>
      </div>

      <div className="flex h-[180px] items-center justify-center sm:h-[220px] lg:h-[270px]">
        {children}
      </div>

      <div className="min-h-[72px] font-sans text-sm leading-[1.55] text-[#8f97a1]">
        {description}
      </div>

      <div className="flex flex-wrap gap-2">
        {triggers.map(({ label, trigger }) => {
          const isBlockedTarget = blockedAttempt?.clip === clip;
          return (
            <TriggerButton
              key={label}
              clip={clip}
              trigger={trigger}
              label={label}
              lit={litTrigger === trigger}
              activationGen={activationGen}
              shaking={isBlockedTarget && blockedAttempt.illegalTrigger === trigger}
              popping={isBlockedTarget && blockedAttempt.legalTrigger === trigger}
              blockedGen={blockedAttempt?.gen}
              onFire={onFire}
            />
          );
        })}
      </div>
    </div>
  );
}
