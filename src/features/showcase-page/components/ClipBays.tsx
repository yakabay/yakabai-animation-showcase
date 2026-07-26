import type { RefObject } from "react";

import {
  BAY_COPY,
  CLIP_BOX_CLASSNAME,
  type ClipKey,
  type ClipTrigger,
} from "../showcase-page.data";
import { ClipBay } from "./ClipBay";
import { CardClip, type CardClipRef } from "./clips/CardClip";
import { CourtClip, type CourtClipRef } from "./clips/CourtClip";
import { CupClip, type CupClipRef } from "./clips/CupClip";

interface ClipBaysProps {
  phase: number;
  courtRef: RefObject<CourtClipRef | null>;
  cardRef: RefObject<CardClipRef | null>;
  cupRef: RefObject<CupClipRef | null>;
  onFire: (key: ClipKey, trigger: ClipTrigger) => void;
}

export function ClipBays({ phase, courtRef, cardRef, cupRef, onFire }: ClipBaysProps) {
  const active: Record<ClipKey, boolean> = {
    court: phase >= 0 && phase <= 1,
    card: phase === 2,
    cup: phase >= 3 && phase <= 4,
  };

  const dividerClassName = "border-b border-[#1e2228] sm:border-r sm:border-b-0";

  return (
    <div className="grid grid-cols-1 border-t border-[#1e2228] sm:grid-cols-3">
      <ClipBay
        {...BAY_COPY.court}
        active={active.court}
        borderClassName={dividerClassName}
        onFire={(trigger) => onFire("court", trigger)}
      >
        <div className={CLIP_BOX_CLASSNAME.court}>
          <CourtClip ref={courtRef} />
        </div>
      </ClipBay>

      <ClipBay
        {...BAY_COPY.card}
        active={active.card}
        borderClassName={dividerClassName}
        onFire={(trigger) => onFire("card", trigger)}
      >
        <div className={CLIP_BOX_CLASSNAME.card}>
          <CardClip ref={cardRef} />
        </div>
      </ClipBay>

      <ClipBay
        {...BAY_COPY.cup}
        active={active.cup}
        borderClassName=""
        onFire={(trigger) => onFire("cup", trigger)}
      >
        <div className={CLIP_BOX_CLASSNAME.cup}>
          <CupClip ref={cupRef} />
        </div>
      </ClipBay>
    </div>
  );
}
