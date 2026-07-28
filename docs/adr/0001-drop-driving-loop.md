# ADR-0001: Drop Driving loop; single StepState cursor

## Status

Accepted

## Context

The Driving loop (five step chips, jump planner, derived phase) added a second story UI on top of the three live clips. It duplicated narrative already told by the bays, and most of the planner complexity existed only to support step jumps.

Visitors still need a readable sense of progress and safe manual triggers. Per-clip state maps made Resume ambiguous after manual clicks.

## Decision

1. Remove the Driving loop section and all step/jump/phase UI machinery.
2. Drive the showcase with one ordered `StepState` cursor (`NEXT_PLAYING`, `STEP_BEATS`, `STEP_DURATION_MS`).
3. Place Auto loop / Resume on the right of the Hero row.
4. Drive bay tint from the current step (court → card → cup); none on reset.
5. Buttons always look live; illegal clicks are swallowed (strict next-step only).
6. Pipeline: timings advance `StepState`; entering `*Playing` fires Rive; highlights derive from step state.
7. Any bay button click stops Auto loop — even when the transition is illegal and swallowed.
8. Resume continues from the current `StepState` (wait out `*Playing` if needed); do not clear/remount the cycle.

## Consequences

- Resume is obvious after manual play: the cursor already names the next beat.
- Progress cue remains visual (tint) rather than labeled step chips.
- Re-adding Driving-loop style navigation would need a new ADR.
