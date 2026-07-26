import { BRAND_NAME, BRAND_ROLE } from "../showcase-page.data";

interface HeaderBarProps {
  driving: boolean;
  onResume: () => void;
}

export function HeaderBar({ driving, onResume }: HeaderBarProps) {
  const statusLine = driving ? "manual · you're driving" : "auto loop";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#1e2228] bg-[#0b0d10] px-5 py-4 sm:px-14 sm:py-[18px]">
      <div className="flex items-center gap-3">
        <span className="h-[7px] w-[7px] shrink-0 animate-[pulseDot_2s_ease-in-out_infinite] rounded-full bg-[#22d3ee] motion-reduce:animate-none" />
        <span className="text-[11px] tracking-[0.16em] text-[#9aa2ad] uppercase sm:text-xs">
          {BRAND_NAME} / {BRAND_ROLE}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {driving ? (
          <button
            type="button"
            onClick={onResume}
            className="cursor-pointer rounded-[5px] border border-[#2a3038] bg-[#101318] px-3 py-[7px] font-mono text-[11px] tracking-[0.12em] text-[#9aa2ad] uppercase transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee]"
          >
            ↺ Resume auto
          </button>
        ) : null}
        <span className="hidden text-xs tracking-[0.14em] text-[#565d66] uppercase sm:inline">
          {statusLine}
        </span>
      </div>
    </div>
  );
}
