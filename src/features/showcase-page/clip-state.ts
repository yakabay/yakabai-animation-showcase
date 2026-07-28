import {
  CLICK_TO_STEP,
  CLIP_KEYS,
  STEP_BAY_FOCUS,
  STEP_BEATS,
  STEP_DURATION_MS,
  makeStepState,
  nextStoryStep,
  type ClipKey,
  type ClipTrigger,
  type StepState,
  type StoryStep,
} from "./showcase-page.data";

export function isStepRunning(state: StepState): boolean {
  return state.running;
}

export function isStepSettled(state: StepState): boolean {
  return !state.running;
}

export function durationFor(step: StoryStep): number {
  return STEP_DURATION_MS[step];
}

export function beatsFor(step: StoryStep) {
  return STEP_BEATS[step];
}

/** Bay button is legal only when it requests the next expected step. */
export function isTriggerLegal(
  clip: ClipKey,
  trigger: ClipTrigger,
  state: StepState
): boolean {
  if (!isStepSettled(state)) return false;
  const requested = CLICK_TO_STEP[clip][trigger];
  if (!requested) return false;
  return nextStoryStep(state.step) === requested;
}

/** Which trigger is lit on a bay, derived from the story cursor. */
export function litTriggerForClip(
  state: StepState,
  clip: ClipKey
): ClipTrigger | undefined {
  if (!isStepRunning(state)) return undefined;
  const beat = beatsFor(state.step).find((b) => b.clip === clip);
  return beat?.trigger;
}

export function bayFocusForStep(state: StepState): number {
  return STEP_BAY_FOCUS[state.step];
}

/** Soft weight for bay tint: 1 at focus, falls off across neighbors. */
export function bayTintWeight(clipIndex: number, focus: number): number {
  if (focus < 0) return 0;
  return Math.max(0, 1 - Math.abs(clipIndex - focus));
}

export function createInitialClipReady(): Record<ClipKey, boolean> {
  return { court: false, card: false, cup: false };
}

export function allClipsReady(ready: Record<ClipKey, boolean>): boolean {
  return CLIP_KEYS.every((key) => ready[key]);
}

export function settledState(step: StoryStep): StepState {
  return makeStepState(step, false);
}

export function runningState(step: StoryStep): StepState {
  return makeStepState(step, true);
}
