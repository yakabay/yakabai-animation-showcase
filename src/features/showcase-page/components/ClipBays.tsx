import type { RefObject } from "react";

import { BAY_COPY, CLIP_BOX_CLASSNAME } from "../showcase-page.data";
import { useShowcaseStore } from "../store/showcase-store";
import { ClipBay } from "./ClipBay";
import { CardClip, type CardClipRef } from "./clips/CardClip";
import { CourtClip, type CourtClipRef } from "./clips/CourtClip";
import { CupClip, type CupClipRef } from "./clips/CupClip";

interface ClipBaysProps {
  courtRef: RefObject<CourtClipRef | null>;
  cardRef: RefObject<CardClipRef | null>;
  cupRef: RefObject<CupClipRef | null>;
}

const DIVIDER = "border-b border-[#1e2228] sm:border-r sm:border-b-0";

/**
 * Each bay subscribes to its own clip, so the props here are only the Rive
 * refs and the static copy — nothing that changes as the loop runs.
 */
export function ClipBays({ courtRef, cardRef, cupRef }: ClipBaysProps) {
  // Autoplay holds until all three report in, and a click on an unloaded clip
  // is rejected rather than silently swallowed.
  const notifyReady = useShowcaseStore((store) => store.notifyReady);

  return (
    <div className="grid grid-cols-1 border-t border-[#1e2228] sm:grid-cols-3">
      <ClipBay {...BAY_COPY.court} clip="court" borderClassName={DIVIDER}>
        <div className={CLIP_BOX_CLASSNAME.court}>
          <CourtClip ref={courtRef} onReady={() => notifyReady("court")} />
        </div>
      </ClipBay>

      <ClipBay {...BAY_COPY.card} clip="card" borderClassName={DIVIDER}>
        <div className={CLIP_BOX_CLASSNAME.card}>
          <CardClip ref={cardRef} onReady={() => notifyReady("card")} />
        </div>
      </ClipBay>

      <ClipBay {...BAY_COPY.cup} clip="cup" borderClassName="">
        <div className={CLIP_BOX_CLASSNAME.cup}>
          <CupClip ref={cupRef} onReady={() => notifyReady("cup")} />
        </div>
      </ClipBay>
    </div>
  );
}
