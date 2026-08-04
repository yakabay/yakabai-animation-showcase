import type { ClipKey, ClipState, ClipTrigger } from "../showcase-page.types";
import { isBusy } from "./clips";
import { phaseAt } from "./sequence";

/**
 * The trigger this clip will accept right now, or `null` when nothing is
 * actionable — busy playing something, or not loaded yet. Drives both the
 * legality check and which button pops after a rejected click.
 */
export function legalTriggerFor(
  clip: ClipKey,
  state: ClipState
): ClipTrigger | null {
  if (!state.ready || isBusy(state)) return null;
  return phaseAt(clip, state.step);
}

/** One rule for every clip: matches the pointer, idle, and loaded. */
export function isLegal(
  clip: ClipKey,
  trigger: ClipTrigger,
  state: ClipState
): boolean {
  return legalTriggerFor(clip, state) === trigger;
}
