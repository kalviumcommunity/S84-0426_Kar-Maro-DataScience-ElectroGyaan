import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import apiClient from '../api/apiClient';
import { 
  LucideZap, LucideAlertTriangle, LucideBarChart2, LucideTrendingUp
} from 'lucide-react';
import { useEnergyData } from '../hooks/useEnergyData';
import RealTimeChart from '../components/RealTimeChart';
import AnomalyFeed from '../components/AnomalyFeed';
import MemeAlertModal from '../components/MemeAlertModal';

export default function UserDashboard() {
  const { flatId } = useParams();
  const userFlatId = flatId || 'A101';
  const { energyData, stats, anomalies, prediction, hourlyPattern, loading, error, newAnomalyDetected } = useEnergyData(userFlatId);
  const [showMeme, setShowMeme] = useState(false);
  const [societyAvg, setSocietyAvg] = useState(0);

  // Fetch society average from admin data
  React.useEffect(() => {
    const fetchSocietyAvg = async () => {
      try {
        const response = await apiClient.get('/api/energy/all-flats');
        if (response.data.data && response.data.data.length > 0) {
          const totalConsumption = response.data.data.reduce((sum, f) => sum + (f.units_kWh || 0), 0);
          const avg = totalConsumption / response.data.data.length;
          setSocietyAvg(avg);
        }
      } catch (err) {
        console.error('Failed to fetch society average:', err);
      }
    };
    fetchSocietyAvg();
  }, []);

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="p-8 bg-[#0A0F1E]">
          <div className="flex gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 bg-level-2 border border-subtle rounded-xl p-5 h-[140px] animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const myAvg = stats?.avgConsumption || 0;
  const delta = myAvg > 0 && societyAvg > 0 ? ((myAvg / societyAvg - 1) * 100) : 0;

  const peakHours = hourlyPattern
    .sort((a, b) => b.avgUnits - a.avgUnits)
    .slice(0, 3)
    .map(h => `${h.hour}:00`)
    .join(', ');

  const anomalyRate = stats?.recordCount > 0 
    ? ((stats.anomalyCount / stats.recordCount) * 100).toFixed(1)
    : 0;

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">My Apartment — {userFlatId}</h1>
          <p className="text-gray-400 mt-1">Personal energy consumption dashboard</p>
        </div>

        {/* KPI CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full mb-6">
          {/* Card 1 */}
          <KPICard 
            accentColor="amber" 
            label="THIS MONTH'S USAGE" 
            icon={<LucideZap className="w-[14px] h-[14px] text-amber-500" />}
            value={<>{stats?.totalConsumption?.toFixed(1) || '--'} <span className="text-[14px] text-gray-400 font-inter">kWh</span></>}
            subText={`${stats?.recordCount || 0} readings`}
          />
          {/* Card 2 */}
          <KPICard 
            accentColor="red" 
            label="MY ANOMALIES THIS MONTH" 
            icon={<LucideAlertTriangle className="w-[14px] h-[14px] text-red-500" />}
            value={<div className="text-[40px] text-red-400 leading-tight flex items-center gap-2">{stats?.anomalyCount || 0} <div className="w-2 h-2 bg-red-500 rounded-full animate-ping-custom mt-2"></div></div>}
            subText={`${anomalyRate}% anomaly rate`}
          />
          {/* Card 3 */}
          <KPICard 
            accentColor="blue" 
            label="MY AVG VS SOCIETY" 
            icon={<LucideBarChart2 className="w-[14px] h-[14px] text-blue-500" />}
            value={`${myAvg.toFixed(1)} kWh`}
            subText={
              delta > 0 
                ? `↑ ${delta.toFixed(1)}% above average`
                : `↓ ${Math.abs(delta).toFixed(1)}% below average`
            }
            subTextColor={delta > 0 ? 'text-red-400' : 'text-green-400'}
          />
          {/* Card 4 */}
          <KPICard 
            accentColor="green" 
            label="MY NEXT HOUR FORECAST" 
            icon={<LucideTrendingUp className="w-[14px] h-[14px] text-green-500" />}
            value={`${prediction?.predicted_units_kWh?.toFixed(1) || '--'} kWh`}
            subText="ML prediction"
          />
        </div>

        {/* MAIN CHART SECTION */}
        <div className="mb-6 w-full bg-level-2 border border-subtle rounded-xl p-6">
          <RealTimeChart data={energyData} loading={loading} />
        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* ANOMALY FEED */}
          <div className="w-full lg:w-[380px] bg-level-2 border border-subtle rounded-lg h-[380px] p-5">
            <AnomalyFeed anomalies={anomalies} loading={loading} />
          </div>

          {/* ML INSIGHTS BOX */}
          <div className="flex-1 bg-level-2 border border-subtle rounded-lg h-[380px] p-6">
            <div className="mb-4">
              <h3 className="text-[18px] font-semibold text-white flex items-center gap-2">
                💡 ML Insights
              </h3>
              <p className="text-[12px] text-gray-400">Personalized energy analytics</p>
            </div>

            <div className="space-y-4">
              <div className="bg-level-3 rounded-lg p-4">
                <div className="text-[12px] text-gray-500 mb-2">Peak Usage Hours</div>
                <div className="text-[16px] font-semibold text-blue-400">
                  {peakHours || 'Analyzing...'}
                </div>
                <div className="text-[12px] text-gray-400 mt-1">
                  Based on your usage pattern
                </div>
              </div>

              <div className="bg-level-3 rounded-lg p-4">
                <div className="text-[12px] text-gray-500 mb-2">Anomaly Detection Rate</div>
                <div className="text-[16px] font-semibold text-amber-400">
                  {anomalyRate}%
                </div>
                <div className="text-[12px] text-gray-400 mt-1">
                  IsolationForest flagged {stats?.anomalyCount || 0} suspicious readings
                </div>
              </div>

              <div className="bg-level-3 rounded-lg p-4">
                <div className="text-[12px] text-gray-500 mb-2">Last Reading</div>
                <div className="text-[16px] font-semibold text-green-400">
                  {stats?.lastReading?.units_kWh?.toFixed(3) || '--'} kWh
                </div>
                <div className="text-[12px] text-gray-400 mt-1">
                  {stats?.lastReading?.timestamp 
                    ? new Date(stats.lastReading.timestamp).toLocaleString('en-IN')
                    : 'No data'}
                </div>
              </div>

              <div className="bg-level-3 rounded-lg p-4">
                <div className="text-[12px] text-gray-500 mb-2">Consumption Trend</div>
                <div className="flex items-center gap-2">
                  {delta > 0 ? (
                    <>
                      <span className="text-[16px] font-semibold text-red-400">↑ Above Average</span>
                      <div className="text-[12px] text-gray-400">Consider reducing usage</div>
                    </>
                  ) : (
                    <>
                      <span className="text-[16px] font-semibold text-green-400">↓ Below Average</span>
                      <div className="text-[12px] text-gray-400">Great energy efficiency!</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <MemeAlertModal 
          isOpen={newAnomalyDetected || showMeme}
          onClose={() => setShowMeme(false)}
        />
      </div>
    </DashboardLayout>
  );
}

