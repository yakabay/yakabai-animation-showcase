import type { ClipKey, ClipTrigger } from "../showcase-page.types";

/**
 * Imperative side channels that must not live in Zustand state (no renders).
 * Lifecycle: ShowcasePage registers the emitter; useAutoLoop clears timers on unmount.
 */
type Emitter = (clip: ClipKey, trigger: ClipTrigger) => void;

let emit: Emitter | null = null;
const settleTimers = new Map<ClipKey, ReturnType<typeof setTimeout>>();
let blockedGen = 0;

export function setEmitter(next: Emitter | null): void {
  emit = next;
}

export function emitTrigger(clip: ClipKey, trigger: ClipTrigger): void {
  emit?.(clip, trigger);
}

export function scheduleSettle(
  clip: ClipKey,
  ms: number,
  onSettle: () => void
): void {
  const existing = settleTimers.get(clip);
  if (existing) clearTimeout(existing);

  settleTimers.set(
    clip,
    setTimeout(() => {
      settleTimers.delete(clip);
      onSettle();
    }, ms)
  );
}

export function clearSettleTimers(): void {
  for (const timer of settleTimers.values()) clearTimeout(timer);
  settleTimers.clear();
}

export function nextBlockedGen(): number {
  return ++blockedGen;
}
