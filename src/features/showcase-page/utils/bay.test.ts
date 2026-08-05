import { describe, expect, it } from "vitest";

import { bayIndexForClip, bayTintWeight, litTriggerFor } from "./bay";
import { fireClip, initialClips, settleClip } from "./clips";

describe("bayIndexForClip", () => {
  it("matches the order the bays are rendered in", () => {
    expect(bayIndexForClip("court")).toBe(0);
    expect(bayIndexForClip("card")).toBe(1);
    expect(bayIndexForClip("cup")).toBe(2);
  });
});

describe("bayTintWeight", () => {
  it("is full only on the focused bay", () => {
    expect(bayTintWeight(1, 1)).toBe(1);
    expect(bayTintWeight(0, 1)).toBe(0);
    expect(bayTintWeight(2, 0)).toBe(0);
  });

  it("is gone everywhere when nothing is focused", () => {
    expect(bayTintWeight(0, null)).toBe(0);
    expect(bayTintWeight(1, null)).toBe(0);
  });
});

describe("litTriggerFor", () => {
  it("names the trigger the clip is playing right now", () => {
    const clips = fireClip(initialClips(), "cup", "scene1");
    expect(litTriggerFor(clips.cup)).toBe("scene1");
  });

  it("names nothing once the clip has settled", () => {
    const clips = settleClip(fireClip(initialClips(), "cup", "scene1"), "cup");
    expect(litTriggerFor(clips.cup)).toBeNull();
  });

  // Bug #3: firing one clip used to blank out another clip's indicator while
  // its animation was still visibly running.
  it("keeps a playing clip lit while a different clip fires", () => {
    let clips = fireClip(initialClips(), "cup", "scene1");
    clips = fireClip(clips, "card", "scene1");

    expect(litTriggerFor(clips.cup)).toBe("scene1");
    expect(litTriggerFor(clips.card)).toBe("scene1");
  });
});
