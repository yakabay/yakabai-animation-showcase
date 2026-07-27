import { useRef } from "react";

import { BuildDecisions } from "./components/BuildDecisions";
import { ClipBays } from "./components/ClipBays";
import type { CardClipRef } from "./components/clips/CardClip";
import type { CourtClipRef } from "./components/clips/CourtClip";
import type { CupClipRef } from "./components/clips/CupClip";
import { DrivingLoop } from "./components/DrivingLoop";
import { HeaderBar } from "./components/HeaderBar";
import { Hero } from "./components/Hero";
import { InsideTheFile } from "./components/InsideTheFile";
import { SiteFooter } from "./components/SiteFooter";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { usePageVisible } from "./hooks/usePageVisible";
import { useShowcaseLoop } from "./hooks/useShowcaseLoop";

export function ShowcasePage() {
  const courtRef = useRef<CourtClipRef>(null);
  const cardRef = useRef<CardClipRef>(null);
  const cupRef = useRef<CupClipRef>(null);

  const isPageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();

  const { phase, driving, fireManual, goToPhase, pause, resume } = useShowcaseLoop({
    courtRef,
    cardRef,
    cupRef,
    enabled: isPageVisible,
    reducedMotion,
  });

  return (
    <div className="min-h-dvh bg-[#08090b] font-mono text-[#e6e8ea]">
      <HeaderBar />
      <Hero />
      <ClipBays
        phase={phase}
        courtRef={courtRef}
        cardRef={cardRef}
        cupRef={cupRef}
        onFire={fireManual}
      />
      <DrivingLoop
        phase={phase}
        driving={driving}
        onJump={goToPhase}
        onPause={pause}
        onResume={resume}
      />
      <div className="grid grid-cols-1 border-t border-[#1e2228] sm:grid-cols-2">
        <BuildDecisions />
        <InsideTheFile />
      </div>
      <SiteFooter />
    </div>
  );
}
