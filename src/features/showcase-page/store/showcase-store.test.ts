import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CLIP_KEYS, type ClipKey, type ClipTrigger } from "../showcase-page.types";
import { markReady } from "../utils/clips";
import { phaseAt } from "../utils/sequence";
import { createInitialState, useShowcaseStore } from "./showcase-store";
import { clearSettleTimers, setEmitter } from "./showcase-store.actions";

let emitted: string[] = [];

beforeEach(() => {
  vi.useFakeTimers();
  emitted = [];

  // Start from a loaded page: every clip's Rive file has arrived.
  const state = createInitialState();
  let clips = state.clips;
  for (const clip of CLIP_KEYS) clips = markReady(clips, clip);
  useShowcaseStore.setState({ ...state, clips });

  setEmitter((clip, trigger) => emitted.push(`${clip}/${trigger}`));
});

afterEach(() => {
  clearSettleTimers();
  setEmitter(null);
  vi.useRealTimers();
});

const store = () => useShowcaseStore.getState();
const fire = (clip: ClipKey, trigger: ClipTrigger, source: "user" | "auto") =>
  useShowcaseStore.getState().fire(clip, trigger, source);

describe("fire — accepted", () => {
  it("plays the trigger on the real clip", () => {
    fire("court", "scene1", "user");
    expect(emitted).toEqual(["court/scene1"]);
  });

  it("advances only that clip's pointer", () => {
    fire("court", "scene1", "user");

    expect(phaseAt("court", store().clips.court.step)).toBe("finish");
    expect(phaseAt("cup", store().clips.cup.step)).toBe("scene1");
  });

  it("holds the clip busy for exactly its duration, then releases it", () => {
    fire("cup", "scene1", "user");
    expect(store().clips.cup.playing).toBe("scene1");

    vi.advanceTimersByTime(2899);
    expect(store().clips.cup.playing).toBe("scene1");

    vi.advanceTimersByTime(1);
    expect(store().clips.cup.playing).toBeNull();
  });
});

describe("fire — rejected", () => {
  it("does not play anything", () => {
    fire("cup", "scene2", "user");
    expect(emitted).toEqual([]);
  });

  // Bug #6: the pointer used to advance even though nothing played.
  it("leaves the pointer where it was", () => {
    fire("cup", "scene2", "user");
    expect(phaseAt("cup", store().clips.cup.step)).toBe("scene1");
  });

  it("records the illegal click and what to point at instead", () => {
    fire("cup", "scene2", "user");

    expect(store().blocked).toMatchObject({
      clip: "cup",
      illegalTrigger: "scene2",
      legalTrigger: "scene1",
    });
  });

  it("points at nothing when the clip is merely busy", () => {
    fire("cup", "scene1", "user");
    fire("cup", "scene2", "user");

    expect(store().blocked?.legalTrigger).toBeNull();
  });

  it("rejects a click on a clip whose Rive file has not loaded", () => {
    useShowcaseStore.setState((state) => ({
      clips: { ...state.clips, court: { ...state.clips.court, ready: false } },
    }));

    fire("court", "scene1", "user");
    expect(emitted).toEqual([]);
  });
});

describe("mode", () => {
  it("hands control to the visitor on any click, legal or not", () => {
    fire("cup", "scene2", "user");
    expect(store().mode).toBe("manual");
  });

  it("drops the bay tint while the visitor drives", () => {
    fire("court", "scene1", "user");
    expect(store().focus).toBeNull();
  });

  it("stays in auto when the loop itself fires", () => {
    fire("court", "scene1", "auto");
    expect(store().mode).toBe("auto");
  });

  it("moves the tint to the bay the loop is playing", () => {
    fire("cup", "scene1", "auto");
    expect(store().focus).toBe(2);
  });

  it("returns to auto on resume", () => {
    store().pause();
    expect(store().mode).toBe("manual");

    store().resume();
    expect(store().mode).toBe("auto");
  });
});

describe("resetAll", () => {
  it("finishes every named clip as one beat, with no bay tinted", () => {
    store().resetAll(["card", "cup"]);

    expect(emitted).toEqual(["card/finish", "cup/finish"]);
    expect(store().focus).toBeNull();
    expect(store().clips.card.cycleDone).toBe(true);
    expect(store().clips.cup.cycleDone).toBe(true);
    expect(store().clips.court.cycleDone).toBe(false);
  });
});
