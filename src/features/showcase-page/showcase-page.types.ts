export const CLIP_KEYS = ["court", "card", "cup"] as const;
export type ClipKey = (typeof CLIP_KEYS)[number];
export type ClipTrigger = "scene1" | "scene2" | "finish";

/**
 * A single clip's whole world. `step` indexes into that clip's SEQUENCE and is
 * the only thing that decides what it will accept next — no global cursor.
 */
export interface ClipState {
  step: number;
  /**
   * The trigger playing right now, or null when idle. Doubles as the "busy"
   * flag and as the lit indicator, so the two can never disagree.
   */
  playing: ClipTrigger | null;
  /** False until the Rive file has loaded and its triggers are bound. */
  ready: boolean;
  /**
   * True once this clip has been reset for the current cycle. Autoplay skips
   * it until the next cycle starts, which is what lets a manual reset drop a
   * clip out of the cycle instead of replaying it.
   */
  cycleDone: boolean;
}

export interface StepBeat {
  clip: ClipKey;
  trigger: ClipTrigger;
}

/** An illegal click: which button was tapped vs. which one is actually actionable. */
export interface BlockedAttempt {
  clip: ClipKey;
  illegalTrigger: ClipTrigger;
  /** Null when the clip is busy or still loading — nothing to point at. */
  legalTrigger: ClipTrigger | null;
  gen: number;
}

export interface BayCopy {
  fileLabel: string;
  sizeLabel: string;
  description: string;
  triggers: Array<{ label: string; trigger: ClipTrigger }>;
}

export interface BuildDecision {
  title: string;
  body: string;
}

