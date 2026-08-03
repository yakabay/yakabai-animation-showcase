import { beatsFor } from "./hooks/useShowcaseLoop.utils";
import { SCENE_TO_STEP, STEP_DURATION_MS } from "./showcase-page.data";
import {
  STORY_STEPS,
  type ClipKey,
  type ClipTrigger,
  type StepState,
  type StoryStep,
} from "./showcase-page.types";

export function makeStepState(step: StoryStep, running: boolean): StepState {
  return { step, running };
}

export function statesEqual(a: StepState, b: StepState): boolean {
  return a.step === b.step && a.running === b.running;
}

export function nextStoryStep(step: StoryStep): StoryStep {
  const index = STORY_STEPS.indexOf(step);
  return STORY_STEPS[(index + 1) % STORY_STEPS.length];
}

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

/** Border-wipe duration for a bay trigger button — same clock as its actual play time. */
export function wipeDurationMs(clip: ClipKey, trigger: ClipTrigger): number {
  if (trigger === "finish") return STEP_DURATION_MS.reset;
  const step = SCENE_TO_STEP[clip][trigger];
  return step ? STEP_DURATION_MS[step] : STEP_DURATION_MS.reset;
}

/** Soft weight for bay tint: 1 at focus, falls off across neighbors. */
export function bayTintWeight(clipIndex: number, focus: number): number {
  if (focus < 0) return 0;
  return Math.max(0, 1 - Math.abs(clipIndex - focus));
}
