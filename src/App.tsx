import { AnimationShowcase } from "./features/animation-showcase/AnimationShowcase";

const TECH = ["Rive", "Motion", "Vite", "TypeScript", "Tailwind CSS"];

// Set VITE_GITHUB_URL to show a "View source" link.
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL ?? "";

function App() {
  return (
    <main className="flex h-dvh flex-col bg-slate-950">
      <header className="z-30 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <div>
          <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
            Yaroslav Kabai
          </span>
          <span className="ml-2 hidden text-xs text-slate-400 sm:inline">
            Animation Showcase for an NFT-Based Tennis Prediction Platform
          </span>
        </div>
        {GITHUB_URL ? (
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/60 hover:text-white"
          >
            View source
          </a>
        ) : null}
      </header>

      <AnimationShowcase />

      <footer className="z-30 flex flex-col items-center gap-2 px-4 pb-4 sm:pb-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {TECH.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium tracking-wide text-slate-300 sm:text-xs"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 sm:text-xs">
          Designed &amp; built by Yaroslav Kabai
        </p>
      </footer>
    </main>
  );
}

export default App;
