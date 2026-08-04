import { CLIP_KEYS, type ClipKey, type ClipTrigger } from "../showcase-page.types";
import type { Clips } from "./clips";
import { phaseAt } from "./sequence";

export type AutoAction =
  | { kind: "fire"; clip: ClipKey; trigger: ClipTrigger }
  | { kind: "reset"; clips: ClipKey[] }
  | { kind: "cycleComplete" };

/**
 * What autoplay does next, derived purely from where the clips stand — there
 * is no script and no cursor, so a hand-driven clip simply stops being owed
 * anything and the walk skips over it.
 *
 * Readiness and busy-ness are deliberately not consulted here; the ticker
 * holds off on calling this until nothing is mid-animation.
 */
export function nextAutoAction(clips: Clips): AutoAction {
  const owed = CLIP_KEYS.filter((clip) => !clips[clip].cycleDone);

  if (owed.length === 0) return { kind: "cycleComplete" };

  for (const clip of owed) {
    const trigger = phaseAt(clip, clips[clip].step);
    if (trigger !== "finish") return { kind: "fire", clip, trigger };
  }

  return { kind: "reset", clips: owed };
}
