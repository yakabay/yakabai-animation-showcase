import { motion } from "motion/react";

import { FOOTER_CREDIT, FOOTER_EMAIL_HREF, FOOTER_LINKEDIN_HREF } from "../showcase-page.data";
import { fadeUpInView, stagger } from "../showcase-page.motion";

export function SiteFooter() {
  return (
    <div className="flex flex-col items-center gap-6 border-t border-[#1e2228] bg-[#0b0d10] px-5 py-8 sm:flex-row sm:justify-between sm:gap-8 sm:px-14">
      <motion.span
        className="font-sans text-sm text-[#c6cdd6] sm:text-base"
        {...fadeUpInView}
      >
        {FOOTER_CREDIT}
      </motion.span>
      <motion.div
        className="flex gap-2.5"
        {...fadeUpInView}
        transition={stagger(0.08)}
      >
        <a
          href={FOOTER_EMAIL_HREF}
          className="rounded-[5px] border border-[#2a3038] px-[18px] py-2.5 text-xs tracking-[0.12em] text-[#c6cdd6]"
        >
          EMAIL →
        </a>
        <a
          href={FOOTER_LINKEDIN_HREF}
          target="_blank"
          rel="noreferrer"
          className="rounded-[5px] border border-[#22d3ee] px-[18px] py-2.5 text-xs tracking-[0.12em] text-[#22d3ee]"
        >
          LINKEDIN →
        </a>
      </motion.div>
    </div>
  );
}
