import { useCallback, useRef, useState } from "react";

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
import type { ClipKey } from "./showcase-page.data";

export function ShowcasePage() {
  const courtRef = useRef<CourtClipRef>(null);
  const cardRef = useRef<CardClipRef>(null);
  const cupRef = useRef<CupClipRef>(null);

  const isPageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();

  const [nonce, setNonce] = useState<Record<ClipKey, number>>({
    court: 0,
    card: 0,
    cup: 0,
  });

  const remountClips = useCallback((keys: ClipKey[]) => {
    setNonce((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        next[key] = prev[key] + 1;
      });
      return next;
    });
  }, []);

  const { phase, driving, fireManual, goToPhase, notifyClipReady, pause, resume } =
    useShowcaseLoop({
      courtRef,
      cardRef,
      cupRef,
      enabled: isPageVisible,
      reducedMotion,
      onRemount: remountClips,
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
        nonce={nonce}
        onFire={fireManual}
        onClipReady={notifyClipReady}
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
