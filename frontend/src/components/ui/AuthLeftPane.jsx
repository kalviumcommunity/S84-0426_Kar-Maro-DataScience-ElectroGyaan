import { LucideZap, LucideCheckCircle2 } from "lucide-react";

/**
 * AuthLeftPane — shared left panel for Login & Signup.
 * Identical structure, same blue accent, same card style.
 * Content (heading, subtext, highlights, stats) is passed as props.
 */
export default function AuthLeftPane({ heading, subtext, highlights = [], stats = [] }) {
  return (
    <div className="hidden lg:flex w-[58%] flex-col justify-center items-center relative overflow-hidden bg-level-1 border-r border-subtle">

      {/* ── Ambient glow blobs ── */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/4 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 px-16 max-w-[560px] w-full">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <LucideZap className="w-5 h-5 text-amber-400" style={{ filter: "drop-shadow(0 0 8px rgba(245,158,11,0.6))" }} />
          </div>
          <span className="text-[20px] font-bold text-[var(--color-text-primary)] tracking-tight">ElectroGyaan</span>
          <span className="text-[12px] text-blue-500 font-bold bg-blue-500/10 border border-blue-500/25 px-1.5 py-0.5 rounded-md ml-0.5">AI</span>
        </div>

        {/* Heading */}
        <h1 className="text-[40px] leading-[50px] font-extrabold tracking-tight text-[var(--color-text-primary)] mb-4">
          {heading}
        </h1>

        {/* Subtext */}
        <p className="text-[15px] text-[var(--color-text-muted)] leading-relaxed mb-8">
          {subtext}
        </p>

        {/* Feature highlights */}
        {highlights.length > 0 && (
          <div className="flex flex-col gap-3 mb-10">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-[15px]">
                  {h.icon}
                </div>
                <span className="text-[14px] text-[var(--color-text-secondary)]">{h.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stats row */}
        {stats.length > 0 && (
          <div className="flex gap-0 border border-subtle rounded-xl overflow-hidden bg-level-2">
            {stats.map((s, i) => (
              <div key={i} className={`flex-1 py-4 text-center ${i < stats.length - 1 ? "border-r border-subtle" : ""}`}>
                <div className="text-[20px] font-mono font-bold text-[var(--color-text-primary)]">{s.value}</div>
                <div className="text-[10px] text-[var(--color-text-faint)] uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Trust badge */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["RK","SM","AP","VK","NK"].map((initials, i) => (
              <div key={i}
                className="w-8 h-8 rounded-full border-2 border-[var(--color-level-1)] flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: ["#3B82F6","#F59E0B","#10B981","#8B5CF6","#EC4899"][i] }}>
                {initials}
              </div>
            ))}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">120+ housing societies</div>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-[11px]">★</span>
              ))}
              <span className="text-[11px] text-[var(--color-text-faint)] ml-1">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
