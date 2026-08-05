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

/** Tint weight: 1 on the focused bay, 0 on every other bay (and when unfocused). */
export function bayTintWeight(clipIndex: number, focus: number | null): number {
  if (focus === null) return 0;
  return clipIndex === focus ? 1 : 0;
}

/**
 * Which of this bay's buttons is lit. Reads only its own clip, so a bay stays
 * lit for exactly as long as it is really animating.
 */
export function litTriggerFor(state: ClipState): ClipTrigger | null {
  return state.playing;
}
