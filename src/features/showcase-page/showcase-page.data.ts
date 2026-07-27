export const CLIP_KEYS = ["court", "card", "cup"] as const;
export type ClipKey = (typeof CLIP_KEYS)[number];
export type ClipTrigger = "scene1" | "scene2" | "finish";

export const BRAND_NAME = "Yaroslav Kabai";
export const BRAND_ROLE = "design engineer";

export const HERO_TITLE = "Interactive onboarding your users won't skip.";
export const HERO_SUBHEAD =
  "Onboarding flow for an on-chain tennis prediction platform. Every scene is a live Rive state machine.";

interface BayCopy {
  fileLabel: string;
  sizeLabel: string;
  description: string;
  triggers: Array<{ label: string; trigger: ClipTrigger }>;
}

export const BAY_COPY: Record<ClipKey, BayCopy> = {
  court: {
    fileLabel: "court.riv",
    sizeLabel: "240 × 240",
    description: "Pick an upcoming match and predict the exact score by sets.",
    triggers: [
      { label: "scene1", trigger: "scene1" },
      { label: "end", trigger: "finish" },
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
      { label: "end", trigger: "finish" },
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
      { label: "end", trigger: "finish" },
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

// Trigger sequence each clip runs through during one autoplay cycle,
// expressed as [delay-from-cycle-start-ms, trigger].
export const CLIP_SEQUENCE: Record<ClipKey, Array<[number, ClipTrigger]>> = {
  court: [
    [800, "scene1"],
    [8600, "finish"],
  ],
  card: [
    [2600, "scene1"],
    [3300, "scene2"],
    [8600, "finish"],
  ],
  cup: [
    [4600, "scene1"],
    [6400, "scene2"],
    [8900, "finish"],
  ],
};

// Which step is active at each point in the cycle. The cycle opens on the
// reset state, so the first entry starts at the score pick rather than at 0.
export const PHASE_SCHEDULE: Array<[number, number]> = [
  [800, 0],
  [2600, 1],
  [3300, 2],
  [6400, 3],
  [8900, 4],
];

export const CYCLE_MS = 10200;

/** Step index whose clips are all back at their initial state. */
export const RESET_PHASE = 4;

// Manually jumping to a step replays the triggers that would have put the
// clips in that state, in order.
export const PHASE_JUMP: Record<number, Array<[ClipKey, ClipTrigger]>> = {
  0: [
    ["card", "finish"],
    ["cup", "finish"],
    ["court", "scene1"],
  ],
  1: [
    ["cup", "finish"],
    ["card", "scene1"],
  ],
  2: [
    ["card", "scene2"],
    ["cup", "scene1"],
  ],
  3: [["cup", "scene2"]],
  4: [],
};

// Steps that can't be reached by firing triggers alone. These clips are torn
// down and recreated so they start from a guaranteed clean state; any trigger
// they own in PHASE_JUMP is held back until the new instance reports ready.
export const PHASE_REMOUNT: Record<number, ClipKey[]> = {
  0: ["court"],
  4: ["court", "card", "cup"],
};

export const JUMP_STAGGER_MS = 260;

interface DrivingLoopStep {
  id: string;
  stepLabel: string;
  title: string;
  subtitle: string;
  arrow: "next" | "loop" | "none";
}

export const DRIVING_LOOP_STEPS: DrivingLoopStep[] = [
  {
    id: "S1",
    stepLabel: "Step 1",
    title: "Score picked",
    subtitle: "The exact result, set by set",
    arrow: "next",
  },
  {
    id: "S2",
    stepLabel: "Step 2",
    title: "Card minted",
    subtitle: "Your stake, locked to the pick",
    arrow: "next",
  },
  {
    id: "S3",
    stepLabel: "Step 3",
    title: "Pool",
    subtitle: "The entry fee joins the pot",
    arrow: "next",
  },
  {
    id: "S4",
    stepLabel: "Step 4",
    title: "Payout",
    subtitle: "Correct callers split it",
    arrow: "loop",
  },
  {
    id: "S5",
    stepLabel: "Step 5",
    title: "Reset",
    subtitle: "Every clip returns to initial state",
    arrow: "none",
  },
];

interface BuildDecision {
  title: string;
  body: string;
}

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
    title: "One state, many drivers",
    body: "Autoplay and every button on this page write to the same phase state — a manual trigger takes over cleanly, and Resume picks the loop back up instead of fighting it.",
  },
  {
    title: "Reduced motion respected",
    body: "The status dot stops pulsing and manual jumps fire together instead of staggering, all keyed off one prefers-reduced-motion check.",
  },
];

interface FileSpecRow {
  label: string;
  value: string;
}

export const FILE_SPECS: FileSpecRow[] = [
  { label: "Runtime", value: "Rive · canvas renderer" },
  { label: "Files", value: "court.riv · card.riv · cup.riv" },
  { label: "Triggers", value: "scene1 · scene2 · finish" },
  { label: "Stack", value: "React · TypeScript · Tailwind CSS · Vite" },
];

export const FOOTER_CREDIT = "Designed, animated and built by Yaroslav Kabai.";
export const FOOTER_EMAIL_HREF = "mailto:your@email.com";
export const FOOTER_LINKEDIN_HREF = "https://linkedin.com/in/";
