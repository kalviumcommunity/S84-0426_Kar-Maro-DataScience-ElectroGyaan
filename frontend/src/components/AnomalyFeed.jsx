import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';

/**
 * AnomalyFeed — theme-aware alert list.
 * Uses CSS variable tokens so it works in both dark and light mode.
 */
const AnomalyFeed = ({ anomalies, loading }) => {
  if (loading && (!anomalies || anomalies.length === 0)) {
    return (
      <div className="h-full flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2 animate-pulse">
          <div className="h-5 bg-level-3 rounded w-1/3"></div>
          <div className="h-5 bg-level-3 rounded w-16"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[76px] bg-level-3 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--color-text-faint)]">
        <AlertCircle size={32} className="opacity-40" />
        <p className="text-[13px]">✅ No anomalies detected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          Alert Feed
        </h3>
        <span className="text-[11px] px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/25 rounded-full font-semibold">
          {anomalies.length} {anomalies.length === 1 ? 'Warning' : 'Warnings'}
        </span>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
        {anomalies.map((alert) => {
          const isCritical = alert.units_kWh > 13;
          const timeStr = new Date(alert.timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          });

          return (
            <div
              key={alert._id}
              className={`p-3 rounded-lg border transition-all duration-150 hover:-translate-y-[1px] hover:shadow-card cursor-pointer
                ${isCritical
                  ? 'bg-red-500/8 border-red-500/25 border-l-[3px] border-l-red-500 hover:bg-red-500/12'
                  : 'bg-amber-500/8 border-amber-500/25 border-l-[3px] border-l-amber-500 hover:bg-amber-500/12'
                }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[13px] font-bold tracking-wide ${isCritical ? 'text-red-500' : 'text-amber-500'}`}>
                  🚨 Flat {alert.flatId}
                </span>
                <span className="text-[12px] font-mono font-semibold text-[var(--color-text-secondary)]">
                  {alert.units_kWh.toFixed(2)} kWh
                </span>
              </div>

              <div className="flex items-center gap-1 mt-1 text-[11px] text-[var(--color-text-faint)]">
                <Clock size={10} />
                {timeStr}
              </div>

              {alert.mlConfidence && (
                <div className="mt-1 text-[11px] text-[var(--color-text-faint)]">
                  ML confidence: {(alert.mlConfidence * 100).toFixed(0)}%
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border
                  ${isCritical
                    ? 'bg-red-500/10 text-red-500 border-red-500/30'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}>
                  {isCritical ? 'CRITICAL' : 'WARNING'}
                </span>
                <span className="text-[11px] text-[var(--color-text-faint)] hover:text-blue-500 transition-colors cursor-pointer">
                  View →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomalyFeed;
