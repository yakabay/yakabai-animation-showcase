# Showcase page

Portfolio case study for interactive Rive onboarding clips (`court.riv`, `card.riv`, `cup.riv`).

## Glossary

| Term | Meaning |
| --- | --- |
| Clip | One Rive file in a bay (`court`, `card`, `cup`). |
| Step state | Story cursor `{ step, running }` — `STORY_STEPS` order (`boot` → … → `reset`); `running: true` while the step is in progress. |
| Step duration | `STEP_DURATION_MS` — how long a step stays `running: true`. Timings only advance state. |
| Lit trigger | Derived from step state + bay (running `courtScene1` lights court’s `scene1`, etc.). |
| Bay tint | Soft cyan wash that crossfades across the three bays as the story advances; none during reset. |
| Auto loop | Advances via `nextStoryStep`. Pause freezes scheduling; Resume continues from the current step (no clear/restart). Any bay button click stops it (even an illegal request). |
| Trigger gating | Buttons always look live; illegal clicks are swallowed. A click is legal only when it requests the next expected step. |

## Flow

```
STEP_DURATION_MS / STORY_STEPS
        ↓
   StepState { step, running }
        ↓
   Rive fire  +  button highlight
```

## Avoid

- “Driving loop” step chips / jump planner — removed; do not reintroduce that UI without an ADR.
- Dual timing tables (`gapMs` + `durationMs`) — use `STEP_DURATION_MS` only.
- Parallel per-clip `clipStates` map as story source of truth — one `StepState` cursor.
- Stringly `*Playing` / `*Played` suffixes — use `{ step, running }` instead.
- Parallel `litTriggers` map — highlight comes from step state.
