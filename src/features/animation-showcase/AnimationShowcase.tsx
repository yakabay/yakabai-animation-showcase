import { useCallback, useRef, useState } from "react";

import {
  SHOWCASE_LAYOUT,
  SHOWCASE_TITLE,
  STEP_KEYS,
  STEP_TEXT,
  stageHeights,
} from "./animation-showcase.data";
import { BackgroundEffects } from "./components/animations/BackgroundEffects";
import { type CardClipRef } from "./components/animations/CardClip";
import { type CourtClipRef } from "./components/animations/CourtClip";
import { type CupClipRef } from "./components/animations/CupClip";
import { RiveStage } from "./components/animations/RiveStage";
import { SectionTitle } from "./components/ui/SectionTitle";
import { SlideIndicator } from "./components/ui/SlideIndicator";
import { StepCounter, StepDescription } from "./components/ui/StepText";
import { useAutoPlayLoop } from "./hooks/useAutoPlayLoop";
import { useClipBucketSize } from "./hooks/useClipBucketSize";
import { useHorizontalSwipe } from "./hooks/useHorizontalSwipe";
import { usePageVisible } from "./hooks/usePageVisible";

export function AnimationShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const courtRef = useRef<CourtClipRef>(null);
  const cardRef = useRef<CardClipRef>(null);
  const cupRef = useRef<CupClipRef>(null);
  const bucket = useClipBucketSize();
  const isPageVisible = usePageVisible();
  const [manualNavSeq, setManualNavSeq] = useState(0);

  const { setState, currentStep } = useAutoPlayLoop({
    courtRef,
    cardRef,
    cupRef,
    enabled: isPageVisible,
    manualNavTrigger: manualNavSeq,
  });

  const goToStep = useCallback(
    (stepIndex: number) => {
      const total = STEP_KEYS.length;
      const wrapped = ((stepIndex % total) + total) % total;
      const stepToState = [0, 1, 3];
      setManualNavSeq((n) => n + 1);
      setState(stepToState[wrapped] ?? 0);
    },
    [setState]
  );

  useHorizontalSwipe({
    ref: sectionRef,
    onNext: () => goToStep(currentStep + 1),
    onPrev: () => goToStep(currentStep - 1),
  });

  const stepText = STEP_TEXT[STEP_KEYS[currentStep]];

  return (
    <section
      id="animation-showcase"
      ref={sectionRef}
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden pb-6 lg:pb-10"
      style={{ touchAction: "pan-y" }}
    >
      <BackgroundEffects />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center">
          <div className={SHOWCASE_LAYOUT.headerMarginBottom}>
            <SectionTitle>{SHOWCASE_TITLE}</SectionTitle>
          </div>

          <div
            key={manualNavSeq}
            className="relative flex w-full items-center justify-center"
            style={{ height: stageHeights[bucket] }}
          >
            <RiveStage
              currentStep={currentStep}
              bucket={bucket}
              courtRef={courtRef}
              cardRef={cardRef}
              cupRef={cupRef}
            />
          </div>

          <div
            className={`relative mx-auto flex w-full items-center justify-center text-center italic ${SHOWCASE_LAYOUT.descriptionMaxWidth} ${SHOWCASE_LAYOUT.descriptionMinHeight} ${SHOWCASE_LAYOUT.descriptionMarginBottom}`}
          >
            <StepDescription descriptionKey={`${currentStep}`}>
              {stepText}
            </StepDescription>
          </div>
        </div>

        <SlideIndicator
          total={STEP_KEYS.length}
          current={currentStep}
          onSelect={goToStep}
        />

        <StepCounter current={currentStep + 1} total={STEP_KEYS.length} />
      </div>
    </section>
  );
}
