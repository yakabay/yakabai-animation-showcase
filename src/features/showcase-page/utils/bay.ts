import {
  CLIP_KEYS,
  type ClipKey,
  type ClipState,
  type ClipTrigger,
} from "../showcase-page.types";

/** Column this clip occupies, taken from the render order itself. */
export function bayIndexForClip(clip: ClipKey): number {
  return CLIP_KEYS.indexOf(clip);
}

/** Soft wash strength: full at the focused bay, falling off across neighbours. */
export function bayTintWeight(clipIndex: number, focus: number | null): number {
  if (focus === null) return 0;
  return Math.max(0, 1 - Math.abs(clipIndex - focus));
}

/**
 * Which of this bay's buttons is lit. Reads only its own clip, so a bay stays
 * lit for exactly as long as it is really animating.
 */
export function litTriggerFor(state: ClipState): ClipTrigger | null {
  return state.playing;
}
