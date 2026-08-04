import { describe, expect, it } from "vitest";

import { CLIP_KEYS } from "../showcase-page.types";
import { durationFor } from "./duration";
import { SEQUENCE } from "./sequence";

describe("durationFor", () => {
  it("keeps the tuned per-scene timings", () => {
    expect(durationFor("court", "scene1")).toBe(1200);
    expect(durationFor("card", "scene1")).toBe(650);
    expect(durationFor("card", "scene2")).toBe(650);
    expect(durationFor("cup", "scene1")).toBe(2900);
    expect(durationFor("cup", "scene2")).toBe(3500);
  });

  it("gives every clip the same reset duration", () => {
    expect(durationFor("court", "finish")).toBe(700);
    expect(durationFor("card", "finish")).toBe(700);
    expect(durationFor("cup", "finish")).toBe(700);
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
