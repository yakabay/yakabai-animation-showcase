# Animation Showcase for an NFT-Based Tennis Prediction Platform

A portfolio piece by **Yaroslav Kabai**: an interactive "How it works" walkthrough
for an NFT-based tennis prediction product, built with [Rive](https://rive.app) and
[Motion](https://motion.dev). Three Rive state-machine clips (pick a match → mint your
prediction card → collect from the reward pool) autoplay through a small finite-state
machine, with swipe navigation, slide indicators, tab-visibility pausing, and ambient
animated background blobs. It demonstrates both motion/front-end craft and product
thinking.

Ported and rebuilt as a standalone Vite app from a larger project. Not indexed by
search engines (see `public/robots.txt`).

## Tech

- **Rive** (`@rive-app/react-canvas`, pinned) — vector state-machine clips driven by triggers
- **Motion** (formerly Framer Motion) — ambient background motion + entrance transitions
- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4**

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

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
  App.tsx                 # page shell: header, showcase, footer
  index.css               # Tailwind v4 + custom utilities/animations
  lib/
    cn.ts                 # classnames helper
    asset.ts              # BASE_URL-aware asset path
  features/
    animation-showcase/
      AnimationShowcase.tsx        # orchestrates the piece
      animation-showcase.data.ts   # step copy, sizing, layout constants
      components/
        animations/                # the Rive layer + its backdrop
          RiveStage.tsx             # cross-fades the 3 clips
          CourtClip.tsx / CardClip.tsx / CupClip.tsx
          StageGlow.tsx
          BackgroundEffects.tsx
          AmbientBlobs.tsx
        ui/                         # chrome/framing around the animation
          SectionTitle.tsx
          StepText.tsx
          SlideIndicator.tsx
      hooks/
        useAutoPlayLoop.ts          # the finite-state machine
        usePageVisible.ts           # pauses playback when the tab is hidden
        useHorizontalSwipe.ts       # swipe navigation
        useClipBucketSize.ts        # responsive canvas sizing
public/
  court.riv  card.riv  cup.riv
```

---

Designed & built by **Yaroslav Kabai**.
