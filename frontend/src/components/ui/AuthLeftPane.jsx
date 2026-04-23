import { LucideZap } from "lucide-react";

/**
 * AuthLeftPane — shared left panel for Login & Signup.
 * Fully theme-aware: works in both dark and light mode.
 */
export default function AuthLeftPane({ heading, subtext, highlights = [], stats = [] }) {
  return (
    <div className="hidden lg:flex w-[58%] flex-col justify-center items-center relative overflow-hidden border-r border-[var(--color-border-default)]"
      style={{ backgroundColor: 'var(--color-level-1)' }}>

      {/* ── Ambient blobs — visible in both themes ── */}
      {/* Dark: subtle blue/amber glow. Light: soft blue/indigo tint */}
      <div className="absolute top-[10%] left-[5%] w-[480px] h-[480px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] right-[5%] w-[380px] h-[380px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)' }} />
      <div className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

      {/* ── Content ── */}
      <div className="relative z-10 px-14 max-w-[540px] w-full">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <LucideZap className="w-5 h-5 text-amber-400"
              style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' }} />
          </div>
          <span className="text-[20px] font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}>
            ElectroGyaan
          </span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
            style={{
              color: 'var(--color-blue-500)',
              background: 'rgba(59,130,246,0.10)',
              border: '1px solid rgba(59,130,246,0.25)',
            }}>
            AI
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[38px] leading-[48px] font-extrabold tracking-tight mb-4"
          style={{ color: 'var(--color-text-primary)' }}>
          {heading}
        </h1>

        {/* Subtext */}
        <p className="text-[15px] leading-relaxed mb-8"
          style={{ color: 'var(--color-text-muted)' }}>
          {subtext}
        </p>

        {/* Feature highlights */}
        {highlights.length > 0 && (
          <div className="flex flex-col gap-3 mb-10">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[14px]"
                  style={{
                    background: 'rgba(59,130,246,0.10)',
                    border: '1px solid rgba(59,130,246,0.20)',
                  }}>
                  {h.icon}
                </div>
                <span className="text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
                  {h.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Stats row */}
        {stats.length > 0 && (
          <div className="flex rounded-xl overflow-hidden"
            style={{
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-level-2)',
            }}>
            {stats.map((s, i) => (
              <div key={i}
                className="flex-1 py-4 text-center"
                style={i < stats.length - 1 ? { borderRight: '1px solid var(--color-border-default)' } : {}}>
                <div className="text-[20px] font-mono font-bold"
                  style={{ color: 'var(--color-text-primary)' }}>
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest mt-1"
                  style={{ color: 'var(--color-text-faint)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust badge */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            {[
              { initials: 'RK', bg: '#3B82F6' },
              { initials: 'SM', bg: '#F59E0B' },
              { initials: 'AP', bg: '#10B981' },
              { initials: 'VK', bg: '#8B5CF6' },
              { initials: 'NK', bg: '#EC4899' },
            ].map(({ initials, bg }, i) => (
              <div key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{
                  background: bg,
                  border: '2px solid var(--color-level-1)',
                }}>
                {initials}
              </div>
            ))}
          </div>
          <div>
            <div className="text-[13px] font-semibold"
              style={{ color: 'var(--color-text-primary)' }}>
              120+ housing societies
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-[11px]">★</span>
              ))}
              <span className="text-[11px] ml-1" style={{ color: 'var(--color-text-faint)' }}>
                4.9/5 rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
