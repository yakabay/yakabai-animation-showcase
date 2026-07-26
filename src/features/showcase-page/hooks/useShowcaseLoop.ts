import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import {
  CLIP_SEQUENCE,
  CYCLE_MS,
  JUMP_STAGGER_MS,
  PHASE_JUMP,
  PHASE_SCHEDULE,
  type ClipKey,
  type ClipTrigger,
} from "../showcase-page.data";

interface RiveRef {
  fire: (trigger: string) => void;
}

interface UseShowcaseLoopProps {
  courtRef: RefObject<RiveRef | null>;
  cardRef: RefObject<RiveRef | null>;
  cupRef: RefObject<RiveRef | null>;
  enabled: boolean;
  reducedMotion: boolean;
}

interface UseShowcaseLoopReturn {
  phase: number;
  driving: boolean;
  lastFired: string;
  fireManual: (key: ClipKey, trigger: ClipTrigger) => void;
  goToPhase: (phase: number) => void;
  resume: () => void;
}

export function useShowcaseLoop({
  courtRef,
  cardRef,
  cupRef,
  enabled,
  reducedMotion,
}: UseShowcaseLoopProps): UseShowcaseLoopReturn {
  const [phase, setPhase] = useState(0);
  const [driving, setDriving] = useState(false);
  const [lastFired, setLastFired] = useState("—");

  const drivingRef = useRef(false);
  const reducedMotionRef = useRef(reducedMotion);
  const mountedRef = useRef(true);
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const refsRef = useRef({ court: courtRef, card: cardRef, cup: cupRef });
  refsRef.current = { court: courtRef, card: cardRef, cup: cupRef };
  reducedMotionRef.current = reducedMotion;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      if (mountedRef.current) fn();
    }, ms);
    timersRef.current.add(timer);
  }, []);

  const fire = useCallback((key: ClipKey, trigger: ClipTrigger) => {
    refsRef.current[key].current?.fire(trigger);
  }, []);

  const cycle = useCallback(() => {
    if (drivingRef.current) return;
    (Object.keys(CLIP_SEQUENCE) as ClipKey[]).forEach((key) => {
      CLIP_SEQUENCE[key].forEach(([at, trigger]) => later(() => fire(key, trigger), at));
    });
    PHASE_SCHEDULE.forEach(([at, nextPhase]) => later(() => setPhase(nextPhase), at));
    later(cycle, CYCLE_MS);
  }, [fire, later]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  // Autoplay runs whenever the tab is visible and nobody is driving manually.
  // Stopping only clears pending timers — it resumes from the same phase.
  useEffect(() => {
    clearTimers();
    if (enabled && !drivingRef.current) cycle();
    return clearTimers;
  }, [enabled, cycle, clearTimers]);

  const fireManual = useCallback(
    (key: ClipKey, trigger: ClipTrigger) => {
      clearTimers();
      drivingRef.current = true;
      setDriving(true);
      fire(key, trigger);
      setLastFired(`${key}.riv → ${trigger}`);
    },
    [clearTimers, fire]
  );

  const goToPhase = useCallback(
    (targetPhase: number) => {
      clearTimers();
      drivingRef.current = true;
      setDriving(true);
      setPhase(targetPhase);

      const jumps = PHASE_JUMP[targetPhase] ?? [];
      const stagger = reducedMotionRef.current ? 0 : JUMP_STAGGER_MS;
      jumps.forEach(([key, trigger], index) => {
        later(() => fire(key, trigger), index * stagger);
      });

      const lastJump = jumps[jumps.length - 1];
      if (lastJump) setLastFired(`${lastJump[0]}.riv → ${lastJump[1]}`);
    },
    [clearTimers, fire, later]
  );

  const resume = useCallback(() => {
    clearTimers();
    drivingRef.current = false;
    setDriving(false);
    setPhase(0);
    (["court", "card", "cup"] as ClipKey[]).forEach((key) => fire(key, "finish"));
    later(cycle, 320);
  }, [clearTimers, fire, later, cycle]);

  return { phase, driving, lastFired, fireManual, goToPhase, resume };
}
