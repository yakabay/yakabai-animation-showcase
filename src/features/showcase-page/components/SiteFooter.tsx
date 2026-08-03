import { motion } from "motion/react";

import {
  FOOTER_CREDIT_NAME,
  FOOTER_CREDIT_PREFIX,
  FOOTER_EMAIL_HREF,
  FOOTER_LINKEDIN_HREF,
  FOOTER_STACK,
} from "../showcase-page.data";
import { fadeUpInView, stagger } from "../showcase-page.motion";

function ExternalArrow() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      <path
        d="M3.2 8.8 8.8 3.2M4.4 3.2h4.4v4.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="z-30 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] bg-[#0b0d10] px-5 py-[18px] sm:px-7 lg:flex-row">
      <motion.span
        className="text-center text-[13px] text-[#94a3b8] lg:text-left lg:whitespace-nowrap"
        {...fadeUpInView}
      >
        {FOOTER_CREDIT_PREFIX}{" "}
        <span className="font-medium text-[#e2e8f0]">{FOOTER_CREDIT_NAME}</span>
      </motion.span>

      <motion.span
        className="text-center font-mono text-[10px] tracking-[0.06em] text-[#475569] sm:text-[11px] lg:whitespace-nowrap"
        {...fadeUpInView}
        transition={stagger(0.06)}
      >
        {FOOTER_STACK.join(" · ")}
      </motion.span>

      <motion.div
        className="flex items-center gap-[18px]"
        {...fadeUpInView}
        transition={stagger(0.12)}
      >
        <a
          href={FOOTER_LINKEDIN_HREF}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#22d3ee] transition-colors hover:text-[#67e8f9]"
        >
          LinkedIn
          <ExternalArrow />
        </a>
        <a
          href={FOOTER_EMAIL_HREF}
          className="whitespace-nowrap rounded-[5px] bg-[#22d3ee] px-3.5 py-2 text-[13px] font-bold tracking-[-0.005em] text-[#08090b] transition-colors hover:bg-[#67e8f9] sm:px-5 sm:py-2.5"
        >
          Get in touch
        </a>
      </motion.div>
    </footer>
  );
}
