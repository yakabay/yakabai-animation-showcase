import type { ClipKey, ClipTrigger } from "../showcase-page.types";

/**
 * Each clip's own trigger order, looping. This table is the single source of
 * truth for both what a user may click and what autoplay fires next — adding a
 * clip means adding one row, not branching on clip identity.
 */
export const SEQUENCE: Record<ClipKey, readonly ClipTrigger[]> = {
  court: ["scene1", "finish"],
  card: ["scene1", "scene2", "finish"],
  cup: ["scene1", "scene2", "finish"],
};

/** The one trigger this clip will accept while sitting at `step`. */
export function phaseAt(clip: ClipKey, step: number): ClipTrigger {
  return SEQUENCE[clip][step];
}

/** Next step index for a clip, wrapping back to scene1 after finish. */
export function advance(clip: ClipKey, step: number): number {
  return (step + 1) % SEQUENCE[clip].length;
}

export function sequenceLength(clip: ClipKey): number {
  return SEQUENCE[clip].length;
}
