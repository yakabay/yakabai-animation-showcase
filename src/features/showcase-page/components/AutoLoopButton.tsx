interface AutoLoopButtonProps {
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
}

const CONTROL_CLASS =
  "relative flex h-[34px] w-[108px] shrink-0 cursor-pointer items-center self-end rounded-md border p-0 font-mono text-[11px] tracking-[0.14em] uppercase";

const ICON_SLOT_CLASS =
  "flex h-full w-[28px] shrink-0 items-center justify-center self-stretch";

const LABEL_CLASS = "relative min-w-0 flex-1 pr-1 text-center";

export function AutoLoopButton({ paused, onPause, onResume }: AutoLoopButtonProps) {
  if (paused) {
    return (
      <button
        type="button"
        onClick={onResume}
        title="Continue the auto loop"
        className={`${CONTROL_CLASS} border-[#22d3ee] bg-[rgb(34_211_238_/_0.08)] text-[#22d3ee] transition-colors hover:bg-[rgb(34_211_238_/_0.18)]`}
      >
        <span className={ICON_SLOT_CLASS}>
          <span className="flex h-[18px] ml-1 w-[18px] -translate-y-0.5 items-center justify-center text-[18px] leading-none">
            ↺
          </span>
        </span>
        <span className={`${LABEL_CLASS} mr-2`}>Resume</span>
      </button>
    );
  }

  return (
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
      <span className={ICON_SLOT_CLASS}>
        <svg
          width="8"
          height="10"
          viewBox="0 0 10 12"
          fill="currentColor"
          aria-hidden="true"
          className="text-[#8b929c] transition-colors duration-150 group-hover:text-[#b4bcc6]"
        >
          <rect x="0" y="0" width="3" height="12" rx="0.5" />
          <rect x="7" y="0" width="3" height="12" rx="0.5" />
        </svg>
      </span>
      <span className={LABEL_CLASS}>Auto loop</span>
    </button>
  );
}
