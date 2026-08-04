import { useEffect, useRef, useState } from "react";

import { BLOCKED_SHAKE_MS, LEGAL_POP_MS } from "../showcase-page.data";
import type { ClipKey, ClipTrigger } from "../showcase-page.types";
import { wipeDurationMs } from "../showcase-page.utils";
import { TriggerBorderWipe } from "./TriggerBorderWipe";

interface TriggerButtonProps {
  clip: ClipKey;
  trigger: ClipTrigger;
  label: string;
  /** Derived from clip *Playing state. */
  lit: boolean;
  /** Bumped on every trigger fire; restarts the border-wipe animation. */
  activationGen: number;
  shaking: boolean;
  popping: boolean;
  /** Bumped on every blocked click; replays shake/pop without remounting the button. */
  blockedGen?: number;
  onFire: (trigger: ClipTrigger) => void;
}

/** Restarts a CSS animation in place via a reflow, no element remount needed. */
function replayAnimation(el: HTMLElement | null, animation: string) {
  if (!el) return;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = animation;
}

export function TriggerButton({
  clip,
  trigger,
  label,
  lit,
  activationGen,
  shaking,
  popping,
  blockedGen,
  onFire,
}: TriggerButtonProps) {
  const [pressed, setPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (shaking) {
      replayAnimation(
        buttonRef.current,
        `triggerShake ${BLOCKED_SHAKE_MS}ms ease-out`
      );
    } else if (popping) {
      replayAnimation(
        buttonRef.current,
        `triggerPopShadow ${LEGAL_POP_MS}ms ease-out ${BLOCKED_SHAKE_MS}ms`
      );
      replayAnimation(
        labelRef.current,
        `triggerPopText ${LEGAL_POP_MS}ms ease-out ${BLOCKED_SHAKE_MS}ms`
      );
    }
    // Only the blocked-attempt generation should retrigger this — shaking/popping
    // are derived from it and are already current by the time gen changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockedGen]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onClick={() => onFire(trigger)}
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
      <span ref={labelRef} className="relative">
        {label}
      </span>
    </button>
  );
}
