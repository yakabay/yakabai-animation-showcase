import {
  BAY_COPY,
  SCENE_TO_STEP,
  STEP_BAY_FOCUS,
  STEP_BEATS,
  STEP_DURATION_MS,
} from "../showcase-page.data";
import { makeStepState } from "../showcase-page.utils";
import {
  CLIP_KEYS,
  type ClipKey,
  type ClipTrigger,
  type StepState,
  type StoryStep,
} from "../showcase-page.types";

/** Next court trigger allowed by its in-clip sequence. */
export type CourtPhase = "scene1" | "finish";

/** Next cup trigger allowed by its in-clip sequence. */
export type CupPhase = "scene1" | "scene2" | "finish";

export type ClipPhases = {
  court: CourtPhase;
  cup: CupPhase;
};

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

/** True while this clip’s beat is the currently running story step. */
export function clipIsBusy(clip: ClipKey, state: StepState): boolean {
  if (!state.running) return false;
  return beatsFor(state.step).some((beat) => beat.clip === clip);
}

/**
 * Legal click is per-clip. Card: any mapped trigger anytime.
 * Court/cup: in-clip sequence, and blocked while that clip’s step is running.
 */
export function isTriggerLegal(
  clip: ClipKey,
  trigger: ClipTrigger,
  phases: ClipPhases,
  state: StepState
): boolean {
  if (!clipHasTrigger(clip, trigger)) return false;
  if (clip === "court" || clip === "cup") {
    if (clipIsBusy(clip, state)) return false;
  }
  if (clip === "court") return trigger === phases.court;
  if (clip === "cup") return trigger === phases.cup;
  return true;
}

/** Advance court sequence after a successful court (or reset) fire. */
export function courtPhaseAfterTrigger(trigger: ClipTrigger): CourtPhase {
  if (trigger === "scene1") return "finish";
  return "scene1";
}

/** Advance cup sequence after a successful cup (or reset) fire. */
export function cupPhaseAfterTrigger(trigger: ClipTrigger): CupPhase {
  if (trigger === "scene1") return "scene2";
  if (trigger === "scene2") return "finish";
  return "scene1";
}

export function courtPhaseForStep(step: StoryStep): CourtPhase | null {
  if (step === "courtScene1") return courtPhaseAfterTrigger("scene1");
  if (step === "reset") return courtPhaseAfterTrigger("finish");
  return null;
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
