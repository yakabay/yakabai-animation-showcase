import { type RefObject, useEffect, useRef } from "react";

interface UseHorizontalSwipeProps {
  ref: RefObject<HTMLElement | null>;
  onNext: () => void;
  onPrev: () => void;
  threshold?: number;
}

export function useHorizontalSwipe({
  ref,
  onNext,
  onPrev,
  threshold = 50,
}: UseHorizontalSwipeProps) {
  const onNextRef = useRef(onNext);
  const onPrevRef = useRef(onPrev);

  useEffect(() => {
    onNextRef.current = onNext;
    onPrevRef.current = onPrev;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let active = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      active = true;
    };

    const up = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) onNextRef.current();
        else onPrevRef.current();
      }
    };

    const cancel = () => {
      active = false;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);

    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
    };
  }, [ref, threshold]);
}
