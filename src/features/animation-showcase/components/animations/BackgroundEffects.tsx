import {
  BackgroundBlobCyan,
  BackgroundBlobEmerald,
  BackgroundBlobPurple,
} from "./AmbientBlobs";

export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950" />

      <BackgroundBlobCyan />
      <BackgroundBlobEmerald />
      <BackgroundBlobPurple />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent via-transparent to-slate-950/50" />
    </div>
  );
}
