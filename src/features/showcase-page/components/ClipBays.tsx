import type { RefObject } from "react";

import {
  bayTintWeight,
  litTriggerForClip,
} from "../clip-state";
import {
  BAY_COPY,
  CLIP_BOX_CLASSNAME,
  type ClipKey,
  type ClipTrigger,
  type StepState,
} from "../showcase-page.data";
import { ClipBay } from "./ClipBay";
import { CardClip, type CardClipRef } from "./clips/CardClip";
import { CourtClip, type CourtClipRef } from "./clips/CourtClip";
import { CupClip, type CupClipRef } from "./clips/CupClip";

const BAY_INDEX = { court: 0, card: 1, cup: 2 } as const;

interface ClipBaysProps {
  bayFocus: number;
  stepState: StepState;
  manualResetClip: ClipKey | null;
  courtRef: RefObject<CourtClipRef | null>;
  cardRef: RefObject<CardClipRef | null>;
  cupRef: RefObject<CupClipRef | null>;
  onFire: (key: ClipKey, trigger: ClipTrigger) => void;
  onClipReady: (key: ClipKey) => void;
  onClipSignal: (key: ClipKey, signal: string) => void;
}

export function ClipBays({
  bayFocus,
  stepState,
  manualResetClip,
  courtRef,
  cardRef,
  cupRef,
  onFire,
  onClipReady,
  onClipSignal,
}: ClipBaysProps) {
  const dividerClassName = "border-b border-[#1e2228] sm:border-r sm:border-b-0";

  return (
    <div className="grid grid-cols-1 border-t border-[#1e2228] sm:grid-cols-3">
      <ClipBay
        {...BAY_COPY.court}
        tint={bayTintWeight(BAY_INDEX.court, bayFocus)}
        litTrigger={litTriggerForClip(stepState, "court", manualResetClip)}
        borderClassName={dividerClassName}
        onFire={(trigger) => onFire("court", trigger)}
      >
        <div className={CLIP_BOX_CLASSNAME.court}>
          <CourtClip ref={courtRef} onReady={() => onClipReady("court")} />
        </div>
      </ClipBay>

      <ClipBay
        {...BAY_COPY.card}
        tint={bayTintWeight(BAY_INDEX.card, bayFocus)}
        litTrigger={litTriggerForClip(stepState, "card", manualResetClip)}
        borderClassName={dividerClassName}
        onFire={(trigger) => onFire("card", trigger)}
      >
        <div className={CLIP_BOX_CLASSNAME.card}>
          <CardClip ref={cardRef} onReady={() => onClipReady("card")} />
        </div>
      </ClipBay>

      <ClipBay
        {...BAY_COPY.cup}
        tint={bayTintWeight(BAY_INDEX.cup, bayFocus)}
        litTrigger={litTriggerForClip(stepState, "cup", manualResetClip)}
        borderClassName=""
        onFire={(trigger) => onFire("cup", trigger)}
      >
        <div className={CLIP_BOX_CLASSNAME.cup}>
          <CupClip
            ref={cupRef}
            onReady={() => onClipReady("cup")}
            onSignal={(signal) => onClipSignal("cup", signal)}
          />
        </div>
      </ClipBay>
    </div>
  );
}
