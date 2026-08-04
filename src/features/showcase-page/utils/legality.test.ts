import { describe, expect, it } from "vitest";

import type { ClipState } from "../showcase-page.types";
import { isLegal, legalTriggerFor } from "./legality";

const idle = (step: number): ClipState => ({
  step,
  playing: null,
  ready: true,
  cycleDone: false,
});
const busy = (step: number): ClipState => ({
  step,
  playing: "scene1",
  ready: true,
  cycleDone: false,
});
const loading = (step: number): ClipState => ({
  step,
  playing: null,
  ready: false,
  cycleDone: false,
});

describe("isLegal", () => {
  it("accepts the trigger the clip's pointer is sitting on", () => {
    expect(isLegal("court", "scene1", idle(0))).toBe(true);
    expect(isLegal("cup", "scene2", idle(1))).toBe(true);
    expect(isLegal("card", "finish", idle(2))).toBe(true);
  });

  it("rejects a trigger that is out of sequence", () => {
    expect(isLegal("cup", "scene2", idle(0))).toBe(false);
    expect(isLegal("court", "finish", idle(0))).toBe(false);
  });

  // Card used to accept any trigger at any time — that was bug #4.
  it("holds card to its sequence like every other clip", () => {
    expect(isLegal("card", "scene2", idle(0))).toBe(false);
    expect(isLegal("card", "finish", idle(0))).toBe(false);
  });

  it("rejects everything while the clip is busy", () => {
    expect(isLegal("cup", "scene2", busy(1))).toBe(false);
    expect(isLegal("cup", "scene1", busy(1))).toBe(false);
  });

  // Bug #6: firing into an unloaded clip silently no-ops while the pointer
  // advances, desyncing the app from what the visitor actually saw.
  it("rejects everything until the clip's Rive file has loaded", () => {
    expect(isLegal("court", "scene1", loading(0))).toBe(false);
  });
});

describe("legalTriggerFor", () => {
  it("names the trigger the pointer is on when the clip is idle", () => {
    expect(legalTriggerFor("court", idle(0))).toBe("scene1");
    expect(legalTriggerFor("court", idle(1))).toBe("finish");
    expect(legalTriggerFor("cup", idle(1))).toBe("scene2");
  });

  it("names nothing while busy — there is no actionable button to point at", () => {
    expect(legalTriggerFor("cup", busy(1))).toBeNull();
  });

  it("names nothing until the clip has loaded", () => {
    expect(legalTriggerFor("court", loading(0))).toBeNull();
  });
});
