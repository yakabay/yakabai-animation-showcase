import { type MotionProps } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Soft fade-up for text blocks — short, low travel, not flashy. */
export const fadeUp: MotionProps = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease },
};

export const fadeUpInView: MotionProps = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.45, ease },
};

/** Slower reveal for Build decisions — staggered on scroll. */
export const fadeUpInViewSlow: MotionProps = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.85, ease },
};

export function stagger(
  delay: number,
  duration = 0.45
): MotionProps["transition"] {
  return { duration, delay, ease };
}
