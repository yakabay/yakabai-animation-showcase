import type { ClipKey, ClipTrigger } from "../showcase-page.types";
import { bayIndexForClip } from "../utils/bay";
import { fireClip, markReady, settleClip, startCycle } from "../utils/clips";
import { durationFor } from "../utils/duration";
import { isLegal, legalTriggerFor } from "../utils/legality";
import type {
  FireSource,
  ShowcaseActions,
  ShowcaseStore,
} from "./showcase-store";

type Set = (fn: (state: ShowcaseStore) => Partial<ShowcaseStore>) => void;
type Get = () => ShowcaseStore;

/**
 * Rive handles live outside the store — they are imperative and must not
 * trigger renders. Registered once by ShowcasePage.
 */
type Emitter = (clip: ClipKey, trigger: ClipTrigger) => void;
let emit: Emitter | null = null;

const settleTimers = new Map<ClipKey, ReturnType<typeof setTimeout>>();

export function setEmitter(next: Emitter | null): void {
  emit = next;
}

/** Drop every pending settle — used when the page unmounts. */
export function clearSettleTimers(): void {
  for (const timer of settleTimers.values()) clearTimeout(timer);
  settleTimers.clear();
}

let blockedGen = 0;

export function createActions(set: Set, get: Get): ShowcaseActions {
  /** Play it for real, hold the clip busy for exactly as long as it runs. */
  function play(clip: ClipKey, trigger: ClipTrigger): void {
    emit?.(clip, trigger);

    const existing = settleTimers.get(clip);
    if (existing) clearTimeout(existing);

    settleTimers.set(
      clip,
      setTimeout(() => {
        settleTimers.delete(clip);
        set((state) => ({ clips: settleClip(state.clips, clip) }));
      }, durationFor(clip, trigger))
    );
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
            gen: ++blockedGen,
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
      set(() => ({ mode: "auto" }));
    },
  };
}