const KPICard = ({ accentColor, label, icon, value, subText, subTextColor }) => {
  const getGradient = () => {
    if (accentColor === 'amber') return 'from-[#F59E0B] to-[#D97706]';
    if (accentColor === 'red') return 'from-[#EF4444] to-[#B91C1C]';
    if (accentColor === 'blue') return 'from-[#3B82F6] to-[#2563EB]';
    if (accentColor === 'green') return 'from-[#10B981] to-[#059669]';
  };
  const getBgClass = () => {
    if (accentColor === 'amber') return 'bg-[rgba(245,158,11,0.1)]';
    if (accentColor === 'red') return 'bg-[rgba(239,68,68,0.1)]';
    if (accentColor === 'blue') return 'bg-[rgba(59,130,246,0.1)]';
    if (accentColor === 'green') return 'bg-[rgba(16,185,129,0.1)]';
  };
  const getTextClass = () => {
    if (accentColor === 'amber') return 'text-amber-500';
    if (accentColor === 'red') return 'text-red-500';
    if (accentColor === 'blue') return 'text-blue-500';
    if (accentColor === 'green') return 'text-green-500';
  };
  
  return (
    <div className="flex-1 bg-level-2 border border-subtle rounded-xl p-5 relative overflow-hidden group hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-200 hover:-translate-y-[2px]">
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${getGradient()}`}></div>
      
      <div className="flex justify-between items-start">
        <span className="text-[12px] text-gray-500 font-semibold uppercase tracking-[0.08em]">{label}</span>
        <div className={`w-[32px] h-[32px] rounded-md flex justify-center items-center ${getBgClass()}`}>
          {icon}
        </div>
      </div>

      <div className={`mt-3 font-mono font-bold text-[28px] leading-[32px] ${getTextClass()}`}>
        {value}
      </div>

      {subText && (
        <div className={`text-[12px] mt-2 ${subTextColor || 'text-gray-400'}`}>{subText}</div>
      )}
    </div>
  );
};
