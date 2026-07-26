import { FILE_SPECS } from "../showcase-page.data";

export function InsideTheFile() {
  return (
    <div className="px-5 py-10 sm:px-14">
      <div className="mb-6 text-[11px] tracking-[0.18em] text-[#8b929c] uppercase">
        Inside the file
      </div>

      <div className="mb-6 flex h-[220px] w-full items-center justify-center rounded-lg border border-[#1e2228] text-center text-sm text-[#565d66] sm:h-[300px]">
        Rive editor — state machine graph
      </div>

      <div className="flex flex-col gap-[11px]">
        {FILE_SPECS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 text-[13px]"
          >
            <span className="text-[#565d66]">{row.label}</span>
            <span className="text-right text-[#c6cdd6]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
