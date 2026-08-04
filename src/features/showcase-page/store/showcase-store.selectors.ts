import { CLIP_KEYS, type ClipKey } from "../showcase-page.types";
import { bayTintWeight } from "../utils/bay";
import { isBusy, type Clips } from "../utils/clips";
import type { ShowcaseStore } from "./showcase-store";

/**
 * One bay's slice. The returned object identity only changes when that clip
 * changes, so a bay does not re-render because a sibling fired.
 */
export const selectClip = (clip: ClipKey) => (state: ShowcaseStore) =>
  state.clips[clip];

export const selectTint = (clip: ClipKey) => (state: ShowcaseStore) =>
  bayTintWeight(CLIP_KEYS.indexOf(clip), state.focus);

export const selectMode = (state: ShowcaseStore) => state.mode;

export const selectIsPaused = (state: ShowcaseStore) => state.mode === "manual";

export const selectBlocked = (state: ShowcaseStore) => state.blocked;

export const selectActivationGen = (state: ShowcaseStore) =>
  state.activationGen;

export function allReady(clips: Clips): boolean {
  return CLIP_KEYS.every((clip) => clips[clip].ready);
}

export function anyBusy(clips: Clips): boolean {
  return CLIP_KEYS.some((clip) => isBusy(clips[clip]));
}
