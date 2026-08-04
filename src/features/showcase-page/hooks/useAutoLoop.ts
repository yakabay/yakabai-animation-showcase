import { useEffect } from "react";

import { CYCLE_PAUSE_MS, STEP_PAUSE_MS } from "../showcase-page.data";
import { clearSettleTimers } from "../store/showcase-store.actions";
import { useShowcaseStore } from "../store/showcase-store";
import { allReady, anyBusy } from "../store/showcase-store.selectors";
import { nextAutoAction } from "../utils/autoplay";

/**
 * Drives autoplay. Owns nothing but a single timeout: every time the clips
 * change it re-asks what should happen next, so pausing, resuming, a clip
 * still playing, or the tab going away are all handled by simply not
 * scheduling — no generation counters, no cancellation bookkeeping.
 *
 * `enabled` is the page-visibility gate: a hidden tab never advances, not even
 * for its first beat.
 */
export function useAutoLoop(enabled: boolean): void {
  const clips = useShowcaseStore((state) => state.clips);
  const mode = useShowcaseStore((state) => state.mode);
  const fire = useShowcaseStore((state) => state.fire);
  const resetAll = useShowcaseStore((state) => state.resetAll);
  const startNewCycle = useShowcaseStore((state) => state.startNewCycle);

  useEffect(() => {
    if (!enabled || mode !== "auto") return;
    // Never interrupt a clip — the loop waits it out, same as a visitor must.
    if (!allReady(clips) || anyBusy(clips)) return;

    const action = nextAutoAction(clips);
    const delay =
      action.kind === "cycleComplete" ? CYCLE_PAUSE_MS : STEP_PAUSE_MS;

    const timer = setTimeout(() => {
      if (action.kind === "fire") {
        fire(action.clip, action.trigger, "auto");
      } else if (action.kind === "reset") {
        resetAll(action.clips);
      } else {
        startNewCycle();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [enabled, mode, clips, fire, resetAll, startNewCycle]);

  useEffect(() => clearSettleTimers, []);
}
