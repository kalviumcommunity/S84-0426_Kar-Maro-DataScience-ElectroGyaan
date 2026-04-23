/**
 * KPICard — reusable metric card with accent line, icon, value, trend, and sub-row.
 *
 * Props:
 *  accentColor  — 'amber' | 'red' | 'blue' | 'green' | 'purple'
 *  label        — uppercase label string
 *  icon         — React node (Lucide icon)
 *  value        — React node or string
 *  trend        — { value: string, direction: 'up' | 'down' | 'neutral', label?: string }
 *  subRow       — React node rendered below value
 *  onClick      — optional click handler
 *  className    — extra classes
 */

const ACCENT = {
  amber:  { gradient: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'hover:ring-amber-500/20' },
  red:    { gradient: 'from-red-500 to-red-600',     iconBg: 'bg-red-500/10',   text: 'text-red-500',   ring: 'hover:ring-red-500/20' },
  blue:   { gradient: 'from-blue-500 to-blue-600',   iconBg: 'bg-blue-500/10',  text: 'text-blue-500',  ring: 'hover:ring-blue-500/20' },
  green:  { gradient: 'from-green-500 to-green-600', iconBg: 'bg-green-500/10', text: 'text-green-500', ring: 'hover:ring-green-500/20' },
  purple: { gradient: 'from-purple-500 to-purple-600', iconBg: 'bg-purple-500/10', text: 'text-purple-500', ring: 'hover:ring-purple-500/20' },
};

export default function KPICard({
  accentColor = 'blue',
  label,
  icon,
  value,
  trend,
  subRow,
  onClick,
  className = '',
}) {
  const a = ACCENT[accentColor] || ACCENT.blue;

  const trendColor = trend?.direction === 'up'
    ? 'text-red-500'
    : trend?.direction === 'down'
    ? 'text-green-500'
    : 'text-[var(--color-text-faint)]';

  const trendArrow = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→';

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-level-2 border border-subtle rounded-xl p-5 overflow-hidden
        shadow-card transition-all duration-200
        hover:border-blue-500/30 hover:shadow-blue-glow hover:-translate-y-[2px]
        hover:ring-2 ${a.ring}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${className}
      `}
    >
      {/* Accent top bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${a.gradient}`} />

      {/* Header row */}
      <div className="flex justify-between items-start">
        <span className="text-[11px] text-[var(--color-text-faint)] font-semibold uppercase tracking-[0.09em] leading-tight pr-2">
          {label}
        </span>
        <div className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 ${a.iconBg}`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className={`mt-3 font-mono font-bold text-[28px] leading-[34px] ${a.text}`}>
        {value}
      </div>

      {/* Trend */}
      {trend && (
        <div className={`flex items-center gap-1 mt-[6px] text-[12px] font-semibold ${trendColor}`}>
          <span>{trendArrow}</span>
          <span>{trend.value}</span>
          {trend.label && (
            <span className="text-[var(--color-text-faint)] font-normal ml-1">{trend.label}</span>
          )}
        </div>
      )}

      {/* Sub-row */}
      {subRow && <div className="mt-2">{subRow}</div>}
    </div>
  );
}
