import { useEffect, useRef } from "react";

import { BuildDecisions } from "./components/BuildDecisions";
import { ClipBays } from "./components/ClipBays";
import { ClipBaysStage } from "./components/ClipBaysStage";
import type { CardClipRef } from "./components/clips/CardClip";
import type { CourtClipRef } from "./components/clips/CourtClip";
import type { CupClipRef } from "./components/clips/CupClip";
import { HeaderBar } from "./components/HeaderBar";
import { Hero } from "./components/Hero";
import { InsideTheFile } from "./components/InsideTheFile";
import { SiteFooter } from "./components/SiteFooter";
import { useAutoLoop } from "./hooks/useAutoLoop";
import { usePageVisible } from "./hooks/usePageVisible";
import { setEmitter } from "./store/showcase-store.actions";

export function ShowcasePage() {
  const courtRef = useRef<CourtClipRef>(null);
  const cardRef = useRef<CardClipRef>(null);
  const cupRef = useRef<CupClipRef>(null);

  // The store decides what should play; these refs are how it actually plays.
  useEffect(() => {
    const refs = { court: courtRef, card: cardRef, cup: cupRef };
    setEmitter((clip, trigger) => refs[clip].current?.fire(trigger));
    return () => setEmitter(null);
  }, []);

  useAutoLoop(usePageVisible());

  return (
    <div className="min-h-dvh bg-[#08090b] font-mono text-[#e6e8ea]">
      <HeaderBar />
      <Hero />
      <ClipBaysStage>
        <ClipBays courtRef={courtRef} cardRef={cardRef} cupRef={cupRef} />
      </ClipBaysStage>
      <div className="grid grid-cols-1 border-t border-[#1e2228] sm:grid-cols-2">
        <BuildDecisions />
        <InsideTheFile />
      </div>
      <SiteFooter />
    </div>
  );
}
