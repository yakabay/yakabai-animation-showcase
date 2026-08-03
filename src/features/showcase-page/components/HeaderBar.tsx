import { BRAND_NAME, BRAND_ROLE } from "../showcase-page.data";
import { BrandMark } from "./BrandMark";

export function HeaderBar() {
  return (
    <header className="z-30 flex items-center justify-between gap-4 border-b border-white/[0.07] bg-[#0b0d10] px-5 py-3.5 sm:px-8 sm:py-6">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <BrandMark className="block size-[30px] shrink-0 sm:size-[34px]" />
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="whitespace-nowrap text-base font-semibold tracking-[-0.01em] text-white">
            {BRAND_NAME}
          </span>
          <span className="whitespace-nowrap text-xs leading-snug text-[#94a3b8] sm:text-[13px]">
            {BRAND_ROLE}
          </span>
        </div>
      </div>
    </header>
  );
}
