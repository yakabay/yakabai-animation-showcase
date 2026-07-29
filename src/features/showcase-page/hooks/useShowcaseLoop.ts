import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import {
  allClipsReady,
  bayFocusForStep,
  bayIndexForClip,
  beatsFor,
  createInitialClipReady,
  courtPhaseAfterTrigger,
  courtPhaseForStep,
  cupPhaseAfterTrigger,
  cupPhaseForStep,
  durationFor,
  isTriggerLegal,
  runningState,
  settledState,
  type ClipPhases,
  type CourtPhase,
  type CupPhase,
} from "./useShowcaseLoop.utils";
import {
  BOOT_STATE,
  CYCLE_TAIL_MS,
  SCENE_TO_STEP,
} from "../showcase-page.data";
import { nextStoryStep, statesEqual } from "../showcase-page.utils";
import type { ClipKey, ClipTrigger, StepState, StoryStep } from "../showcase-page.types";

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
  paused: boolean;
  bayFocus: number;
  stepState: StepState;
  manualResetClip: ClipKey | null;
  requestTrigger: (key: ClipKey, trigger: ClipTrigger) => void;
  notifyClipReady: (key: ClipKey) => void;
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
  const [paused, setPaused] = useState(false);
  const [bayFocus, setBayFocus] = useState(0);
  const [courtPhase, setCourtPhase] = useState<CourtPhase>("scene1");
  const [cupPhase, setCupPhase] = useState<CupPhase>("scene1");
  const [manualResetClip, setManualResetClip] = useState<ClipKey | null>(null);

  const stepStateRef = useRef(stepState);
  const clipPhasesRef = useRef<ClipPhases>({ court: "scene1", cup: "scene1" });
  const manualResetClipRef = useRef<ClipKey | null>(null);
  const clipsReadyRef = useRef(createInitialClipReady());
  const pausedRef = useRef(false);
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
  clipPhasesRef.current = { court: courtPhase, cup: cupPhase };
  manualResetClipRef.current = manualResetClip;
  pausedRef.current = paused;

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

  const bumpClipPhasesForStep = useCallback((step: StoryStep) => {
    const nextCourt = courtPhaseForStep(step);
    const nextCup = cupPhaseForStep(step);
    const next = { ...clipPhasesRef.current };
    if (nextCourt) next.court = nextCourt;
    if (nextCup) next.cup = nextCup;
    clipPhasesRef.current = next;
    if (nextCourt) setCourtPhase(nextCourt);
    if (nextCup) setCupPhase(nextCup);
  }, []);

  const scheduleAutoplayRef = useRef<() => void>(() => {});

  const settleStory = useCallback(
    (step: StoryStep) => {
      const current = stepStateRef.current;
      if (current.step !== step || !current.running) return;
      setStep(settledState(step));
      if (!pausedRef.current && enabledRef.current) {
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
      bumpClipPhasesForStep(step);

      for (const beat of beatsFor(step)) {
        refsRef.current[beat.clip].current?.fire(beat.trigger);
      }

      storyTimerRef.current = setTimeout(() => {
        storyTimerRef.current = null;
        if (mountedRef.current) settleStory(step);
      }, duration);
    },
    [
      bumpClipPhasesForStep,
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

      const next = { ...clipPhasesRef.current };
      if (clip === "court") next.court = courtPhaseAfterTrigger("finish");
      if (clip === "cup") next.cup = cupPhaseAfterTrigger("finish");
      clipPhasesRef.current = next;
      if (clip === "court") setCourtPhase(next.court);
      if (clip === "cup") setCupPhase(next.cup);

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
    pausedRef.current = true;
    setPaused(true);
  }, []);

  const scheduleAutoplay = useCallback(() => {
    if (pausedRef.current || !enabledRef.current || !mountedRef.current) return;

    const gen = ++autoGenRef.current;

    const stillAuto = () =>
      autoGenRef.current === gen &&
      !pausedRef.current &&
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
    if (pausedRef.current) return;
    scheduleAutoplayRef.current();
  }, [enabled]);

  const requestTrigger = useCallback(
    (key: ClipKey, trigger: ClipTrigger) => {
      stopAutoplay();
      setBayFocus(bayIndexForClip(key));

      if (!isTriggerLegal(key, trigger, clipPhasesRef.current)) {
        return;
      }

      if (trigger === "finish") {
        enterClipReset(key);
        return;
      }

      const step = SCENE_TO_STEP[key][trigger];
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

  const pause = useCallback(() => {
    stopAutoplay();
  }, [stopAutoplay]);

  const resume = useCallback(() => {
    autoGenRef.current += 1;
    pausedRef.current = false;
    setPaused(false);
    setBayFocus(bayFocusForStep(stepStateRef.current));
    scheduleAutoplay();
  }, [scheduleAutoplay]);

  return {
    paused,
    bayFocus,
    stepState,
    manualResetClip,
    requestTrigger,
    notifyClipReady,
    pause,
    resume,
  };
}
