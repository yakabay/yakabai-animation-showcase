# Showcase page

Portfolio case study for interactive Rive onboarding clips (`court.riv`, `card.riv`, `cup.riv`).

## Glossary

| Term           | Meaning                                                                                                                                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clip           | One Rive file in a bay (`court`, `card`, `cup`).                                                                                                                                                                                        |
| Step state     | Story cursor `{ step, running }` — `STORY_STEPS` order (`boot` → … → `reset`); `running: true` while the step is in progress.                                                                                                           |
| Step duration  | `STEP_DURATION_MS` — how long a step stays `running: true`. Timings only advance state.                                                                                                                                                 |
| Cup phase      | Cup’s in-clip sequence: next allowed trigger is `scene1` → `scene2` → `finish` → `scene1`. **Only** manual gating left besides mapped triggers.                                                                                         |
| Lit trigger    | Derived from step state + bay (running `courtScene1` lights court’s `scene1`, etc.).                                                                                                                                                    |
| Bay tint       | Soft cyan wash that crossfades across the three bays as the story advances; none during reset.                                                                                                                                          |
| Auto loop      | Advances via `nextStoryStep`. Pause freezes scheduling; Resume continues from the current step (no clear/restart). Any bay button click stops autoplay (illegal clicks still stop it, but do not fire). Story `reset` fires `finish` on all three clips at once. |
| Manual reset   | Bay **reset** button (`finish` trigger) resets **only that clip**. Does not run the story-wide three-clip reset.                                                                                                                        |
| Trigger gating | Court/card: any mapped trigger anytime. Cup: cup phase only (`scene1` → `scene2` → `finish`). No running/busy lock.                                                                                                                     |

## Flow

```
STEP_DURATION_MS / STORY_STEPS
        ↓
   StepState { step, running }   (+ cup phase for cup gating)
        ↓
   Rive fire  +  button highlight
```

## Avoid

- Dual timing tables (`gapMs` + `durationMs`) — use `STEP_DURATION_MS` only.
- Parallel per-clip map as _story_ source of truth — one `StepState` cursor (cup phase is gating only).
- Stringly `*Playing` / `*Played` suffixes — use `{ step, running }` instead.
- Parallel `litTriggers` map — highlight comes from step state.
- Story-order gating (“only the next STORY_STEPS beat”) for bay buttons — replaced by per-clip busy + cup phase.
