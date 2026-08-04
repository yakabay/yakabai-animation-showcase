import {
  CLIP_KEYS,
  type ClipKey,
  type ClipState,
  type ClipTrigger,
} from "../showcase-page.types";
import { advance } from "./sequence";

export type Clips = Record<ClipKey, ClipState>;

export function initialClips(): Clips {
  return CLIP_KEYS.reduce((acc, clip) => {
    acc[clip] = { step: 0, playing: null, ready: false, cycleDone: false };
    return acc;
  }, {} as Clips);
}

/** Mid-animation — nothing may fire into it, not the loop and not a click. */
export function isBusy(state: ClipState): boolean {
  return state.playing !== null;
}

function patch(clips: Clips, clip: ClipKey, next: Partial<ClipState>): Clips {
  return { ...clips, [clip]: { ...clips[clip], ...next } };
}

/**
 * Records that `clip` just fired `trigger`: pointer moves on, clip goes busy.
 * Only this clip changes — that isolation is what stops one bay's click from
 * disturbing another bay's animation.
 */
export function fireClip(
  clips: Clips,
  clip: ClipKey,
  trigger: ClipTrigger
): Clips {
  const finishing = trigger === "finish";
  return patch(clips, clip, {
    step: finishing ? 0 : advance(clip, clips[clip].step),
    playing: trigger,
    cycleDone: finishing,
  });
}

/** The fired trigger finished playing. */
export function settleClip(clips: Clips, clip: ClipKey): Clips {
  return patch(clips, clip, { playing: null });
}

export function markReady(clips: Clips, clip: ClipKey): Clips {
  return patch(clips, clip, { ready: true });
}

/** Everyone owes a fresh run through their sequence. */
export function startCycle(clips: Clips): Clips {
  return CLIP_KEYS.reduce(
    (acc, clip) => patch(acc, clip, { cycleDone: false }),
    clips
  );
}
