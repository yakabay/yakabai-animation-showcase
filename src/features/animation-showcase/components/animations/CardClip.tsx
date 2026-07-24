import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
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

interface CardClipProps {
  width?: number;
  height?: number;
}

export interface CardClipRef {
  fire: (inputName: string) => void;
}

export const CardClip = forwardRef<CardClipRef, CardClipProps>(
  ({ width = 512, height = 512 }, ref) => {
    // Memoize layout to prevent recreation on every render
    const layout = useMemo(
      () => new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      []
    );

    const { rive, RiveComponent } = useRive(
      {
        src: asset("card.riv"),
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
          width,
          height,
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

CardClip.displayName = "CardClip";
