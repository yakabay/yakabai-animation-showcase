import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface RiveRef {
  fire: (trigger: string) => void;
}

interface UseAutoPlayLoopProps {
  courtRef: RefObject<RiveRef | null>;
  cardRef: RefObject<RiveRef | null>;
  cupRef: RefObject<RiveRef | null>;
  enabled: boolean;
  manualNavTrigger?: number;
}

interface UseAutoPlayLoopReturn {
  state: number;
  setState: Dispatch<SetStateAction<number>>;
  currentStep: number;
}

// FSM state mapping (5 states: S0-S4)
// S0: Step 0 (Court)
// S1: Step 1 (Card)
// S2: Step 1 (Card), scene transition
// S3: Step 2 (Cup) + auto scene1
// S4: Step 2 (Cup), scene transition
const STATE_TO_STEP = [0, 1, 1, 2, 2];

// Timing for each state transition (in milliseconds)
const STATE_DURATIONS = [
  2500, // S0: Court initial display
  2500, // S1: Card initial display
  700, // S2: Card animated text display (before scene2)
  2500, // S3: Cup initial display
  2500, // S4: Cup animated text display
];

export function useAutoPlayLoop({
  courtRef,
  cardRef,
  cupRef,
  enabled,
  manualNavTrigger,
}: UseAutoPlayLoopProps): UseAutoPlayLoopReturn {
  const [state, setState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stateRef = useRef(0);
  const loopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Resume from the current state whenever the caller re-enables playback
  // (e.g. the tab becomes visible again); pause without resetting otherwise.
  useEffect(() => {
    setIsPlaying(enabled);
  }, [enabled]);

  const currentStep = STATE_TO_STEP[state] ?? 0;
  // Auto cup.scene1 when entering S3 (also re-fires on manual nav so the
  // freshly remounted cup plays its intro every time the user lands here).
  useEffect(() => {
    if (state === 3 && isPlaying) {
      const timer = setTimeout(() => {
        cupRef.current?.fire("scene1");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, isPlaying, cupRef, manualNavTrigger]);

  // Clear any pending loop timer
  const clearLoopTimer = useCallback(() => {
    if (loopTimer.current) {
      clearTimeout(loopTimer.current);
      loopTimer.current = null;
    }
  }, []);

  // Advance to next state with animation
  const advanceState = useCallback(() => {
    if (!isPlayingRef.current) return;

    const current = stateRef.current;

    switch (current) {
      case 0:
        // S0 → S1: court.scene1
        courtRef.current?.fire("scene1");
        setTimeout(() => {
          if (isPlayingRef.current) setState(1);
        }, 1800);
        break;
      case 1:
        // S1 → S2: card.scene1
        cardRef.current?.fire("scene1");
        setTimeout(() => {
          if (isPlayingRef.current) setState(2);
        }, 0);
        break;
      case 2:
        // S2 → S3: card.scene2
        cardRef.current?.fire("scene2");
        setTimeout(() => {
          if (isPlayingRef.current) setState(3);
        }, 700);
        break;
      case 3:
        // S3 → S4: cup.scene2
        cupRef.current?.fire("scene2");
        setTimeout(() => {
          if (isPlayingRef.current) setState(4);
        }, 1800);
        break;
      case 4:
        // S4 → S0: reset to beginning (loop)
        courtRef.current?.fire("finish");
        cupRef.current?.fire("finish");
        cardRef.current?.fire("finish");
        setTimeout(() => {
          if (isPlayingRef.current) setState(0);
        }, 300);
        break;
    }
  }, [courtRef, cardRef, cupRef]);

  // Auto-play loop effect. manualNavTrigger is in the deps so a manual
  // nav restarts the dwell timer with a fresh STATE_DURATIONS[state] window.
  useEffect(() => {
    if (!isPlaying) {
      clearLoopTimer();
      return;
    }

    const duration = STATE_DURATIONS[state] ?? 2500;
    loopTimer.current = setTimeout(() => {
      advanceState();
    }, duration);

    return () => {
      clearLoopTimer();
    };
  }, [state, isPlaying, advanceState, clearLoopTimer, manualNavTrigger]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLoopTimer();
    };
  }, [clearLoopTimer]);

  return {
    state,
    setState,
    currentStep,
  };
}
