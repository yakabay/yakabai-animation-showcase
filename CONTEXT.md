# Showcase page

Portfolio case study for interactive Rive onboarding clips (`court.riv`, `card.riv`, `cup.riv`).

## Glossary

| Term | Meaning |
| --- | --- |
| Clip | One Rive file in a bay (`court`, `card`, `cup`). |
| Clip state | Per-clip SoT `{ step, playing, ready, cycleDone }`. `step` indexes that clip’s `SEQUENCE`; `playing` is the busy/lit trigger (or `null` when idle). |
| Clip duration | `CLIP_DURATION_MS` — how long a trigger stays `playing`. Same value drives the busy gate and the border wipe. |
| Auto pauses | `STEP_PAUSE_MS` between autoplay beats; `CYCLE_PAUSE_MS` after a cycle completes before the next run. Kept next to `CLIP_DURATION_MS` in `showcase-page.data.ts`. |
| Sequence | Each clip’s allowed trigger order (`SEQUENCE` in `utils/sequence.ts`): court `scene1` → `finish`; card `scene1` → `scene2` → `finish`; cup `scene1` → `scene2` → `finish`. |
| Lit trigger | Derived from that clip’s `playing` — never a parallel map. |
| Bay tint | Cyan wash on the focused bay during autoplay; cleared in manual mode and during multi-clip reset. |
| Auto loop | Walks owed clips via `nextAutoAction` (no global cursor). Pause freezes scheduling; Resume continues from current clip states. Any bay click stops autoplay (illegal clicks stop it but do not fire). |
| Owed clip | A clip with `cycleDone: false`. Autoplay only fires/resets owed clips; a manual reset marks that clip done for the cycle so the walk skips it. |
| Cycle reset | When every owed clip is at `finish`, autoplay fires `finish` on those owed clips together — not necessarily all three if some were manually reset. |
| Manual reset | Bay **reset** button (`finish`) resets **only that clip** and drops it out of the current auto cycle. |
| Trigger gating | Every clip: only the next `SEQUENCE` trigger, and only while idle and ready. |

## Flow

```
CLIP_DURATION_MS + STEP_PAUSE_MS / CYCLE_PAUSE_MS
        ↓
   Zustand store clips map (per-clip ClipState)  →  nextAutoAction / isLegal
        ↓
   Rive fire (via store emitter)  +  button highlight (from playing)
```

## Avoid

- Dual *story* timing tables that diverge (e.g. separate wipe vs busy durations) — one `CLIP_DURATION_MS` entry per trigger for both.
- A global story cursor (`StepState` / `STORY_STEPS`) — story is the per-clip map; autoplay derives the next beat.
- Stringly `*Playing` / `*Played` suffixes — use `{ step, playing }` on each clip.
- Parallel `litTriggers` map — highlight comes from `playing`.
- “Driving loop” step chips / jump planner — removed; do not reintroduce without an ADR.
