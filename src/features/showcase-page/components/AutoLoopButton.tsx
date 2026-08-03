interface AutoLoopButtonProps {
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
  /** Cyan lift shadow while the control is sticky (“flying”). */
  elevated?: boolean;
}

const CONTROL_CLASS =
  "relative flex h-[34px] w-[108px] shrink-0 cursor-pointer items-center rounded-md border p-0 font-mono text-[11px] tracking-[0.14em] uppercase transition-[box-shadow,colors,background-color] duration-200 ease-out";

const ELEVATED_SHADOW =
  "shadow-[0_6px_16px_rgb(34_211_238_/_0.32),0_1px_5px_rgb(34_211_238_/_0.2)]";

const PAUSED_ICON_SLOT_CLASS =
  "flex h-full w-[28px] shrink-0 items-center justify-center self-stretch";

const PAUSED_LABEL_CLASS = "relative min-w-0 flex-1 pr-1 text-center";

export function AutoLoopButton({
  paused,
  onPause,
  onResume,
  elevated = false,
}: AutoLoopButtonProps) {
  if (paused) {
    return (
      <button
        type="button"
        onClick={onResume}
        title="Continue the auto loop"
        className={`${CONTROL_CLASS} border-[#22d3ee] bg-[#0b0d10] text-[#22d3ee] hover:bg-[#101820] ${elevated ? ELEVATED_SHADOW : "shadow-none"}`}
      >
        <span className={PAUSED_ICON_SLOT_CLASS}>
          <span className="flex h-[18px] ml-1 w-[18px] translate-x-0.5 -translate-y-px items-center justify-center text-[18px] leading-none">
            ↺
          </span>
        </span>
        <span className={`${PAUSED_LABEL_CLASS} mr-2`}>Resume</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onPause}
      title="Pause the auto loop"
      className={`${CONTROL_CLASS} group justify-center border-[#1e2228] bg-[#0b0d10] text-[#8b929c] hover:text-[#c6cdd6] ${elevated ? ELEVATED_SHADOW : "shadow-none"}`}
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
      <span className="absolute left-0 flex h-full w-[28px] items-center justify-center opacity-0 scale-50 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-100 motion-reduce:transition-none">
        <svg
          width="8"
          height="10"
          viewBox="0 0 10 12"
          fill="currentColor"
          aria-hidden="true"
          className="text-[#8b929c] transition-colors duration-150 ease-out group-hover:text-[#b4bcc6]"
        >
          <rect x="0" y="0" width="3" height="12" rx="0.5" />
          <rect x="7" y="0" width="3" height="12" rx="0.5" />
        </svg>
      </span>
      <span className="relative w-full text-center transition-all duration-150 ease-out group-hover:translate-x-[12px] group-hover:pr-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:pr-0">
        Auto loop
      </span>
    </button>
  );
}
