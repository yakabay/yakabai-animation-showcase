import { type ReactNode, useRef } from "react";
import { motion } from "motion/react";

import { useStickyStuck } from "../hooks/useStickyStuck";
import { HERO_TITLE } from "../showcase-page.data";
import { useShowcaseStore } from "../store/showcase-store";
import { selectIsPaused } from "../store/showcase-store.selectors";
import { AutoLoopButton } from "./AutoLoopButton";

interface ClipBaysStageProps {
  children: ReactNode;
}

const ease = [0.22, 1, 0.36, 1] as const;
const titleWordCount = HERO_TITLE.split(" ").length;

/** Clip bays + their Auto loop control. Sticky on mobile while the stage is in view. */
export function ClipBaysStage({ children }: ClipBaysStageProps) {
  const paused = useShowcaseStore(selectIsPaused);
  const pause = useShowcaseStore((store) => store.pause);
  const resume = useShowcaseStore((store) => store.resume);
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const stuck = useStickyStuck(stickySentinelRef);

  return (
    <section>
      <div
        ref={stickySentinelRef}
        className="pointer-events-none h-px w-full sm:hidden"
        aria-hidden
      />

      <motion.div
        className="z-20 flex justify-end px-5 pb-6 max-sm:sticky max-sm:top-4 sm:px-14 sm:pb-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.55,
          delay: 0.06 + titleWordCount * 0.08 + 0.28,
          ease,
        }}
      >
        <AutoLoopButton
          paused={paused}
          onPause={pause}
          onResume={resume}
          elevated={stuck}
        />
      </motion.div>

      {children}
    </section>
  );
}
