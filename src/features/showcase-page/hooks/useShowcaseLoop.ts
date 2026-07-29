import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import {
  allClipsReady,
  bayFocusForStep,
  bayIndexForClip,
  beatsFor,
  createInitialClipReady,
  cupPhaseAfterTrigger,
  cupPhaseForStep,
  durationFor,
  isTriggerLegal,
  runningState,
  settledState,
  type CupPhase,
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
  /** True when autoplay is paused (manual / Pause). */
  driving: boolean;
  bayFocus: number;
  stepState: StepState;
  /** Bay whose reset button is lit during a manual single-clip reset. */
  manualResetClip: ClipKey | null;
  requestTrigger: (key: ClipKey, trigger: ClipTrigger) => void;
  notifyClipReady: (key: ClipKey) => void;
  notifyClipSignal: (key: ClipKey, signal: string) => void;
  pause: () => void;
  resume: () => void;
}

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
  const [cupPhase, setCupPhase] = useState<CupPhase>("scene1");
  const [manualResetClip, setManualResetClip] = useState<ClipKey | null>(null);

  const stepStateRef = useRef(stepState);
  const cupPhaseRef = useRef(cupPhase);
  const manualResetClipRef = useRef<ClipKey | null>(null);
  const clipsReadyRef = useRef(createInitialClipReady());
  const drivingRef = useRef(false);
  const reducedMotionRef = useRef(reducedMotion);
  const enabledRef = useRef(enabled);
  const mountedRef = useRef(true);
  const storyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoGenRef = useRef(0);
  const refsRef = useRef({ court: courtRef, card: cardRef, cup: cupRef });

  refsRef.current = { court: courtRef, card: cardRef, cup: cupRef };
  reducedMotionRef.current = reducedMotion;
  enabledRef.current = enabled;
  stepStateRef.current = stepState;
  cupPhaseRef.current = cupPhase;
  manualResetClipRef.current = manualResetClip;

  const clearStoryTimer = useCallback(() => {
    if (storyTimerRef.current) {
      clearTimeout(storyTimerRef.current);
      storyTimerRef.current = null;
    }
  }, []);

  const setStep = useCallback((state: StepState) => {
    if (statesEqual(stepStateRef.current, state)) return;
    stepStateRef.current = state;
    setStepState(state);
  }, []);

  const bumpCupPhaseForStep = useCallback((step: StoryStep) => {
    const next = cupPhaseForStep(step);
    if (!next) return;
    cupPhaseRef.current = next;
    setCupPhase(next);
  }, []);

  const scheduleAutoplayRef = useRef<() => void>(() => {});

  const settleStory = useCallback(
    (step: StoryStep) => {
      const current = stepStateRef.current;
      if (current.step !== step || !current.running) return;
      setStep(settledState(step));
      if (!drivingRef.current && enabledRef.current) {
        scheduleAutoplayRef.current();
      }
    },
    [setStep]
  );

  const clearManualReset = useCallback(() => {
    if (manualResetClipRef.current === null) return;
    manualResetClipRef.current = null;
    setManualResetClip(null);
  }, []);

  const enterStep = useCallback(
    (step: StoryStep) => {
      const duration = reducedMotionRef.current ? 0 : durationFor(step);
      clearStoryTimer();
      clearManualReset();

      const running = runningState(step);
      setStep(running);
      setBayFocus(bayFocusForStep(running));
      bumpCupPhaseForStep(step);

      for (const beat of beatsFor(step)) {
        refsRef.current[beat.clip].current?.fire(beat.trigger);
      }

      storyTimerRef.current = setTimeout(() => {
        storyTimerRef.current = null;
        if (mountedRef.current) settleStory(step);
      }, duration);
    },
    [
      bumpCupPhaseForStep,
      clearManualReset,
      clearStoryTimer,
      setStep,
      settleStory,
    ]
  );

  /** Manual reset: finish only this clip. Autoplay `reset` still hits all three. */
  const enterClipReset = useCallback(
    (clip: ClipKey) => {
      const duration = reducedMotionRef.current ? 0 : durationFor("reset");
      clearStoryTimer();

      const current = stepStateRef.current;
      if (current.running) {
        setStep(settledState(current.step));
      }

      manualResetClipRef.current = clip;
      setManualResetClip(clip);
      setBayFocus(bayIndexForClip(clip));

      refsRef.current[clip].current?.fire("finish");

      if (clip === "cup") {
        const next = cupPhaseAfterTrigger("finish");
        cupPhaseRef.current = next;
        setCupPhase(next);
      }

      storyTimerRef.current = setTimeout(() => {
        storyTimerRef.current = null;
        if (!mountedRef.current) return;
        clearManualReset();
      }, duration);
    },
    [clearManualReset, clearStoryTimer, setStep]
  );

  const stopAutoplay = useCallback(() => {
    autoGenRef.current += 1;
    drivingRef.current = true;
    setDriving(true);
  }, []);

  const scheduleAutoplay = useCallback(() => {
    if (drivingRef.current || !enabledRef.current || !mountedRef.current) return;

    const gen = ++autoGenRef.current;

    const stillAuto = () =>
      autoGenRef.current === gen &&
      !drivingRef.current &&
      enabledRef.current &&
      mountedRef.current;

    const delay = (ms: number, fn: () => void) => {
      setTimeout(() => {
        if (stillAuto()) fn();
      }, ms);
    };

    const state = stepStateRef.current;

    if (state.running) return;

    if (state.step === "boot" && !allClipsReady(clipsReadyRef.current)) {
      return;
    }

    if (state.step === "reset") {
      delay(reducedMotionRef.current ? 0 : CYCLE_TAIL_MS, () => {
        if (!stillAuto()) return;
        if (stepStateRef.current.step !== "reset" || stepStateRef.current.running) {
          return;
        }
        enterStep("boot");
      });
      return;
    }

    delay(0, () => {
      if (!stillAuto()) return;
      const current = stepStateRef.current;
      if (current.running || current.step !== state.step) return;
      enterStep(nextStoryStep(current.step));
    });
  }, [enterStep]);

  scheduleAutoplayRef.current = scheduleAutoplay;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearStoryTimer();
      autoGenRef.current += 1;
    };
  }, [clearStoryTimer]);

  useEffect(() => {
    if (!enabled) {
      autoGenRef.current += 1;
      return;
    }
    if (drivingRef.current) return;
    scheduleAutoplayRef.current();
  }, [enabled]);

  const requestTrigger = useCallback(
    (key: ClipKey, trigger: ClipTrigger) => {
      stopAutoplay();

      if (!isTriggerLegal(key, trigger, cupPhaseRef.current)) {
        return;
      }

      if (trigger === "finish") {
        enterClipReset(key);
        return;
      }

      const step = CLICK_TO_STEP[key][trigger];
      if (!step) return;
      enterStep(step);
    },
    [enterClipReset, enterStep, stopAutoplay]
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
      if (!current.running) return;
      for (const [step, name] of Object.entries(terminals) as Array<
        [StoryStep, string]
      >) {
        if (name !== signal || current.step !== step) continue;
        clearStoryTimer();
        settleStory(step);
        return;
      }
    },
    [clearStoryTimer, settleStory]
  );

  const pause = useCallback(() => {
    stopAutoplay();
  }, [stopAutoplay]);

  const resume = useCallback(() => {
    autoGenRef.current += 1;
    drivingRef.current = false;
    setDriving(false);
    setBayFocus(bayFocusForStep(stepStateRef.current));
    scheduleAutoplay();
  }, [scheduleAutoplay]);

  return {
    driving,
    bayFocus,
    stepState,
    manualResetClip,
    requestTrigger,
    notifyClipReady,
    notifyClipSignal,
    pause,
    resume,
  };
}
