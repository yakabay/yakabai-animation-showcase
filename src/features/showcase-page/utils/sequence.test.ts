import { describe, expect, it } from "vitest";

import { advance, phaseAt, sequenceLength } from "./sequence";

describe("phaseAt", () => {
  it("starts every clip on scene1", () => {
    expect(phaseAt("court", 0)).toBe("scene1");
    expect(phaseAt("card", 0)).toBe("scene1");
    expect(phaseAt("cup", 0)).toBe("scene1");
  });

  it("gives court finish right after scene1 — court has no scene2", () => {
    expect(phaseAt("court", 1)).toBe("finish");
  });

  it("gives card and cup scene2 before finish", () => {
    expect(phaseAt("card", 1)).toBe("scene2");
    expect(phaseAt("card", 2)).toBe("finish");
    expect(phaseAt("cup", 1)).toBe("scene2");
    expect(phaseAt("cup", 2)).toBe("finish");
  });
});

describe("advance", () => {
  it("walks court scene1 -> finish -> back to scene1", () => {
    const afterScene1 = advance("court", 0);
    expect(phaseAt("court", afterScene1)).toBe("finish");

    const afterFinish = advance("court", afterScene1);
    expect(phaseAt("court", afterFinish)).toBe("scene1");
  });

  it("walks cup scene1 -> scene2 -> finish -> back to scene1", () => {
    let step = 0;
    step = advance("cup", step);
    expect(phaseAt("cup", step)).toBe("scene2");

    step = advance("cup", step);
    expect(phaseAt("cup", step)).toBe("finish");

    step = advance("cup", step);
    expect(phaseAt("cup", step)).toBe("scene1");
  });
});

describe("sequenceLength", () => {
  it("reports court shorter than card and cup", () => {
    expect(sequenceLength("court")).toBe(2);
    expect(sequenceLength("card")).toBe(3);
    expect(sequenceLength("cup")).toBe(3);
  });
});
