# Animation Showcase for an NFT-Based Tennis Prediction Platform

A portfolio piece by **Yaroslav Kabai**: an interactive onboarding walkthrough for
an on-chain tennis prediction product, built with [Rive](https://rive.app) and
[Motion](https://motion.dev). Three Rive state-machine clips (`court.riv` →
`card.riv` → `cup.riv`) sit in side-by-side bays and autoplay through per-clip
sequences, with manual trigger buttons, pause/resume, tab-visibility pausing,
and a lightbox for the Rive editor screenshot. It demonstrates both
motion/front-end craft and product thinking.

Domain vocabulary and control-flow rules live in [`CONTEXT.md`](./CONTEXT.md).

Ported and rebuilt as a standalone Vite app from a larger project. Not indexed by
search engines (see `public/robots.txt`).

## Tech

- **Rive** (`@rive-app/react-canvas`, pinned) — vector state-machine clips driven by triggers
- **Motion** (formerly Framer Motion) — entrance / in-view transitions
- **Zustand** — showcase page state (clips, mode, focus, blocked clicks)
- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Vitest** + **oxlint**

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b` then production build |
| `npm run preview` | Preview the production build |
| `npm run test` | Vitest (unit tests under `src/**/*.test.ts`) |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` | oxlint |

## Architecture

The app follows a **feature-based** structure governed by **lazy/earned colocation**
(as used by [Bulletproof React](https://github.com/alan2207/bulletproof-react) and
described in Kent C. Dodds' colocation principle): a component stays a single file
until it grows private children or hooks, at which point it's promoted into its own
folder that mirrors the same segment names as its parent. Code lives as close as
possible to where it's used, and is only pulled up to a shared location once it's
actually shared.

```
src/
  App.tsx                          # mounts ShowcasePage
  index.css                        # Tailwind v4 + theme fonts
  lib/
    cn.ts                          # classnames helper
    asset.ts                       # BASE_URL-aware asset path
  features/
    showcase-page/
      ShowcasePage.tsx             # page shell: header → hero → bays → copy → footer
      showcase-page.data.ts        # timing, copy, clip box sizes, footer meta
      showcase-page.types.ts       # ClipKey / ClipState / triggers
      showcase-page.motion.ts      # shared Motion variants
      store/                       # Zustand store, actions, selectors, runtime emitter
      utils/                       # sequence, autoplay, legality, clips, bay, duration
      hooks/
        useAutoLoop.ts             # schedules nextAutoAction while mode is auto
        usePageVisible.ts          # pauses the loop when the tab is hidden
        useStickyStuck.ts          # sticky AutoLoopButton elevation
      components/
        ClipBaysStage.tsx / ClipBays.tsx / ClipBay.tsx
        clips/                     # CourtClip / CardClip / CupClip
        TriggerButton.tsx / TriggerBorderWipe.tsx / AutoLoopButton.tsx
        HeaderBar.tsx / Hero.tsx / BrandMark.tsx
        BuildDecisions.tsx / InsideTheFile.tsx / SiteFooter.tsx
public/
  court.riv  card.riv  cup.riv  rive-screenshot.png
```

Path alias: `@/` → `src/` (see `vite.config.ts`).

---

Designed & built by **Yaroslav Kabai**.
