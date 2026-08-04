import { type ReactNode } from "react";

import { BAY_TINT_TRANSITION_MS } from "../showcase-page.data";
import type { ClipKey, ClipTrigger } from "../showcase-page.types";
import { useShowcaseStore } from "../store/showcase-store";
import {
  selectBlocked,
  selectClip,
  selectTint,
} from "../store/showcase-store.selectors";
import { litTriggerFor } from "../utils/bay";
import { TriggerButton } from "./TriggerButton";

interface ClipBayProps {
  clip: ClipKey;
  fileLabel: string;
  sizeLabel: string;
  description: string;
  triggers: Array<{ label: string; trigger: ClipTrigger }>;
  borderClassName: string;
  children: ReactNode;
}

export function ClipBay({
  clip,
  fileLabel,
  sizeLabel,
  description,
  triggers,
  borderClassName,
  children,
}: ClipBayProps) {
  // Subscribing per clip means a bay only re-renders for its own animation.
  const state = useShowcaseStore(selectClip(clip));
  const tint = useShowcaseStore(selectTint(clip));
  const blocked = useShowcaseStore(selectBlocked);
  const fire = useShowcaseStore((store) => store.fire);

  const litTrigger = litTriggerFor(state);
  const isBlockedTarget = blocked?.clip === clip;

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
        {triggers.map(({ label, trigger }) => (
          <TriggerButton
            key={label}
            clip={clip}
            trigger={trigger}
            label={label}
            lit={litTrigger === trigger}
            shaking={isBlockedTarget && blocked.illegalTrigger === trigger}
            popping={isBlockedTarget && blocked.legalTrigger === trigger}
            blockedGen={blocked?.gen}
            onFire={() => fire(clip, trigger, "user")}
          />
        ))}
      </div>
    </div>
  );
}
