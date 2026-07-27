import { BRAND_NAME, BRAND_ROLE } from "../showcase-page.data";

export function HeaderBar() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#1e2228] bg-[#0b0d10] px-5 py-4 sm:px-14 sm:py-[18px]">
      <div className="flex items-center gap-3">
        <span className="h-[7px] w-[7px] shrink-0 animate-[pulseDot_2s_ease-in-out_infinite] rounded-full bg-[#22d3ee] motion-reduce:animate-none" />
        <span className="text-[11px] tracking-[0.16em] text-[#9aa2ad] uppercase sm:text-xs">
          {BRAND_NAME} / {BRAND_ROLE}
        </span>
      </div>
    </div>
  );
}
