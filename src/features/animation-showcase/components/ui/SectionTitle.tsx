import type { ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/cn";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-4 text-center text-3xl text-white lg:mb-6 lg:text-4xl xl:text-5xl",
        className
      )}
    >
      {children}
    </motion.h2>
  );
}
