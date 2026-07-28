import { useRef } from "react";

import { BuildDecisions } from "./components/BuildDecisions";
import { ClipBays } from "./components/ClipBays";
import type { CardClipRef } from "./components/clips/CardClip";
import type { CourtClipRef } from "./components/clips/CourtClip";
import type { CupClipRef } from "./components/clips/CupClip";
import { HeaderBar } from "./components/HeaderBar";
import { Hero } from "./components/Hero";
import { InsideTheFile } from "./components/InsideTheFile";
import { SiteFooter } from "./components/SiteFooter";
import { usePageVisible } from "./hooks/usePageVisible";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useShowcaseLoop } from "./hooks/useShowcaseLoop";

export function ShowcasePage() {
  const courtRef = useRef<CourtClipRef>(null);
  const cardRef = useRef<CardClipRef>(null);
  const cupRef = useRef<CupClipRef>(null);

  const isPageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();

  const {
    driving,
    bayFocus,
    stepState,
    requestTrigger,
    notifyClipReady,
    notifyClipSignal,
    pause,
    resume,
  } = useShowcaseLoop({
    courtRef,
    cardRef,
    cupRef,
    enabled: isPageVisible,
    reducedMotion,
  });

  return (
    <div className="min-h-dvh bg-[#08090b] font-mono text-[#e6e8ea]">
      <HeaderBar />
      <Hero driving={driving} onPause={pause} onResume={resume} />
      <ClipBays
        bayFocus={bayFocus}
        stepState={stepState}
        courtRef={courtRef}
        cardRef={cardRef}
        cupRef={cupRef}
        onFire={requestTrigger}
        onClipReady={notifyClipReady}
        onClipSignal={notifyClipSignal}
      />
      <div className="grid grid-cols-1 border-t border-[#1e2228] sm:grid-cols-2">
        <BuildDecisions />
        <InsideTheFile />
      </div>
      <SiteFooter />
    </div>
  );
}
