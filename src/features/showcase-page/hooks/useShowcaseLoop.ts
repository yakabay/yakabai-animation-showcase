import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import {
  allClipsReady,
  bayFocusForStep,
  beatsFor,
  createInitialClipReady,
  durationFor,
  isStepRunning,
  isStepSettled,
  isTriggerLegal,
  runningState,
  settledState,
} from "../clip-state";
import {
  BOOT_STATE,
  CLIP_TERMINAL_SIGNALS,
  CYCLE_TAIL_MS,
  CLICK_TO_STEP,
  nextStoryStep,
  statesEqual,
  type ClipKey,
  type ClipTrigger,
  type StepState,
  type StoryStep,
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
  driving: boolean;
  /** 0 = court, 1 = card, 2 = cup, -1 = no tint. */
  bayFocus: number;
  stepState: StepState;
  requestTrigger: (key: ClipKey, trigger: ClipTrigger) => void;
  notifyClipReady: (key: ClipKey) => void;
  notifyClipSignal: (key: ClipKey, signal: string) => void;
  pause: () => void;
  resume: () => void;
}

type StateWaiter = {
  until: StepState;
  resolve: () => void;
};

export function useShowcaseLoop({
  courtRef,
  cardRef,
  cupRef,
  enabled,
  reducedMotion,
}: UseShowcaseLoopProps): UseShowcaseLoopReturn {
  const [stepState, setStepState] = useState<StepState>(BOOT_STATE);
  const [driving, setDriving] = useState(false);
  const [bayFocus, setBayFocus] = useState(0);

  const stepStateRef = useRef(stepState);
  const clipsReadyRef = useRef(createInitialClipReady());
  const drivingRef = useRef(false);
  const reducedMotionRef = useRef(reducedMotion);
  const mountedRef = useRef(true);
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitersRef = useRef<StateWaiter[]>([]);
  const planGenRef = useRef(0);
  const refsRef = useRef({ court: courtRef, card: cardRef, cup: cupRef });
  const runAutoplayRef = useRef<() => void>(() => {});

  refsRef.current = { court: courtRef, card: cardRef, cup: cupRef };
  reducedMotionRef.current = reducedMotion;
  stepStateRef.current = stepState;

  const setStep = useCallback((state: StepState) => {
    if (statesEqual(stepStateRef.current, state)) return;
    stepStateRef.current = state;
    setStepState(state);
  }, []);

  const clearSchedulerTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      if (mountedRef.current) fn();
    }, ms);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const clearSettleTimer = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const clearAllWaiters = useCallback(() => {
    waitersRef.current = [];
  }, []);

  const resolveWaiters = useCallback((state: StepState) => {
    const remaining: StateWaiter[] = [];
    for (const waiter of waitersRef.current) {
      if (statesEqual(waiter.until, state)) waiter.resolve();
      else remaining.push(waiter);
    }
    waitersRef.current = remaining;
  }, []);

  const waitForState = useCallback((until: StepState) => {
    if (statesEqual(stepStateRef.current, until)) return Promise.resolve();
    return new Promise<void>((resolve) => {
      waitersRef.current.push({ until, resolve });
    });
  }, []);

  const settleStep = useCallback(
    (step: StoryStep) => {
      clearSettleTimer();
      const current = stepStateRef.current;
      if (current.step !== step || !current.running) return;
      const settled = settledState(step);
      setStep(settled);
      resolveWaiters(settled);
    },
    [clearSettleTimer, resolveWaiters, setStep]
  );

  const enterStep = useCallback(
    (step: StoryStep) => {
      const duration = reducedMotionRef.current ? 0 : durationFor(step);
      clearSettleTimer();
      const running = runningState(step);
      setStep(running);
      setBayFocus(bayFocusForStep(running));

      for (const beat of beatsFor(step)) {
        refsRef.current[beat.clip].current?.fire(beat.trigger);
      }

      settleTimerRef.current = setTimeout(() => {
        settleTimerRef.current = null;
        if (mountedRef.current) settleStep(step);
      }, duration);
    },
    [clearSettleTimer, settleStep, setStep]
  );

  const takeManualControl = useCallback(() => {
    planGenRef.current += 1;
    clearSchedulerTimers();
    clearAllWaiters();
    drivingRef.current = true;
    setDriving(true);
  }, [clearAllWaiters, clearSchedulerTimers]);

  const runAutoplay = useCallback(async () => {
    if (drivingRef.current || !mountedRef.current) return;
    const gen = planGenRef.current;

    const stillActive = () =>
      !drivingRef.current && planGenRef.current === gen && mountedRef.current;

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        later(resolve, ms);
      });

    while (stillActive()) {
      const state = stepStateRef.current;

      if (isStepRunning(state)) {
        await waitForState(settledState(state.step));
        if (!stillActive()) return;
        continue;
      }

      if (!isStepSettled(state)) return;

      // First load: wait until clips are ready, then run the boot pause.
      if (state.step === "boot" && !allClipsReady(clipsReadyRef.current)) {
        await waitForState(runningState("boot"));
        if (!stillActive()) return;
        continue;
      }

      if (state.step === "reset") {
        await delay(reducedMotionRef.current ? 0 : CYCLE_TAIL_MS);
        if (!stillActive()) return;
        if (!statesEqual(stepStateRef.current, settledState("reset"))) continue;
        enterStep("boot");
        continue;
      }

      enterStep(nextStoryStep(state.step));
    }
  }, [enterStep, later, waitForState]);

  runAutoplayRef.current = () => {
    void runAutoplay();
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearSchedulerTimers();
      clearSettleTimer();
      clearAllWaiters();
    };
  }, [clearAllWaiters, clearSchedulerTimers, clearSettleTimer]);

  useEffect(() => {
    if (!enabled) {
      planGenRef.current += 1;
      clearSchedulerTimers();
      clearAllWaiters();
      return;
    }
    if (drivingRef.current) return;

    const gen = ++planGenRef.current;
    clearSchedulerTimers();
    clearAllWaiters();

    const timer = setTimeout(() => {
      if (planGenRef.current !== gen || drivingRef.current || !mountedRef.current) {
        return;
      }
      void runAutoplayRef.current();
    }, 0);

    return () => {
      clearTimeout(timer);
      if (planGenRef.current === gen) {
        planGenRef.current += 1;
      }
      clearSchedulerTimers();
      clearAllWaiters();
    };
  }, [enabled, clearSchedulerTimers, clearAllWaiters]);

  const requestTrigger = useCallback(
    (key: ClipKey, trigger: ClipTrigger) => {
      takeManualControl();
      if (!isTriggerLegal(key, trigger, stepStateRef.current)) return;
      const step = CLICK_TO_STEP[key][trigger];
      if (!step) return;
      enterStep(step);
    },
    [enterStep, takeManualControl]
  );

  const notifyClipReady = useCallback(
    (key: ClipKey) => {
      if (clipsReadyRef.current[key]) return;
      clipsReadyRef.current = { ...clipsReadyRef.current, [key]: true };
      if (!allClipsReady(clipsReadyRef.current)) return;
      const current = stepStateRef.current;
      if (current.step !== "boot" || current.running) return;
      enterStep("boot");
    },
    [enterStep]
  );

  const notifyClipSignal = useCallback(
    (key: ClipKey, signal: string) => {
      const terminals = CLIP_TERMINAL_SIGNALS[key];
      if (!terminals) return;
      const current = stepStateRef.current;
      if (!isStepRunning(current)) return;
      for (const [step, name] of Object.entries(terminals) as Array<
        [StoryStep, string]
      >) {
        if (name !== signal || current.step !== step) continue;
        settleStep(step);
        return;
      }
    },
    [settleStep]
  );

  const pause = useCallback(() => {
    takeManualControl();
  }, [takeManualControl]);

  const resume = useCallback(() => {
    planGenRef.current += 1;
    clearSchedulerTimers();
    clearAllWaiters();
    drivingRef.current = false;
    setDriving(false);
    setBayFocus(bayFocusForStep(stepStateRef.current));
    later(() => runAutoplayRef.current(), 80);
  }, [clearAllWaiters, clearSchedulerTimers, later]);

  return {
    driving,
    bayFocus,
    stepState,
    requestTrigger,
    notifyClipReady,
    notifyClipSignal,
    pause,
    resume,
  };
}
