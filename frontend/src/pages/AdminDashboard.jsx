import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  LucideZap, LucideAlertTriangle, LucideBarChart2, LucideTrendingUp,
  LucideBuilding2
} from 'lucide-react';
import { useAdminData } from '../hooks/useEnergyData';
import RealTimeChart from '../components/RealTimeChart';
import AnomalyFeed from '../components/AnomalyFeed';

export default function AdminDashboard() {
  const { allFlats, totalAnomalies, loading } = useAdminData();
  const [selectedFlatId, setSelectedFlatId] = useState('A101');

  if (loading) {
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

  const totalConsumption = allFlats.reduce((sum, f) => sum + (f.units_kWh || 0), 0);
  const avgConsumption = allFlats.length > 0 ? totalConsumption / allFlats.length : 0;
  const flatsWithAnomalies = allFlats.filter(f => f.isAnomaly).length;
  const activeFlats = allFlats.filter(f => f.units_kWh > 0).length;

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Society-wide energy monitoring and analytics</p>
        </div>

        {/* KPI CARDS ROW */}
        <div className="flex flex-col lg:flex-row gap-5 w-full mb-6">
          {/* Card 1 */}
          <KPICard 
            accentColor="amber" 
            label="SOCIETY CONSUMPTION TODAY" 
            icon={<LucideZap className="w-[14px] h-[14px] text-amber-500" />}
            value={<>{totalConsumption.toFixed(1)} <span className="text-[14px] text-gray-400 font-inter">kWh</span></>}
            subText={`${activeFlats} active flats`}
          />
          {/* Card 2 */}
          <KPICard 
            accentColor="red" 
            label="ACTIVE ANOMALIES" 
            icon={<LucideAlertTriangle className="w-[14px] h-[14px] text-red-500" />}
            value={<div className="text-[40px] text-red-400 leading-tight flex items-center gap-2">{totalAnomalies} <div className="w-2 h-2 bg-red-500 rounded-full animate-ping-custom mt-2"></div></div>}
            subText={`${flatsWithAnomalies} flats affected`}
          />
          {/* Card 3 */}
          <KPICard 
            accentColor="blue" 
            label="AVG PER FLAT" 
            icon={<LucideBarChart2 className="w-[14px] h-[14px] text-blue-500" />}
            value={`${avgConsumption.toFixed(1)} kWh`}
            subText="Real-time average"
          />
          {/* Card 4 */}
          <KPICard 
            accentColor="green" 
            label="TOTAL FLATS" 
            icon={<LucideBuilding2 className="w-[14px] h-[14px] text-green-500" />}
            value={allFlats.length}
            subText={`${activeFlats} currently active`}
          />
        </div>

        {/* FLAT STATUS GRID */}
        <div className="mb-6 bg-level-2 border border-subtle rounded-xl p-6">
          <h2 className="text-[18px] font-semibold font-inter text-white mb-4">Flat Status Grid (A101–A150)</h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {[...allFlats]
              .sort((a, b) => parseInt(a.flatId.slice(1)) - parseInt(b.flatId.slice(1)))
              .map(flat => (
              <div
                key={flat.flatId}
                onClick={() => setSelectedFlatId(flat.flatId)}
                className={`relative bg-level-3 border rounded-lg p-2 cursor-pointer hover:border-blue-400 transition-all ${
                  selectedFlatId === flat.flatId ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-subtle'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-400 mb-1">{flat.flatId}</div>
                <div className="text-[12px] font-bold text-white">{flat.units_kWh.toFixed(1)}</div>
                <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                  flat.isAnomaly ? 'bg-red-500 animate-pulse' : flat.units_kWh > 0 ? 'bg-green-500' : 'bg-gray-600'
                }`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* ANOMALY FEED */}
          <div className="w-full lg:w-[380px] bg-level-2 border border-subtle rounded-lg h-[380px] p-5">
            <AnomalyFeed anomalies={allFlats.filter(f => f.isAnomaly).map(f => ({
              _id: f.flatId,
              flatId: f.flatId,
              units_kWh: f.units_kWh,
              timestamp: f.timestamp || new Date(),
              isAnomaly: true
            }))} loading={loading} />
          </div>

          {/* SELECTED FLAT DETAILS */}
          <div className="flex-1 bg-level-2 border border-subtle rounded-lg h-[380px] p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-[18px] font-semibold text-white">Selected Flat: {selectedFlatId}</h3>
                <p className="text-[12px] text-gray-400">Real-time consumption details</p>
              </div>
            </div>
            
            {(() => {
              const selectedFlat = allFlats.find(f => f.flatId === selectedFlatId);
              if (!selectedFlat) return <div className="text-gray-500">No data available</div>;
              
              return (
                <div className="space-y-4">
                  <div className="bg-level-3 rounded-lg p-4">
                    <div className="text-[12px] text-gray-500 mb-1">Current Consumption</div>
                    <div className="text-[32px] font-mono font-bold text-green-400">
                      {selectedFlat.units_kWh.toFixed(3)} <span className="text-[16px] text-gray-400">kWh</span>
                    </div>
                  </div>
                  
                  <div className="bg-level-3 rounded-lg p-4">
                    <div className="text-[12px] text-gray-500 mb-1">Status</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedFlat.isAnomaly ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                      }`}></div>
                      <span className={`text-[14px] font-semibold ${
                        selectedFlat.isAnomaly ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {selectedFlat.isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-level-3 rounded-lg p-4">
                    <div className="text-[12px] text-gray-500 mb-1">Last Updated</div>
                    <div className="text-[14px] text-gray-300">
                      {selectedFlat.timestamp ? new Date(selectedFlat.timestamp).toLocaleString('en-IN') : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-level-3 rounded-lg p-4">
                    <div className="text-[12px] text-gray-500 mb-2">Comparison to Average</div>
                    <div className="flex items-center gap-2">
                      {selectedFlat.units_kWh > avgConsumption ? (
                        <span className="text-red-400 text-[14px] font-semibold">
                          ↑ {((selectedFlat.units_kWh / avgConsumption - 1) * 100).toFixed(1)}% above average
                        </span>
                      ) : (
                        <span className="text-green-400 text-[14px] font-semibold">
                          ↓ {((1 - selectedFlat.units_kWh / avgConsumption) * 100).toFixed(1)}% below average
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const KPICard = ({ accentColor, label, icon, value, subText }) => {
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
        <div className="text-[12px] text-gray-400 mt-2">{subText}</div>
      )}
    </div>
  );
};
