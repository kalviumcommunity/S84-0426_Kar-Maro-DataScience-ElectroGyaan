import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { energyApi } from '../api/apiClient';
import { AlertTriangle, AlertCircle } from 'lucide-react';

const AnomalyFeed = ({ userId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Poll for alerts every 10s (similar to main chart)
  useEffect(() => {
    if (!userId) return;

    const loadAlerts = async () => {
      try {
        const response = await energyApi.getAlerts(userId);
        if (response.success) {
          setAlerts(response.data);
        }
      } catch (error) {
        console.error('Failed fetching alerts', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return <div className="text-neutral-500 text-sm">Scanning for anomalies...</div>;
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-2">
        <AlertCircle size={32} className="text-neutral-600" />
        <p>No recent anomalies detected</p>
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
          {alerts.length} Warnings
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          
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
                <span className={`text-sm font-semibold capitalize ${
                  isCritical ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  • {alert.severity.toLowerCase()}
                </span>
                <span className="text-xs text-neutral-400">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-neutral-300">{alert.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomalyFeed;
