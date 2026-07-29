import { beatsFor } from "./hooks/useShowcaseLoop.utils";
import type { ClipKey, ClipTrigger, StepState } from "./showcase-page.types";

export function isStepRunning(state: StepState): boolean {
  return state.running;
}

/**
 * Which trigger is lit on a bay.
 * Manual single-clip reset lights only that bay’s finish; otherwise from story.
 */
export function litTriggerForClip(
  state: StepState,
  clip: ClipKey,
  manualResetClip?: ClipKey | null,
): ClipTrigger | undefined {
  if (manualResetClip) {
    return clip === manualResetClip ? "finish" : undefined;
  }
  if (!isStepRunning(state)) return undefined;
  const beat = beatsFor(state.step).find((b) => b.clip === clip);
  return beat?.trigger;
}

/** Soft weight for bay tint: 1 at focus, falls off across neighbors. */
export function bayTintWeight(clipIndex: number, focus: number): number {
  if (focus < 0) return 0;
  return Math.max(0, 1 - Math.abs(clipIndex - focus));
}
