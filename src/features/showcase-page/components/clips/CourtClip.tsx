import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
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

interface CourtClipProps {
  width?: number;
  height?: number;
  /** Fires once the state machine triggers are bound and safe to call. */
  onReady?: () => void;
}

export interface CourtClipRef {
  fire: (inputName: string) => void;
}

export const CourtClip = forwardRef<CourtClipRef, CourtClipProps>(
  ({ width, height, onReady }, ref) => {
    // Memoize layout to prevent recreation on every render
    const layout = useMemo(
      () => new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      []
    );

    const { rive, RiveComponent } = useRive(
      {
        src: asset("court.riv"),
        autoplay: true,
        stateMachines: "StateMachine1",
        layout,
        shouldDisableRiveListeners: false,
      },
      {
        useOffscreenRenderer: true,
        shouldResizeCanvasToContainer: true,
        // Keep SM advancing when the bay is scrolled offscreen — otherwise
        // wall-clock settle timers race ahead of a frozen Rive loop.
        shouldUseIntersectionObserver: false,
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

    const { trigger: finishTrigger } = useViewModelInstanceTrigger(
      "finish",
      viewModelInstance
    );

    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    // The trigger callbacks exist before the file loads, so the view model
    // instance is the only honest signal that a fire will land.
    const ready = Boolean(viewModelInstance);
    useEffect(() => {
      if (ready) onReadyRef.current?.();
    }, [ready]);

    useImperativeHandle(
      ref,
      () => ({
        fire: (inputName: string) => {
          if (inputName === "scene1" && scene1Trigger) {
            scene1Trigger();
          } else if (inputName === "finish" && finishTrigger) {
            finishTrigger();
          }
        },
      }),
      [scene1Trigger, finishTrigger]
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

CourtClip.displayName = "CourtClip";
