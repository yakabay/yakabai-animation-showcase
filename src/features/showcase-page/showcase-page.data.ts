import {
  type BayCopy,
  type BuildDecision,
  type ClipKey,
  type ClipTrigger,
} from "./showcase-page.types";

/**
 * How long each clip plays a given trigger. Drives both the "busy" window that
 * protects an animation from being interrupted and the trigger button's border
 * wipe, so the two can never disagree.
 */
export const CLIP_DURATION_MS: Record<
  ClipKey,
  Partial<Record<ClipTrigger, number>>
> = {
  court: { scene1: 1200, finish: 700 },
  card: { scene1: 650, scene2: 650, finish: 700 },
  cup: { scene1: 3000, scene2: 3500, finish: 700 },
};

/** Pause between each autoplay beat. */
export const STEP_PAUSE_MS = 400;

/**
 * Breath after every clip has reset, before the next cycle's first fire.
 * Together with STEP_PAUSE_MS this reproduces the old tail + boot hold.
 */
export const CYCLE_PAUSE_MS = 1200;

/** How long the illegal button shakes on a blocked click. */
export const BLOCKED_SHAKE_MS = 250;

/** How long the actionable button pops, right after the shake finishes. */
export const LEGAL_POP_MS = 1000;

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
export const FOOTER_LINKEDIN_HREF =
  "https://www.linkedin.com/in/yaroslav-kabai";
