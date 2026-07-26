import { DRIVING_LOOP_STEPS } from "../showcase-page.data";

interface DrivingLoopProps {
  phase: number;
  onJump: (phase: number) => void;
}

export function DrivingLoop({ phase, onJump }: DrivingLoopProps) {
  return (
    <div className="border-t border-[#1e2228] bg-[#0a0c0f] px-5 py-8 sm:px-14 sm:py-10">
      <div className="mb-6 text-[11px] tracking-[0.18em] text-[#8b929c] uppercase">
        Driving loop
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
        {DRIVING_LOOP_STEPS.map((step, index) => {
          const active = phase === index;
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 sm:flex-1 sm:flex-row sm:gap-0"
            >
              <button
                type="button"
                onClick={() => onJump(index)}
                className="w-full min-w-0 cursor-pointer rounded-lg border px-[18px] py-4 text-left transition-[background-color,border-color] duration-[260ms] motion-reduce:duration-0"
                style={{
                  borderColor: active ? "#22d3ee" : "#1e2228",
                  backgroundColor: active ? "rgb(34 211 238 / .07)" : "#0b0d10",
                }}
              >
                <span
                  className="mb-2.5 block font-mono text-[11px] tracking-[0.14em]"
                  style={{ color: active ? "#22d3ee" : "#565d66" }}
                >
                  {step.id}
                </span>
                <span className="mb-2.5 block font-sans text-[15px] text-[#c6cdd6]">
                  {step.title}
                </span>
                <span className="block font-mono text-xs leading-[1.45] text-[#8f97a1]">
                  {step.subtitle}
                </span>
              </button>

              {step.arrow !== "none" ? (
                <span className="flex shrink-0 items-center justify-center px-3 text-[#3a4048] sm:rotate-0 sm:px-[14px] rotate-90">
                  {step.arrow === "loop" ? "↺" : "→"}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
