import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  LucideZap, LucideAlertTriangle, LucideBarChart2, LucideTrendingUp,
  LucideBuilding2, LucideActivity, LucideRefreshCw
} from 'lucide-react';
import { useAdminData } from '../hooks/useEnergyData';
import RealTimeChart from '../components/RealTimeChart';
import AnomalyFeed from '../components/AnomalyFeed';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
  const { allFlats, totalAnomalies, loading } = useAdminData();
  const [selectedFlatId, setSelectedFlatId] = useState('A101');
  const { isDark } = useTheme();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 bg-level-0">
          <div className="mb-6">
            <div className="h-7 bg-level-3 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-level-3 rounded w-72 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-level-2 border border-subtle rounded-xl p-5 h-[140px] animate-pulse">
                <div className="h-3 bg-level-4 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-level-4 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-level-4 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalConsumption  = allFlats.reduce((sum, f) => sum + (f.units_kWh || 0), 0);
  const avgConsumption    = allFlats.length > 0 ? totalConsumption / allFlats.length : 0;
  const flatsWithAnomalies = allFlats.filter(f => f.isAnomaly).length;
  const activeFlats       = allFlats.filter(f => f.units_kWh > 0).length;
  const selectedFlat      = allFlats.find(f => f.flatId === selectedFlatId);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 bg-level-0 min-h-full">

        {/* ── PAGE HEADER ── */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[var(--color-text-primary)]">Admin Dashboard</h1>
          <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Society-wide energy monitoring and analytics</p>
        </div>

        {/* ── KPI CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <KPICard
            accentColor="amber"
            label="SOCIETY CONSUMPTION"
            icon={<LucideZap className="w-[14px] h-[14px] text-amber-500" />}
            value={<>{totalConsumption.toFixed(1)} <span className="text-[14px] text-[var(--color-text-muted)]">kWh</span></>}
            subText={`${activeFlats} active flats`}
          />
          <KPICard
            accentColor="red"
            label="ACTIVE ANOMALIES"
            icon={<LucideAlertTriangle className="w-[14px] h-[14px] text-red-500" />}
            value={
              <div className="text-[40px] text-red-500 leading-tight flex items-center gap-2">
                {totalAnomalies}
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping-custom mt-2"></div>
              </div>
            }
            subText={`${flatsWithAnomalies} flats affected`}
          />
          <KPICard
            accentColor="blue"
            label="AVG PER FLAT"
            icon={<LucideBarChart2 className="w-[14px] h-[14px] text-blue-500" />}
            value={`${avgConsumption.toFixed(1)} kWh`}
            subText="Real-time average"
          />
          <KPICard
            accentColor="green"
            label="TOTAL FLATS"
            icon={<LucideBuilding2 className="w-[14px] h-[14px] text-green-500" />}
            value={allFlats.length}
            subText={`${activeFlats} currently active`}
          />
        </div>

        {/* ── FLAT STATUS GRID ── */}
        <div className="mb-6 bg-level-2 border border-subtle rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[17px] font-semibold text-[var(--color-text-primary)]">Flat Status Grid</h2>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-[2px]">A101–A150 · Click to inspect</p>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-[var(--color-text-faint)]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Anomaly</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Normal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-border-default)] inline-block"></span> Idle</span>
            </div>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {[...allFlats]
              .sort((a, b) => parseInt(a.flatId.slice(1)) - parseInt(b.flatId.slice(1)))
              .map(flat => (
                <div
                  key={flat.flatId}
                  onClick={() => setSelectedFlatId(flat.flatId)}
                  className={`relative bg-level-3 border rounded-lg p-2 cursor-pointer transition-all duration-150 hover:shadow-card hover:-translate-y-[1px]
                    ${selectedFlatId === flat.flatId
                      ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/5'
                      : 'border-subtle hover:border-blue-500/40'}`}
                >
                  <div className="text-[10px] font-mono text-[var(--color-text-faint)] mb-1">{flat.flatId}</div>
                  <div className="text-[12px] font-bold text-[var(--color-text-primary)]">{flat.units_kWh.toFixed(1)}</div>
                  <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                    flat.isAnomaly ? 'bg-red-500 animate-pulse' : flat.units_kWh > 0 ? 'bg-green-500' : 'bg-[var(--color-border-default)]'
                  }`}></div>
                </div>
              ))}
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">

          {/* ANOMALY FEED */}
          <div className="w-full lg:w-[380px] bg-level-2 border border-subtle rounded-xl p-5 shadow-card" style={{ minHeight: 380 }}>
            <AnomalyFeed
              anomalies={allFlats.filter(f => f.isAnomaly).map(f => ({
                _id: f.flatId,
                flatId: f.flatId,
                units_kWh: f.units_kWh,
                timestamp: f.timestamp || new Date(),
                isAnomaly: true
              }))}
              loading={loading}
            />
          </div>

          {/* SELECTED FLAT DETAILS */}
          <div className="flex-1 bg-level-2 border border-subtle rounded-xl p-6 shadow-card" style={{ minHeight: 380 }}>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)]">
                  Flat Detail — <span className="text-blue-500">{selectedFlatId}</span>
                </h3>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-[2px]">Real-time consumption details</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-faint)]">
                <LucideRefreshCw className="w-3 h-3" /> Live
              </div>
            </div>

            {!selectedFlat ? (
              <div className="text-[var(--color-text-faint)] text-[13px]">No data available</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current Consumption */}
                <div className="bg-level-3 border border-subtle rounded-xl p-4">
                  <div className="text-[11px] text-[var(--color-text-faint)] uppercase tracking-wide mb-2">Current Consumption</div>
                  <div className="text-[32px] font-mono font-bold text-green-500">
                    {selectedFlat.units_kWh.toFixed(3)}
                    <span className="text-[16px] text-[var(--color-text-muted)] ml-1">kWh</span>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-level-3 border border-subtle rounded-xl p-4">
                  <div className="text-[11px] text-[var(--color-text-faint)] uppercase tracking-wide mb-2">Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${selectedFlat.isAnomaly ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className={`text-[15px] font-bold ${selectedFlat.isAnomaly ? 'text-red-500' : 'text-green-500'}`}>
                      {selectedFlat.isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL'}
                    </span>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="bg-level-3 border border-subtle rounded-xl p-4">
                  <div className="text-[11px] text-[var(--color-text-faint)] uppercase tracking-wide mb-2">Last Updated</div>
                  <div className="text-[13px] text-[var(--color-text-secondary)]">
                    {selectedFlat.timestamp ? new Date(selectedFlat.timestamp).toLocaleString('en-IN') : 'N/A'}
                  </div>
                </div>

                {/* vs Average */}
                <div className="bg-level-3 border border-subtle rounded-xl p-4">
                  <div className="text-[11px] text-[var(--color-text-faint)] uppercase tracking-wide mb-2">vs Society Average</div>
                  {avgConsumption > 0 && (
                    selectedFlat.units_kWh > avgConsumption ? (
                      <span className="text-red-500 text-[14px] font-semibold">
                        ↑ {((selectedFlat.units_kWh / avgConsumption - 1) * 100).toFixed(1)}% above avg
                      </span>
                    ) : (
                      <span className="text-green-500 text-[14px] font-semibold">
                        ↓ {((1 - selectedFlat.units_kWh / avgConsumption) * 100).toFixed(1)}% below avg
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ── KPICard ── */
const KPICard = ({ accentColor, label, icon, value, subText }) => {
  const gradients = { amber: 'from-amber-500 to-amber-600', red: 'from-red-500 to-red-600', blue: 'from-blue-500 to-blue-600', green: 'from-green-500 to-green-600' };
  const iconBgs   = { amber: 'bg-amber-500/10', red: 'bg-red-500/10', blue: 'bg-blue-500/10', green: 'bg-green-500/10' };
  const valueColors = { amber: 'text-amber-500', red: 'text-red-500', blue: 'text-blue-500', green: 'text-green-500' };

  return (
    <div className="bg-level-2 border border-subtle rounded-xl p-5 relative overflow-hidden
      hover:border-blue-500/40 hover:shadow-blue-glow hover:-translate-y-[2px]
      transition-all duration-200 shadow-card">
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradients[accentColor]}`}></div>
      <div className="flex justify-between items-start">
        <span className="text-[11px] text-[var(--color-text-faint)] font-semibold uppercase tracking-[0.08em]">{label}</span>
        <div className={`w-[32px] h-[32px] rounded-lg flex justify-center items-center ${iconBgs[accentColor]}`}>{icon}</div>
      </div>
      <div className={`mt-3 font-mono font-bold text-[28px] leading-[32px] ${valueColors[accentColor]}`}>{value}</div>
      {subText && <div className="text-[12px] text-[var(--color-text-muted)] mt-2">{subText}</div>}
    </div>
  );
};
