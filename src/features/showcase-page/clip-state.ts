import {
  CLICK_TO_STEP,
  CLIP_KEYS,
  STEP_BAY_FOCUS,
  STEP_BEATS,
  STEP_DURATION_MS,
  makeStepState,
  type ClipKey,
  type ClipTrigger,
  type StepState,
  type StoryStep,
} from "./showcase-page.data";

/** Next cup trigger allowed by its in-clip sequence. */
export type CupPhase = "scene1" | "scene2" | "finish";

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

export function createInitialClipReady(): Record<ClipKey, boolean> {
  return { court: false, card: false, cup: false };
}

export function allClipsReady(ready: Record<ClipKey, boolean>): boolean {
  return CLIP_KEYS.every((key) => ready[key]);
}

/**
 * Legal click is per-clip. No busy/running lock in manual mode.
 * Cup alone enforces scene1 → scene2 → finish.
 */
export function isTriggerLegal(
  clip: ClipKey,
  trigger: ClipTrigger,
  cupPhase: CupPhase
): boolean {
  if (!CLICK_TO_STEP[clip][trigger]) return false;
  if (clip === "cup") return trigger === cupPhase;
  return true;
}

/** Advance cup sequence after a successful cup (or reset) fire. */
export function cupPhaseAfterTrigger(trigger: ClipTrigger): CupPhase {
  if (trigger === "scene1") return "scene2";
  if (trigger === "scene2") return "finish";
  return "scene1";
}

export function cupPhaseForStep(step: StoryStep): CupPhase | null {
  if (step === "cupScene1") return cupPhaseAfterTrigger("scene1");
  if (step === "cupScene2") return cupPhaseAfterTrigger("scene2");
  if (step === "reset") return cupPhaseAfterTrigger("finish");
  return null;
}

/**
 * Which trigger is lit on a bay.
 * Manual single-clip reset lights only that bay’s finish; otherwise from story.
 */
export function litTriggerForClip(
  state: StepState,
  clip: ClipKey,
  manualResetClip?: ClipKey | null
): ClipTrigger | undefined {
  if (manualResetClip) {
    return clip === manualResetClip ? "finish" : undefined;
  }
  if (!isStepRunning(state)) return undefined;
  const beat = beatsFor(state.step).find((b) => b.clip === clip);
  return beat?.trigger;
}

export function bayIndexForClip(clip: ClipKey): number {
  if (clip === "court") return 0;
  if (clip === "card") return 1;
  return 2;
}

export function bayFocusForStep(state: StepState): number {
  return STEP_BAY_FOCUS[state.step];
}

/** Soft weight for bay tint: 1 at focus, falls off across neighbors. */
export function bayTintWeight(clipIndex: number, focus: number): number {
  if (focus < 0) return 0;
  return Math.max(0, 1 - Math.abs(clipIndex - focus));
}

export function settledState(step: StoryStep): StepState {
  return makeStepState(step, false);
}

export function runningState(step: StoryStep): StepState {
  return makeStepState(step, true);
}
