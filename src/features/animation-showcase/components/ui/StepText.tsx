import type { ReactNode } from "react";
import { motion } from "motion/react";

interface StepDescriptionProps {
  children: ReactNode;
  descriptionKey: string;
}

export function StepDescription({
  children,
  descriptionKey,
}: StepDescriptionProps) {
  return (
    <p
      key={descriptionKey}
      className="step-fade-slide absolute inset-x-0 top-1/2 w-full -translate-y-1/2 text-lg font-medium text-white sm:text-xl lg:text-2xl xl:text-3xl"
    >
      {children}
    </p>
  );
}

interface StepCounterProps {
  current: number;
  total: number;
}

export function StepCounter({ current, total }: StepCounterProps) {
  return (
    <motion.div
      className="mt-4 text-center text-slate-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <span className="text-cyan-400">{current}</span> / {total}
    </motion.div>
  );
}
