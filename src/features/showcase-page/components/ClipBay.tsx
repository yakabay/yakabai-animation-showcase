import type { ReactNode } from "react";

import type { ClipTrigger } from "../showcase-page.data";

interface ClipBayProps {
  fileLabel: string;
  sizeLabel: string;
  description: string;
  triggers: Array<{ label: string; trigger: ClipTrigger }>;
  active: boolean;
  borderClassName: string;
  onFire: (trigger: ClipTrigger) => void;
  children: ReactNode;
}

export function ClipBay({
  fileLabel,
  sizeLabel,
  description,
  triggers,
  active,
  borderClassName,
  onFire,
  children,
}: ClipBayProps) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-5 px-5 py-6 transition-colors duration-300 sm:px-8 sm:py-8 ${borderClassName}`}
      style={{ backgroundColor: active ? "rgb(34 211 238 / .03)" : "transparent" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[0.16em] text-[#9aa2ad] uppercase">{fileLabel}</span>
        <span className="text-[11px] tracking-[0.1em] text-[#565d66]">{sizeLabel}</span>
      </div>

      <div className="flex h-[180px] items-center justify-center sm:h-[220px] lg:h-[270px]">
        {children}
      </div>

      <div className="min-h-[72px] font-sans text-sm leading-[1.55] text-[#8f97a1]">
        {description}
      </div>

      <div className="flex flex-wrap gap-2">
        {triggers.map(({ label, trigger }) => (
          <button
            key={label}
            type="button"
            onClick={() => onFire(trigger)}
            className="cursor-pointer rounded-[5px] border border-[#2a3038] bg-[#101318] px-[13px] py-2 font-mono text-xs tracking-[0.06em] text-[#c6cdd6] transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
