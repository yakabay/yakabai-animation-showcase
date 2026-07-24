export const STEP_KEYS = ["court", "card", "cup"] as const;

export const STEP_TEXT: Record<(typeof STEP_KEYS)[number], string> = {
  court: "Pick an upcoming match and predict the exact score by sets.",
  card: "Confirm your prediction to create your on-chain card. Your entry fee goes to the reward pool.",
  cup: "The reward pool is distributed equally among all correct predictors.",
};

export const SHOWCASE_TITLE = "How it works";

export type ClipSizeBucket = "lg" | "sm" | "mobile" | "shortMobile";

// Canvas dimensions are the source of truth — passed as exact pixel props
// to each clip. No CSS scaling. Court & Card keep 1:1; Cup keeps 5:4.
export const clipSizes: Record<
  (typeof STEP_KEYS)[number],
  Record<ClipSizeBucket, { width: number; height: number }>
> = {
  court: {
    lg: { width: 280, height: 280 },
    sm: { width: 240, height: 240 },
    mobile: { width: 242, height: 242 },
    shortMobile: { width: 187, height: 187 },
  },
  card: {
    lg: { width: 340, height: 340 },
    sm: { width: 300, height: 300 },
    mobile: { width: 297, height: 297 },
    shortMobile: { width: 231, height: 231 },
  },
  cup: {
    lg: { width: 436, height: 348 },
    sm: { width: 380, height: 304 },
    mobile: { width: 381, height: 304 },
    shortMobile: { width: 297, height: 238 },
  },
};

// Stage wraps the tallest clip at each bucket with breathing room.
export const stageHeights: Record<ClipSizeBucket, number> = {
  lg: 380,
  sm: 340,
  mobile: 330,
  shortMobile: 264,
};

export const SHOWCASE_LAYOUT = {
  descriptionMaxWidth: "max-w-[20rem] sm:max-w-[26rem]",
  descriptionMinHeight: "min-h-20 sm:min-h-24",
  headerMarginBottom: "mb-2 sm:mb-4",
  descriptionMarginBottom: "mb-8 sm:mb-10 lg:mb-12",
} as const;
