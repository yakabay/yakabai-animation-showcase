interface SlideIndicatorProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

export function SlideIndicator({
  total,
  current,
  onSelect,
}: SlideIndicatorProps) {
  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className="group relative -m-2 cursor-pointer rounded p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === current ? "true" : undefined}
        >
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-cyan-400"
                : "w-2 bg-slate-600 group-hover:bg-slate-500"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
