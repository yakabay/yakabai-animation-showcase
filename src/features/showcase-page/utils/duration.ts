import { CLIP_DURATION_MS } from "../showcase-page.data";
import type { ClipKey, ClipTrigger } from "../showcase-page.types";

/**
 * How long `clip` plays `trigger`. Drives the busy window and the border wipe,
 * so a missing entry is a bug rather than something to paper over with a
 * default — `duration.test.ts` proves every trigger in every sequence is here.
 */
export function durationFor(clip: ClipKey, trigger: ClipTrigger): number {
  const ms = CLIP_DURATION_MS[clip][trigger];
  if (ms === undefined) {
    throw new Error(`No duration configured for ${clip}/${trigger}`);
  }
  return ms;
}
