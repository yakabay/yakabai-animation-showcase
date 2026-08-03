export const CLIP_KEYS = ["court", "card", "cup"] as const;
export type ClipKey = (typeof CLIP_KEYS)[number];
export type ClipTrigger = "scene1" | "scene2" | "finish";

/** Ordered story beats — source of truth for transitions. */
export const STORY_STEPS = [
  "boot",
  "courtScene1",
  "cardScene1",
  "cardScene2",
  "cupScene1",
  "cupScene2",
  "reset",
] as const;

export type StoryStep = (typeof STORY_STEPS)[number];

/** Story cursor. `running: true` = in progress; `false` = settled. */
export type StepState = { step: StoryStep; running: boolean };

export interface StepBeat {
  clip: ClipKey;
  trigger: ClipTrigger;
}

/** An illegal click: which button was tapped vs. which one is actually actionable. */
export interface BlockedAttempt {
  clip: ClipKey;
  illegalTrigger: ClipTrigger;
  legalTrigger: ClipTrigger;
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

