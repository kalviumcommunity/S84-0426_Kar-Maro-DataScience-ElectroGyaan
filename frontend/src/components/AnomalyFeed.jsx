import { AlertTriangle, AlertCircle } from 'lucide-react';

const AnomalyFeed = ({ anomalies, loading }) => {
  if (loading && (!anomalies || anomalies.length === 0)) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="flex-1 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-2">
        <AlertCircle size={32} className="text-neutral-600" />
        <p>✅ No anomalies detected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-rose-400 flex items-center gap-2">
          <AlertTriangle size={18} /> Alert Feed
        </h3>
        <span className="text-xs px-2 py-1 bg-rose-500/20 text-rose-400 rounded-full">
          {anomalies.length} Warnings
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {anomalies.map((alert) => {
          const isCritical = alert.units_kWh > 13;
          const timeStr = new Date(alert.timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          
          return (
            <div 
              key={alert._id} 
              className={`p-3 rounded-lg border flex flex-col space-y-1 ${
                isCritical 
                ? 'bg-rose-500/10 border-rose-500/30' 
                : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-semibold ${
                  isCritical ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  🚨 Flat {alert.flatId}
                </span>
                <span className="text-xs text-neutral-400">
                  {timeStr}
                </span>
              </div>
              <p className="text-sm text-neutral-300">
                Spike: {alert.units_kWh.toFixed(2)} kWh
                {alert.mlConfidence && ` (Confidence: ${(alert.mlConfidence * 100).toFixed(0)}%)`}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isCritical 
                  ? 'bg-rose-900/50 text-rose-400 border border-rose-500/30' 
                  : 'bg-amber-900/50 text-amber-400 border border-amber-500/30'
                }`}>
                  {isCritical ? 'CRITICAL' : 'WARNING'}
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
