import { HERO_SUBHEAD, HERO_TITLE } from "../showcase-page.data";

interface HeroProps {
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
}

const CONTROL_CLASS =
  "relative flex h-[34px] w-[108px] shrink-0 cursor-pointer items-center justify-center gap-1.5 self-end rounded-md border p-0 font-mono text-[11px] tracking-[0.14em] uppercase";

export function Hero({ paused, onPause, onResume }: HeroProps) {
  return (
    <div className="flex flex-col gap-8 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12 sm:px-14 sm:py-16 sm:pb-10">
      <div className="max-w-[760px]">
        <h1 className="m-0 mb-4 font-sans text-[32px] leading-[1.12] font-semibold tracking-[-0.02em] sm:text-[40px] sm:leading-[1.1] lg:text-[52px] lg:leading-[1.08] lg:tracking-[-0.03em]">
          {HERO_TITLE}
        </h1>
        <p className="m-0 font-sans text-base leading-[1.6] text-[#8f97a1] sm:text-[19px]">
          {HERO_SUBHEAD}
        </p>
      </div>

      {paused ? (
        <button
          type="button"
          onClick={onResume}
          title="Continue the auto loop"
          className={`${CONTROL_CLASS} border-[#22d3ee] bg-[rgb(34_211_238_/_0.08)] text-[#22d3ee] transition-colors hover:bg-[rgb(34_211_238_/_0.18)]`}
        >
          <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center text-[15px] leading-none">
            ↺
          </span>
          Resume
        </button>
      ) : (
        <button
          type="button"
          onClick={onPause}
          title="Pause the auto loop"
          className={`${CONTROL_CLASS} group border-[#1e2228] bg-[#0b0d10] text-[#8b929c] transition-colors hover:text-[#c6cdd6]`}
        >
          <svg
            width="108"
            height="34"
            viewBox="0 0 108 34"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <rect
              x="0.5"
              y="0.5"
              width="107"
              height="33"
              rx="6"
              stroke="#22d3ee"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="80 190"
              className="animate-[borderRun_2.26s_linear_infinite] motion-reduce:animate-none"
            />
          </svg>
          <svg
            width="10"
            height="12"
            viewBox="0 0 10 12"
            fill="currentColor"
            aria-hidden="true"
            className="relative text-[#8b929c] transition-colors duration-150 group-hover:text-[#b4bcc6]"
          >
            <rect x="0" y="0" width="3" height="12" rx="0.5" />
            <rect x="7" y="0" width="3" height="12" rx="0.5" />
          </svg>
          <span className="relative">Auto loop</span>
        </button>
      )}
    </div>
  );
}
