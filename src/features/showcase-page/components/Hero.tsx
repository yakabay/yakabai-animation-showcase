import { HERO_SUBHEAD, HERO_TITLE } from "../showcase-page.data";

export function Hero() {
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
    </div>
  );
}
