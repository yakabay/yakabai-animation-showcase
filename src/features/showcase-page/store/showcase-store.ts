import { create } from "zustand";

import type { BlockedAttempt, ClipKey, ClipTrigger } from "../showcase-page.types";
import { initialClips, type Clips } from "../utils/clips";
import { createActions } from "./showcase-store.actions";

/** `auto` = the loop is driving. `manual` = the visitor is. */
export type Mode = "auto" | "manual";

/** Who asked for a trigger. Only a visitor's click drops us into manual. */
export type FireSource = "user" | "auto";

export interface ShowcaseState {
  clips: Clips;
  mode: Mode;
  /** Bay column the tint sits on, or null while the visitor is driving. */
  focus: number | null;
  /** Last rejected click, kept so the shake/pop can replay on a new gen. */
  blocked: BlockedAttempt | null;
  /** Bumped on every accepted fire; restarts the border wipe. */
  activationGen: number;
}

export interface ShowcaseActions {
  fire: (clip: ClipKey, trigger: ClipTrigger, source: FireSource) => void;
  /** Fire finish on several clips as one synchronised beat. */
  resetAll: (clips: ClipKey[]) => void;
  startNewCycle: () => void;
  notifyReady: (clip: ClipKey) => void;
  pause: () => void;
  resume: () => void;
}

export type ShowcaseStore = ShowcaseState & ShowcaseActions;

export function createInitialState(): ShowcaseState {
  return {
    clips: initialClips(),
    mode: "auto",
    focus: 0,
    blocked: null,
    activationGen: 0,
  };
}

export const useShowcaseStore = create<ShowcaseStore>()((set, get) => ({
  ...createInitialState(),
  ...createActions(set, get),
}));
