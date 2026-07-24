import type { RefObject } from "react";

import { clipSizes, type ClipSizeBucket } from "../../animation-showcase.data";
import { CardClip, type CardClipRef } from "./CardClip";
import { CourtClip, type CourtClipRef } from "./CourtClip";
import { CupClip, type CupClipRef } from "./CupClip";
import { StageGlow } from "./StageGlow";

interface RiveStageProps {
  currentStep: number;
  bucket: ClipSizeBucket;
  courtRef: RefObject<CourtClipRef | null>;
  cardRef: RefObject<CardClipRef | null>;
  cupRef: RefObject<CupClipRef | null>;
}

export function RiveStage({
  currentStep,
  bucket,
  courtRef,
  cardRef,
  cupRef,
}: RiveStageProps) {
  const courtSize = clipSizes.court[bucket];
  const cardSize = clipSizes.card[bucket];
  const cupSize = clipSizes.cup[bucket];

  return (
    <>
      <StageGlow />
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          aria-hidden={currentStep !== 0}
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            currentStep === 0
              ? "pointer-events-auto opacity-100 delay-[120ms] duration-[220ms]"
              : "pointer-events-none opacity-0 delay-0 duration-[120ms]"
          }`}
        >
          <CourtClip
            ref={courtRef}
            width={courtSize.width}
            height={courtSize.height}
          />
        </div>

        <div
          aria-hidden={currentStep !== 1}
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            currentStep === 1
              ? "pointer-events-auto opacity-100 delay-[120ms] duration-[220ms]"
              : "pointer-events-none opacity-0 delay-0 duration-[120ms]"
          }`}
        >
          <CardClip
            ref={cardRef}
            width={cardSize.width}
            height={cardSize.height}
          />
        </div>

        <div
          aria-hidden={currentStep !== 2}
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            currentStep === 2
              ? "pointer-events-auto opacity-100 delay-[120ms] duration-[220ms]"
              : "pointer-events-none opacity-0 delay-0 duration-[120ms]"
          }`}
        >
          <CupClip ref={cupRef} width={cupSize.width} height={cupSize.height} />
        </div>
      </div>
    </>
  );
}
