import { motion } from "motion/react";

import { HERO_SUBHEAD, HERO_TITLE } from "../showcase-page.data";
import { AutoLoopButton } from "./AutoLoopButton";

interface HeroProps {
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;
const titleWords = HERO_TITLE.split(" ");

export function Hero({ paused, onPause, onResume }: HeroProps) {
  return (
    <div className="flex flex-col gap-8 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12 sm:px-14 sm:py-16 sm:pb-10">
      <div className="max-w-[760px]">
        <h1 className="m-0 mb-4 font-sans text-[32px] leading-[1.12] font-semibold tracking-[-0.02em] sm:text-[40px] sm:leading-[1.1] lg:text-[52px] lg:leading-[1.08] lg:tracking-[-0.03em]">
          {titleWords.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="mr-[0.28em] inline-block last:mr-0"
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.65,
                delay: 0.06 + index * 0.08,
                ease,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="m-0 font-sans text-base leading-[1.6] text-[#8f97a1] sm:text-[19px]"
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            delay: 0.06 + titleWords.length * 0.08 + 0.12,
            ease,
          }}
        >
          {HERO_SUBHEAD}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.55,
          delay: 0.06 + titleWords.length * 0.08 + 0.28,
          ease,
        }}
      >
        <AutoLoopButton paused={paused} onPause={onPause} onResume={onResume} />
      </motion.div>
    </div>
  );
}
