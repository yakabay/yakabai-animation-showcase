import {
  BAY_COPY,
  SCENE_TO_STEP,
  STEP_BAY_FOCUS,
  STEP_BEATS,
  STEP_DURATION_MS,
  makeStepState,
} from "../showcase-page.data";
import {
  CLIP_KEYS,
  type ClipKey,
  type ClipTrigger,
  type StepState,
  type StoryStep,
} from "../showcase-page.types";

/** Next cup trigger allowed by its in-clip sequence. */
export type CupPhase = "scene1" | "scene2" | "finish";

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

function clipHasTrigger(clip: ClipKey, trigger: ClipTrigger): boolean {
  if (trigger === "finish") {
    return BAY_COPY[clip].triggers.some((t) => t.trigger === "finish");
  }
  return SCENE_TO_STEP[clip][trigger] !== undefined;
}

/**
 * Legal click is per-clip. Court/card: any mapped trigger anytime.
 * Cup: cup phase only (scene1 → scene2 → finish).
 */
export function isTriggerLegal(
  clip: ClipKey,
  trigger: ClipTrigger,
  cupPhase: CupPhase
): boolean {
  if (!clipHasTrigger(clip, trigger)) return false;
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

export function bayIndexForClip(clip: ClipKey): number {
  if (clip === "court") return 0;
  if (clip === "card") return 1;
  return 2;
}

export function bayFocusForStep(state: StepState): number {
  return STEP_BAY_FOCUS[state.step];
}

export function settledState(step: StoryStep): StepState {
  return makeStepState(step, false);
}

export function runningState(step: StoryStep): StepState {
  return makeStepState(step, true);
}
