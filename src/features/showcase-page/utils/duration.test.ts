import { describe, expect, it } from "vitest";

import { CLIP_DURATION_MS } from "../showcase-page.data";
import { CLIP_KEYS } from "../showcase-page.types";
import { durationFor } from "./duration";
import { SEQUENCE } from "./sequence";

describe("durationFor", () => {
  it("reads the tuned per-scene timings from CLIP_DURATION_MS", () => {
    expect(durationFor("court", "scene1")).toBe(CLIP_DURATION_MS.court.scene1);
    expect(durationFor("card", "scene1")).toBe(CLIP_DURATION_MS.card.scene1);
    expect(durationFor("card", "scene2")).toBe(CLIP_DURATION_MS.card.scene2);
    expect(durationFor("cup", "scene1")).toBe(CLIP_DURATION_MS.cup.scene1);
    expect(durationFor("cup", "scene2")).toBe(CLIP_DURATION_MS.cup.scene2);
  });

  it("gives every clip the same reset duration", () => {
    expect(durationFor("court", "finish")).toBe(CLIP_DURATION_MS.court.finish);
    expect(durationFor("card", "finish")).toBe(CLIP_DURATION_MS.card.finish);
    expect(durationFor("cup", "finish")).toBe(CLIP_DURATION_MS.cup.finish);
  });

  // The border wipe is driven by this number. A missing entry would silently
  // animate for the wrong length instead of failing loudly.
  it("covers every trigger of every clip's sequence", () => {
    for (const clip of CLIP_KEYS) {
      for (const trigger of SEQUENCE[clip]) {
        expect(durationFor(clip, trigger)).toBeGreaterThan(0);
      }
    }
  });
});
