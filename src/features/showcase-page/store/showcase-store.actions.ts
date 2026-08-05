import type { ClipKey, ClipTrigger } from "../showcase-page.types";
import { nextAutoAction } from "../utils/autoplay";
import { bayIndexForClip } from "../utils/bay";
import { fireClip, markReady, settleClip, startCycle } from "../utils/clips";
import { durationFor } from "../utils/duration";
import { isLegal, legalTriggerFor } from "../utils/legality";
import type {
  FireSource,
  ShowcaseActions,
  ShowcaseStore,
} from "./showcase-store";
import {
  clearSettleTimers,
  emitTrigger,
  nextBlockedGen,
  scheduleSettle,
  setEmitter,
} from "./showcase-runtime";

export { clearSettleTimers, setEmitter };

type Set = (fn: (state: ShowcaseStore) => Partial<ShowcaseStore>) => void;
type Get = () => ShowcaseStore;

export function createActions(set: Set, get: Get): ShowcaseActions {
  /** Play it for real, hold the clip busy for exactly as long as it runs. */
  function play(clip: ClipKey, trigger: ClipTrigger): void {
    emitTrigger(clip, trigger);
    scheduleSettle(clip, durationFor(clip, trigger), () => {
      set((state) => ({ clips: settleClip(state.clips, clip) }));
    });
  }

  return {
    fire(clip, trigger, source: FireSource) {
      const state = get();

      // Touching any trigger means the visitor is driving from now on.
      const modePatch =
        source === "user" && state.mode === "auto"
          ? { mode: "manual" as const, focus: null }
          : {};

      if (!isLegal(clip, trigger, state.clips[clip])) {
        set(() => ({
          ...modePatch,
          blocked: {
            clip,
            illegalTrigger: trigger,
            legalTrigger: legalTriggerFor(clip, state.clips[clip]),
            gen: nextBlockedGen(),
          },
        }));
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(40);
        }
        return;
      }

      set((current) => ({
        ...modePatch,
        clips: fireClip(current.clips, clip, trigger),
        activationGen: current.activationGen + 1,
        ...(source === "auto" ? { focus: bayIndexForClip(clip) } : {}),
      }));

      play(clip, trigger);
    },

    resetAll(clips) {
      set((current) => ({
        clips: clips.reduce(
          (acc, clip) => fireClip(acc, clip, "finish"),
          current.clips
        ),
        activationGen: current.activationGen + 1,
        focus: null,
      }));

      for (const clip of clips) play(clip, "finish");
    },

    startNewCycle() {
      set((current) => ({ clips: startCycle(current.clips) }));
    },

    notifyReady(clip) {
      set((current) => ({ clips: markReady(current.clips, clip) }));
    },

    pause() {
      set(() => ({ mode: "manual", focus: null }));
    },

    resume() {
      const { clips } = get();
      const action = nextAutoAction(clips);
      const focus =
        action.kind === "fire" ? bayIndexForClip(action.clip) : null;
      set(() => ({ mode: "auto", focus }));
    },
  };
}
