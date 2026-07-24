import { motion, useReducedMotion } from "motion/react";

// Ambient background blob - cyan, top-left corner
export function BackgroundBlobCyan() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-cyan-500/7 blur-3xl sm:h-[400px] sm:w-[400px] lg:h-[600px] lg:w-[600px]"
      style={{ willChange: shouldReduceMotion ? "auto" : "transform" }}
      animate={
        shouldReduceMotion
          ? {}
          : {
              x: [0, 90, 0],
              y: [0, 125, 0],
              scale: [1, 1.15, 1],
            }
      }
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Ambient background blob - emerald, bottom-right corner
export function BackgroundBlobEmerald() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute right-0 bottom-0 h-[250px] w-[250px] rounded-full bg-emerald-500/7 blur-3xl sm:h-[350px] sm:w-[350px] lg:h-[500px] lg:w-[500px]"
      style={{ willChange: shouldReduceMotion ? "auto" : "transform" }}
      animate={
        shouldReduceMotion
          ? {}
          : {
              x: [0, -70, 0],
              y: [0, -90, 0],
              scale: [1, 1.12, 1],
            }
      }
      transition={{
        duration: 17,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
    />
  );
}

// Ambient background blob - purple, center, rotating
export function BackgroundBlobPurple() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/4 blur-3xl sm:h-[500px] sm:w-[500px] lg:h-[700px] lg:w-[700px]"
      style={{ willChange: shouldReduceMotion ? "auto" : "transform" }}
      animate={
        shouldReduceMotion
          ? {}
          : {
              scale: [1, 1.22, 1],
              rotate: [0, 180, 360],
            }
      }
      transition={{
        duration: 27,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
