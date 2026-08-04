import { describe, expect, it } from "vitest";

import { CLIP_KEYS } from "../showcase-page.types";
import { fireClip, initialClips, settleClip, startCycle } from "./clips";
import { phaseAt } from "./sequence";

describe("initialClips", () => {
  it("starts every clip on scene1, idle, unloaded and owing a cycle", () => {
    const clips = initialClips();
    for (const clip of CLIP_KEYS) {
      expect(clips[clip]).toEqual({
        step: 0,
        playing: null,
        ready: false,
        cycleDone: false,
      });
    }
  });
});

describe("fireClip", () => {
  it("advances only the clip that fired", () => {
    const before = initialClips();
    const after = fireClip(before, "card", "scene1");

    expect(phaseAt("card", after.card.step)).toBe("scene2");
    expect(after.court).toEqual(before.court);
    expect(after.cup).toEqual(before.cup);
  });

  it("records which trigger the fired clip is playing", () => {
    const after = fireClip(initialClips(), "cup", "scene1");
    expect(after.cup.playing).toBe("scene1");
  });

  it("wraps the pointer back to scene1 after finish", () => {
    let clips = fireClip(initialClips(), "court", "scene1");
    clips = settleClip(clips, "court");
    clips = fireClip(clips, "court", "finish");

    expect(phaseAt("court", clips.court.step)).toBe("scene1");
  });

  // "finish" means back to the start, not "one step onward" — otherwise a
  // finish fired from anywhere but the end leaves the pointer mid-sequence.
  it("returns the clip to scene1 on finish, wherever the pointer stood", () => {
    const clips = fireClip(initialClips(), "cup", "finish");
    expect(phaseAt("cup", clips.cup.step)).toBe("scene1");
  });

  it("marks a clip done for this cycle when it finishes", () => {
    let clips = fireClip(initialClips(), "court", "scene1");
    clips = settleClip(clips, "court");
    clips = fireClip(clips, "court", "finish");

    expect(clips.court.cycleDone).toBe(true);
  });

  // Replaying a scene puts the clip back in the running, so the end-of-cycle
  // reset sweep picks it up again instead of leaving it half-played.
  it("puts a finished clip back in the cycle when a scene is fired again", () => {
    let clips = fireClip(initialClips(), "court", "scene1");
    clips = settleClip(clips, "court");
    clips = fireClip(clips, "court", "finish");
    clips = settleClip(clips, "court");
    clips = fireClip(clips, "court", "scene1");

    expect(clips.court.cycleDone).toBe(false);
  });
});

describe("settleClip", () => {
  it("stops playing without touching the pointer", () => {
    const fired = fireClip(initialClips(), "cup", "scene1");
    const settled = settleClip(fired, "cup");

    expect(settled.cup.playing).toBeNull();
    expect(settled.cup.step).toBe(fired.cup.step);
  });
});

describe("startCycle", () => {
  it("clears cycleDone on every clip", () => {
    let clips = initialClips();
    for (const clip of CLIP_KEYS) {
      clips = { ...clips, [clip]: { ...clips[clip], cycleDone: true } };
    }

    const fresh = startCycle(clips);

    for (const clip of CLIP_KEYS) {
      expect(fresh[clip].cycleDone).toBe(false);
    }
  });
});
