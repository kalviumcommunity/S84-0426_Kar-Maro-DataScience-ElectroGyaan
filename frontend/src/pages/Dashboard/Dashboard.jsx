import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  LucideZap, LucideAlertTriangle, LucideBarChart2, LucideTrendingUp,
  LucideBuilding2, LucideChevronDown, LucideRefreshCw
} from 'lucide-react';
import {
  Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Scatter, ComposedChart, Tooltip
} from 'recharts';
import { useEnergyData } from '../../hooks/useEnergyData';
import MemeAlertModal from '../../components/MemeAlertModal';
import { useTheme } from '../../context/ThemeContext';
import KPICard from '../../components/ui/KPICard';

export default function Dashboard() {
  const { energyData, stats, anomalies, prediction, loading, error, newAnomalyDetected } = useEnergyData('A101');
  const [showMeme, setShowMeme] = useState(false);
  const [activeTimePill, setActiveTimePill] = useState('1H');
  const { isDark } = useTheme();

  const chartData = energyData.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }),
    kwh: d.units_kWh,
    anomaly: d.isAnomaly,
    id: d.flatId
  }));

  const anomalyFeed = anomalies.slice(0, 5).map(a => ({
    id: a.flatId,
    kwh: a.units_kWh.toFixed(1),
    time: new Date(a.timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) + ' · Today',
    level: a.units_kWh > 13 ? 'Critical' : 'Warning',
    _id: a._id
  }));

  const topPredicted = energyData
    .slice(-5)
    .sort((a, b) => b.units_kWh - a.units_kWh)
    .map((d, i) => ({ id: d.flatId, kwh: d.units_kWh.toFixed(1), pct: 100 - (i * 9) }));

  // Chart colors adapt to theme
  const gridColor   = isDark ? 'rgba(55,65,81,0.3)'  : 'rgba(203,213,225,0.6)';
  const tickColor   = isDark ? '#6B7280'              : '#64748B';
  const tooltipBg   = isDark ? '#1A2235'              : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151'            : '#CBD5E1';

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="p-8 bg-level-0">
          <div className="flex gap-5 flex-col lg:flex-row">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 bg-level-2 border border-subtle rounded-xl p-5 h-[140px] animate-pulse">
                <div className="h-3 bg-level-4 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-level-4 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-level-4 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-level-2 border border-subtle rounded-xl p-6 h-[360px] animate-pulse">
            <div className="h-5 bg-level-4 rounded w-1/4 mb-3"></div>
            <div className="h-4 bg-level-4 rounded w-1/3 mb-6"></div>
            <div className="h-[260px] bg-level-3 rounded-lg"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const criticalCount = anomalies.filter(a => a.units_kWh > 13).length;
  const warningCount  = anomalies.length - criticalCount;

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 bg-level-0 min-h-full">

        {/* ── PAGE HEADER ── */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[var(--color-text-primary)]">Dashboard</h1>
          <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Real-time energy monitoring for your apartment</p>
        </div>

        {/* ── KPI CARDS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
          <KPICard
            accentColor="amber"
            label="TODAY'S CONSUMPTION"
            icon={<LucideZap className="w-[15px] h-[15px] text-amber-500" />}
            value={<>{stats?.totalConsumption?.toFixed(1) || '--'} <span className="text-[14px] text-[var(--color-text-muted)] font-inter">kWh</span></>}
            trend={stats?.totalConsumption > 0 ? {
              value: `${((stats.totalConsumption / 800) * 100 - 100).toFixed(1)}%`,
              direction: 'up',
              label: 'vs yesterday'
            } : undefined}
          />
          <KPICard
            accentColor="red"
            label="ACTIVE ANOMALIES"
            icon={<LucideAlertTriangle className="w-[15px] h-[15px] text-red-500" />}
            value={
              <div className="text-[40px] text-red-500 leading-tight flex items-center gap-2">
                {stats?.anomalyCount || 0}
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping-custom mt-2"></div>
              </div>
            }
            subRow={
              <div className="flex gap-2 mt-[2px]">
                <Badge color="red">{criticalCount} Critical</Badge>
                <Badge color="amber">{warningCount} Warnings</Badge>
              </div>
            }
          />
          <KPICard
            accentColor="blue"
            label="AVG PER FLAT TODAY"
            icon={<LucideBarChart2 className="w-[15px] h-[15px] text-blue-500" />}
            value={`${stats?.avgConsumption?.toFixed(1) || '--'} kWh`}
            subRow={
              <div className="mt-2">
                <div className="h-[5px] rounded-full bg-level-3 w-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (stats?.avgConsumption / 20) * 100)}%` }}></div>
                </div>
                <div className="text-[11px] text-[var(--color-text-faint)] mt-1.5">Normal range: 12–20 kWh</div>
              </div>
            }
          />
          <KPICard
            accentColor="green"
            label="NEXT HOUR FORECAST"
            icon={<LucideTrendingUp className="w-[15px] h-[15px] text-green-500" />}
            value={`${prediction?.predicted_units_kWh?.toFixed(1) || '--'} kWh`}
            subRow={
              <div className="mt-1 space-y-1">
                <div className="text-[12px] text-[var(--color-text-muted)]">
                  🔮 {stats?.mlConfidence ? `${(stats.mlConfidence * 100).toFixed(0)}%` : '94%'} ML confidence
                </div>
                <div className="text-[11px] text-[var(--color-text-faint)]">Refreshes in 8 min</div>
              </div>
            }
          />
        </div>

        {/* ── MAIN CHART ── */}
        <div className="mt-6 w-full bg-level-2 border border-subtle rounded-xl p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
            <div>
              <h2 className="text-[18px] font-semibold font-inter text-[var(--color-text-primary)]">
                Real-Time Consumption Monitor
              </h2>
              <p className="text-[13px] text-[var(--color-text-muted)] mt-[2px]">Last 50 readings — all apartments</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="h-[34px] px-3 bg-level-1 border border-subtle rounded-md text-[13px] text-[var(--color-text-secondary)] flex items-center gap-2 hover:bg-level-3 transition-colors">
                <LucideBuilding2 className="w-[13px] h-[13px]" />
                All Apartments
                <LucideChevronDown className="w-[13px] h-[13px]" />
              </button>
              <div className="flex gap-1">
                {['1H','6H','24H','7D'].map(t => (
                  <TimePill key={t} label={t} active={activeTimePill === t} onClick={() => setActiveTimePill(t)} />
                ))}
              </div>
              <div className="flex items-center gap-[6px] bg-green-500/10 border border-green-500/20 rounded-full px-[10px] py-[3px]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-custom ring-4 ring-green-500/20"></span>
                <span className="text-[12px] font-bold text-green-500">LIVE</span>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.25)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="rgba(59,130,246,0.00)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridColor} />
                <XAxis dataKey="time" axisLine={false} tickLine={false}
                  tick={{ fill: tickColor, fontSize: 11, fontFamily: 'JetBrains Mono' }} dy={10} />
                <YAxis domain={[0, 16]} ticks={[0, 4, 8, 12, 16]} axisLine={false} tickLine={false}
                  tick={{ fill: tickColor, fontSize: 11, fontFamily: 'JetBrains Mono' }} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: isDark ? '#D1D5DB' : '#374151', fontWeight: 600 }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Area type="monotone" dataKey="kwh" stroke="#3B82F6" strokeWidth={2}
                  fillOpacity={1} fill="url(#colorKwh)"
                  activeDot={{ r: 6, fill: '#3B82F6', stroke: isDark ? '#0A0F1E' : '#fff', strokeWidth: 2 }} />
                <Scatter data={chartData.filter(d => d.anomaly)} fill="#EF4444" shape={(props) => {
                  const { cx, cy } = props;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={9} fill="none" stroke="#EF4444" strokeWidth={2} opacity={0.35} />
                      <circle cx={cx} cy={cy} r={5} fill="#EF4444" />
                    </g>
                  );
                }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6 w-full">

          {/* ANOMALY FEED */}
          <div className="w-full lg:w-[380px] bg-level-2 border border-subtle rounded-xl flex flex-col overflow-hidden shadow-card" style={{ minHeight: 380 }}>
            <div className="p-5 pb-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <LucideAlertTriangle className="w-4 h-4 text-red-500" />
                <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Anomaly Feed</h3>
                <span className="bg-red-500/15 text-red-500 border border-red-500/30 text-[11px] h-[20px] min-w-[20px] rounded-full flex items-center justify-center px-2 font-bold ml-1">
                  {anomalyFeed.length || 0}
                </span>
              </div>
              <button className="text-[12px] text-blue-500 hover:text-blue-400 font-medium transition-colors">View All →</button>
            </div>
            <div className="mx-5 h-[1px] bg-[var(--color-border-subtle)]"></div>

            <div className="px-4 py-3 overflow-y-auto flex flex-col gap-2 custom-scrollbar flex-1">
              {anomalyFeed.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-faint)] py-8 gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-[13px]">No anomalies detected</span>
                </div>
              ) : (
                anomalyFeed.map((item) => (
                  <div key={item._id}
                    className={`bg-level-3 border border-subtle rounded-lg p-3 cursor-pointer hover:bg-level-4 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-card
                      ${item.level === 'Critical'
                        ? 'border-l-[3px] border-l-red-500'
                        : 'border-l-[3px] border-l-amber-500'}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[13px] font-bold text-[var(--color-text-primary)] tracking-widest">{item.id}</span>
                      <span className="font-mono text-[13px] font-semibold text-red-500">{item.kwh} kWh</span>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-faint)] mt-1">{item.time}</div>
                    <div className="flex justify-between items-center mt-2">
                      <Badge color={item.level === 'Critical' ? 'red' : 'amber'}>{item.level}</Badge>
                      <span className="text-[11px] text-[var(--color-text-faint)] hover:text-blue-500 transition-colors cursor-pointer">View →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI FORECAST WIDGET */}
          <div className="flex-1 bg-level-2 border border-subtle rounded-xl p-6 shadow-card" style={{ minHeight: 380 }}>
            <div className="flex justify-between items-start font-inter">
              <div>
                <div className="flex items-center gap-2">
                  <LucideTrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-[16px] font-semibold text-[var(--color-text-primary)]">AI Forecast</span>
                </div>
                <div className="text-[12px] text-[var(--color-text-muted)] mt-[2px]">Next hour prediction</div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-faint)]">
                <LucideRefreshCw className="w-3 h-3" />
                Refreshes in 8 min
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="flex items-end gap-2">
                <span className="text-[52px] font-mono font-extrabold text-green-500 leading-none">
                  {prediction?.predicted_units_kWh?.toFixed(1) || '--'}
                </span>
                <span className="text-[20px] text-[var(--color-text-muted)] mb-2">kWh</span>
              </div>
              <div className="text-[13px] text-[var(--color-text-muted)] mt-2 text-center">
                Expected society-wide:{' '}
                {prediction?.target_timestamp
                  ? new Date(prediction.target_timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
                  : '19:00'} hrs
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] text-[var(--color-text-faint)] font-semibold uppercase tracking-wide">ML Confidence</span>
                <span className="text-[12px] font-mono text-green-500 font-semibold">94%</span>
              </div>
              <div className="h-[6px] rounded-full bg-level-3 w-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div className="my-5 h-[1px] bg-[var(--color-border-subtle)]"></div>

            <div>
              <div className="text-[11px] text-[var(--color-text-faint)] font-semibold uppercase tracking-[0.08em] mb-3">
                TOP PREDICTED CONSUMERS — NEXT HOUR
              </div>
              <div className="flex flex-col gap-2">
                {topPredicted.length > 0 ? topPredicted.map((row, i) => (
                  <div key={i} className="flex items-center gap-[10px]">
                    <span className="text-[12px] text-[var(--color-text-secondary)] font-mono w-[36px]">{row.id}</span>
                    <div className="flex-1 h-[6px] rounded-full bg-level-3 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${row.pct}%`, opacity: 1 - (i * 0.15) }}></div>
                    </div>
                    <span className="text-[12px] text-green-500 font-mono w-[52px] text-right">{row.kwh} kWh</span>
                  </div>
                )) : (
                  <div className="text-center text-[var(--color-text-faint)] py-4 text-[12px]">No data available</div>
                )}
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

/* ── Sub-components (Badge + TimePill remain local) ── */

const TimePill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`h-[30px] px-3 rounded-md text-[12px] font-semibold font-inter transition-all duration-150 ${
      active
        ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
        : 'bg-level-1 text-[var(--color-text-muted)] border border-transparent hover:text-[var(--color-text-primary)] hover:bg-level-3'
    }`}>
    {label}
  </button>
);

const Badge = ({ color, children }) => {
  const styles = {
    red:   'bg-red-500/10 text-red-500 border border-red-500/30',
    amber: 'bg-amber-500/10 text-amber-500 border border-amber-500/30',
    green: 'bg-green-500/10 text-green-500 border border-green-500/30',
  };
  return (
    <span className={`h-[22px] px-[10px] py-[3px] rounded-full text-[11px] font-bold uppercase tracking-[0.06em] flex items-center justify-center ${styles[color] || styles.green}`}>
      {children}
    </span>
  );
};
