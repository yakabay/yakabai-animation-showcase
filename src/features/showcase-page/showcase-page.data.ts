import {
  type BayCopy,
  type BuildDecision,
  type ClipKey,
  type ClipTrigger,
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
export const BRAND_ROLE = "Product Engineer";

export const HERO_TITLE = "Interactive onboarding your users won't skip.";
export const HERO_SUBHEAD =
  "Portfolio showcase: onboarding for an on-chain tennis prediction platform.";

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
    sizeLabel: "336 × 269",
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
  cup: "h-[185px] w-[231px] sm:h-[235px] sm:w-[294px] lg:h-[269px] lg:w-[336px]",
};

export const BUILD_DECISIONS: BuildDecision[] = [
  {
    title: "Motion that teaches the flow",
    body: "The loop shows the exact steps a user takes — predict, mint, get paid. Ten seconds, and a stranger already knows what this product does.",
  },
  {
    title: "Animation through composition",
    body: "Every motion responds to events. New scenes reuse existing animations, this allows complexity to scale without multiplication.",
  },
  {
    title: "No race conditions by design",
    body: "One state controls the entire flow. Switch from autoplay to manual anytime. The result: interactions never collide, and the flow stays reliable under real use.",
  },
  {
    title: "No shortcuts on quality",
    body: "Every breakpoint renders each Rive canvas at its exact native size instead of stretching one to fit. What you get: nothing looks blurry or wrong on any device.",
  },
  {
    title: "Working with AI, deliberately",
    body: "Domain and architecture docs gave the AI agent the same context a human engineer would need. Real leverage, not hype.",
  },
];

export const FOOTER_STACK = [
  "React",
  "TypeScript",
  "Rive",
  "Tailwind CSS",
  "Vite",
] as const;

export const FOOTER_CREDIT_PREFIX = "Designed and built by";
export const FOOTER_CREDIT_NAME = "Yaroslav Kabai";
export const FOOTER_EMAIL_HREF = "mailto:yakabay86@gmail.com";
export const FOOTER_LINKEDIN_HREF = "https://www.linkedin.com/in/yaroslav-kabai";
