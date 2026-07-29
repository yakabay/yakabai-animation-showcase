import {
  type BayCopy,
  type BuildDecision,
  type ClipKey,
  type ClipTrigger,
  type FileSpecRow,
  type StepBeat,
  type StepState,
  type StoryStep,
} from "./showcase-page.types";

export const BOOT_STATE: StepState = { step: "boot", running: false };

/** Rive fires for each story step (`boot` has none). */
export const STEP_BEATS: Record<StoryStep, StepBeat[]> = {
  boot: [],
  courtScene1: [{ clip: "court", trigger: "scene1" }],
  cardScene1: [{ clip: "card", trigger: "scene1" }],
  cardScene2: [{ clip: "card", trigger: "scene2" }],
  cupScene1: [{ clip: "cup", trigger: "scene1" }],
  cupScene2: [{ clip: "cup", trigger: "scene2" }],
  reset: [
    { clip: "court", trigger: "finish" },
    { clip: "card", trigger: "finish" },
    { clip: "cup", trigger: "finish" },
  ],
};

/**
 * How long each step stays `running: true`.
 * `boot` is the cycle-start pause; reset uses the longest finish duration.
 */
export const STEP_DURATION_MS: Record<StoryStep, number> = {
  boot: 500,
  courtScene1: 2100,
  cardScene1: 1500,
  cardScene2: 900,
  cupScene1: 3300,
  cupScene2: 4300,
  reset: 700,
};

/** Bay scene button → story step (manual reset is separate). */
export const SCENE_TO_STEP: Record<
  ClipKey,
  Partial<Record<Extract<ClipTrigger, "scene1" | "scene2">, StoryStep>>
> = {
  court: { scene1: "courtScene1" },
  card: { scene1: "cardScene1", scene2: "cardScene2" },
  cup: { scene1: "cupScene1", scene2: "cupScene2" },
};

/** Bay-tint lane per story step. `-1` = no tint (reset). */
export const STEP_BAY_FOCUS: Record<StoryStep, number> = {
  boot: 0,
  courtScene1: 0,
  cardScene1: 1,
  cardScene2: 1,
  cupScene1: 2,
  cupScene2: 2,
  reset: -1,
};

/** Hold on reset settled before the next cycle's `boot` step. */
export const CYCLE_TAIL_MS = 400;

/** Soft crossfade duration for the bay tint as focus moves court → card → cup. */
export const BAY_TINT_TRANSITION_MS = 700;

export const BRAND_NAME = "Yaroslav Kabai";
export const BRAND_ROLE = "design engineer";

export const HERO_TITLE = "Interactive onboarding your users won't skip.";
export const HERO_SUBHEAD =
  "Onboarding flow for an on-chain tennis prediction platform. Every scene is a live Rive state machine.";

export const BAY_COPY: Record<ClipKey, BayCopy> = {
  court: {
    fileLabel: "court.riv",
    sizeLabel: "240 × 240",
    description: "Pick an upcoming match and predict the exact score by sets.",
    triggers: [
      { label: "scene1", trigger: "scene1" },
      { label: "reset", trigger: "finish" },
    ],
  },
  card: {
    fileLabel: "card.riv",
    sizeLabel: "280 × 280",
    description:
      "Confirm, and the prediction becomes your on-chain card. The entry fee joins the reward pool.",
    triggers: [
      { label: "scene1", trigger: "scene1" },
      { label: "scene2", trigger: "scene2" },
      { label: "reset", trigger: "finish" },
    ],
  },
  cup: {
    fileLabel: "cup.riv",
    sizeLabel: "320 × 256",
    description:
      "The reward pool is split equally between everyone who called it right.",
    triggers: [
      { label: "scene1", trigger: "scene1" },
      { label: "scene2", trigger: "scene2" },
      { label: "reset", trigger: "finish" },
    ],
  },
};

// Exact pixel boxes per breakpoint (not CSS transform-scale) — matches the
// design's fixed canvas sizes at desktop, scaled down for smaller viewports.
export const CLIP_BOX_CLASSNAME: Record<ClipKey, string> = {
  court:
    "h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] lg:h-[240px] lg:w-[240px]",
  card: "h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] lg:h-[280px] lg:w-[280px]",
  cup: "h-[176px] w-[220px] sm:h-[224px] sm:w-[280px] lg:h-[256px] lg:w-[320px]",
};

export const BUILD_DECISIONS: BuildDecision[] = [
  {
    title: "Exact pixel canvases",
    body: "Each breakpoint sets a fixed pixel box, never a CSS transform scale — the canvas resizes to match so nothing blurs from upscaling.",
  },
  {
    title: "Pauses on tab blur",
    body: "Playback resumes from the state it left, so a returning visitor never walks in mid-beat.",
  },
  {
    title: "One story cursor",
    body: "A single StepState drives autoplay, Resume, Rive fires, and button highlights — manual clicks and the loop share the same path. Court and cup enforce in-clip sequences; card stays freely clickable.",
  },
  {
    title: "Reduced motion respected",
    body: "The status dot stops pulsing and cycle start/tail delays collapse to zero, all keyed off one prefers-reduced-motion check.",
  },
];

export const FILE_SPECS: FileSpecRow[] = [
  { label: "Runtime", value: "Rive · canvas renderer" },
  { label: "Files", value: "court.riv · card.riv · cup.riv" },
  { label: "Triggers", value: "scene1 · scene2 · finish" },
  { label: "Stack", value: "React · TypeScript · Tailwind CSS · Vite" },
];

export const FOOTER_CREDIT = "Designed, animated and built by Yaroslav Kabai.";
export const FOOTER_EMAIL_HREF = "mailto:your@email.com";
export const FOOTER_LINKEDIN_HREF = "https://linkedin.com/in/";
