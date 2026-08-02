import { motion } from "motion/react";

import { BUILD_DECISIONS } from "../showcase-page.data";
import { fadeUpInViewSlow, stagger } from "../showcase-page.motion";

export function BuildDecisions() {
  return (
    <div className="border-b border-[#1e2228] px-5 py-10 sm:border-r sm:border-b-0 sm:px-14">
      <motion.div
        className="mb-6 text-[11px] tracking-[0.18em] text-[#8b929c] uppercase"
        {...fadeUpInViewSlow}
        transition={stagger(0, 0.75)}
      >
        Build decisions
      </motion.div>
      <div className="flex flex-col gap-5">
        {BUILD_DECISIONS.map((decision, index) => (
          <motion.div
            key={decision.title}
            {...fadeUpInViewSlow}
            transition={stagger(0.14 * (index + 1), 0.85)}
          >
            <div className="mb-1.5 font-sans text-base font-semibold text-[#e6e8ea]">
              {decision.title}
            </div>
            <div className="font-sans text-sm leading-[1.55] text-[#8f97a1]">
              {decision.body}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
