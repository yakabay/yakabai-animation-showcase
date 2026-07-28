import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { EventType } from "@rive-app/canvas";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceTrigger,
} from "@rive-app/react-canvas";

import { asset } from "@/lib/asset";

interface CupClipProps {
  width?: number;
  height?: number;
  /** Fires once the state machine triggers are bound and safe to call. */
  onReady?: () => void;
  /** Named Rive event or state-change signal — used once proven terminal. */
  onSignal?: (name: string) => void;
}

export interface CupClipRef {
  fire: (inputName: string) => void;
}

export const CupClip = forwardRef<CupClipRef, CupClipProps>(
  ({ width, height, onReady, onSignal }, ref) => {
    // Memoize layout to prevent recreation on every render
    const layout = useMemo(
      () => new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      []
    );

    const { rive, RiveComponent } = useRive(
      {
        src: asset("cup.riv"),
        autoplay: true,
        stateMachines: "StateMachine1",
        layout,
        shouldDisableRiveListeners: false,
      },
      {
        // Performance optimizations for mobile
        useOffscreenRenderer: true,
        shouldResizeCanvasToContainer: true,
      }
    );

    useEffect(() => {
      if (rive) {
        rive.resizeDrawingSurfaceToCanvas();
      }
    }, [rive, width, height]);

    const viewModel = useViewModel(rive, { name: "ViewModel1" });
    const viewModelInstance = useViewModelInstance(viewModel, { rive });

    const { trigger: scene1Trigger } = useViewModelInstanceTrigger(
      "scene1",
      viewModelInstance
    );

    const { trigger: scene2Trigger } = useViewModelInstanceTrigger(
      "scene2",
      viewModelInstance
    );

    const { trigger: finishTrigger } = useViewModelInstanceTrigger(
      "finish",
      viewModelInstance
    );

    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;
    const onSignalRef = useRef(onSignal);
    onSignalRef.current = onSignal;

    // The trigger callbacks exist before the file loads, so the view model
    // instance is the only honest signal that a fire will land.
    const ready = Boolean(viewModelInstance);
    useEffect(() => {
      if (ready) onReadyRef.current?.();
    }, [ready]);

    // Log every event/state name so we can adopt only proven-terminal signals
    // into CLIP_TERMINAL_SIGNALS later. Timers remain the default.
    useEffect(() => {
      if (!rive) return;

      const onRiveEvent = (event: { data?: unknown }) => {
        const data = event.data as { name?: string } | undefined;
        const name = data?.name;
        if (!name) return;
        console.debug(`[cup] RiveEvent +${Math.round(performance.now())}ms`, name);
        onSignalRef.current?.(name);
      };

      const onStateChange = (event: { data?: unknown }) => {
        const names = event.data;
        if (!Array.isArray(names)) return;
        for (const name of names) {
          if (typeof name !== "string") continue;
          console.debug(`[cup] StateChange +${Math.round(performance.now())}ms`, name);
          onSignalRef.current?.(name);
        }
      };

      rive.on(EventType.RiveEvent, onRiveEvent);
      rive.on(EventType.StateChange, onStateChange);
      return () => {
        rive.off(EventType.RiveEvent, onRiveEvent);
        rive.off(EventType.StateChange, onStateChange);
      };
    }, [rive]);

    useImperativeHandle(
      ref,
      () => ({
        fire: (inputName: string) => {
          if (inputName === "scene1" && scene1Trigger) {
            scene1Trigger();
          } else if (inputName === "scene2" && scene2Trigger) {
            scene2Trigger();
          } else if (inputName === "finish" && finishTrigger) {
            finishTrigger();
          }
        },
      }),
      [scene1Trigger, scene2Trigger, finishTrigger]
    );

    return (
      <div
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RiveComponent style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }
);

CupClip.displayName = "CupClip";
