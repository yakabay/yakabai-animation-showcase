import { describe, expect, it } from "vitest";

import { nextAutoAction } from "./autoplay";
import {
  fireClip,
  initialClips,
  settleClip,
  startCycle,
  type Clips,
} from "./clips";

/** Fire a trigger and let it finish, the way a settled step leaves the state. */
function play(clips: Clips, clip: Parameters<typeof fireClip>[1], trigger: Parameters<typeof fireClip>[2]): Clips {
  return settleClip(fireClip(clips, clip, trigger), clip);
}

/** Let autoplay drive until every clip has been reset for the cycle. */
function playWholeCycle(start: Clips): Clips {
  let clips = start;

  for (let i = 0; i < 20; i++) {
    const action = nextAutoAction(clips);
    if (action.kind === "cycleComplete") return clips;
    if (action.kind === "fire") {
      clips = play(clips, action.clip, action.trigger);
    } else {
      for (const clip of action.clips) clips = play(clips, clip, "finish");
    }
  }

  throw new Error("cycle never completed");
}

/** Drive the loop `steps` times, logging what it chose to do at each turn. */
function runLoop(start: Clips, steps: number): string[] {
  let clips = start;
  const log: string[] = [];

  for (let i = 0; i < steps; i++) {
    const action = nextAutoAction(clips);

    if (action.kind === "fire") {
      log.push(`${action.clip}/${action.trigger}`);
      clips = play(clips, action.clip, action.trigger);
    } else if (action.kind === "reset") {
      log.push(`reset:${action.clips.join("+")}`);
      for (const clip of action.clips) clips = play(clips, clip, "finish");
    } else {
      log.push("cycle");
      clips = startCycle(clips);
    }
  }

  return log;
}

describe("nextAutoAction", () => {
  it("walks untouched clips in the same order the page shows today", () => {
    expect(runLoop(initialClips(), 7)).toEqual([
      "court/scene1",
      "card/scene1",
      "card/scene2",
      "cup/scene1",
      "cup/scene2",
      "reset:court+card+cup",
      "cycle",
    ]);
  });

  it("repeats that order on the next cycle", () => {
    expect(runLoop(initialClips(), 8).at(-1)).toBe("court/scene1");
  });

  // Your rule: "if autoloop stopped at cup and I clicked court/reset, court's
  // reset is just skipped at the end of the loop."
  it("skips a clip you already reset by hand, instead of replaying it", () => {
    let clips = play(initialClips(), "court", "scene1");
    clips = play(clips, "court", "finish");

    expect(runLoop(clips, 5)).toEqual([
      "card/scene1",
      "card/scene2",
      "cup/scene1",
      "cup/scene2",
      "reset:card+cup",
    ]);
  });

  // Your open question: stopped at court/1, then card and cup driven by hand.
  it("resumes by firing only what is still owed", () => {
    let clips = play(initialClips(), "card", "scene1");
    clips = play(clips, "card", "scene2");
    clips = play(clips, "cup", "scene1");

    expect(runLoop(clips, 4)).toEqual([
      "court/scene1",
      "cup/scene2",
      "reset:court+card+cup",
      "cycle",
    ]);
  });

  it("reports the cycle complete once every clip has been reset", () => {
    expect(nextAutoAction(playWholeCycle(initialClips()))).toEqual({
      kind: "cycleComplete",
    });
  });

  it("starts a fresh cycle from court after the cycle completes", () => {
    const done = playWholeCycle(initialClips());

    expect(nextAutoAction(startCycle(done))).toEqual({
      kind: "fire",
      clip: "court",
      trigger: "scene1",
    });
  });
});
