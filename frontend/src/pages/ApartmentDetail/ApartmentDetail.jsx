import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LucideArrowLeft, LucideCalendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Link, useParams } from 'react-router-dom';

// Specific Dummy Data for A112 Electrogyaan AI
const chartData = [
  { date: 'Jun 1', kwh: 12.1 },
  { date: 'Jun 3', kwh: 10.5, anomaly: true, label: 'Warning' },
  { date: 'Jun 5', kwh: 11.2 },
  { date: 'Jun 9', kwh: 14.9, anomaly: true, label: 'Critical' },
  { date: 'Jun 10', kwh: 12.8 },
  { date: 'Jun 12', kwh: 13.2 },
  { date: 'Jun 14', kwh: 13.7, anomaly: true, label: 'Critical' },
  { date: 'Jun 15', kwh: 12.5 },
  { date: 'Jun 18', kwh: 11.0 },
  { date: 'Jun 22', kwh: 12.9 },
  { date: 'Jun 26', kwh: 14.1 },
  { date: 'Jun 30', kwh: 13.5 }
];

export default function ApartmentDetail() {
  const { id } = useParams();
  const apartmentId = id || 'A112';

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E] min-h-full">
        {/* BREADCRUMB */}
        <div className="flex items-center text-[14px]">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-300 cursor-pointer">Dashboard</Link>
          <span className="text-gray-700 mx-2">&gt;</span>
          <Link to="/apartments" className="text-gray-500 hover:text-gray-300 cursor-pointer">Apartments</Link>
          <span className="text-gray-700 mx-2">&gt;</span>
          <span className="text-white font-semibold">{apartmentId}</span>
        </div>

        {/* PAGE HEADER */}
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] bg-gradient-to-br from-[rgba(239,68,68,0.3)] to-[rgba(127,29,29,0.5)] border border-red-500/50 rounded-xl flex items-center justify-center text-[16px] font-mono font-bold text-red-400">
              {apartmentId}
            </div>
            <div>
              <h1 className="text-[30px] font-bold text-white leading-tight font-inter">Apartment {apartmentId}</h1>
              <div className="flex items-center gap-2 mt-1">
                <InfoChip>Floor 1</InfoChip>
                <InfoChip>Block B</InfoChip>
                <InfoChip>B-Wing</InfoChip>
                <span className="bg-[#450A0A] text-red-400 border border-[#991B1B] h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em] flex items-center gap-[6px]">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-custom"></span> Active Anomaly
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link to="/apartments" className="h-[36px] px-4 border border-default rounded-md text-[14px] text-gray-300 hover:text-white flex items-center hover:bg-level-3 transition-colors">
              <LucideArrowLeft className="w-[14px] h-[14px] mr-2" /> Back to Apartments
            </Link>
            <div className="h-[36px] w-[200px] bg-level-1 border border-subtle rounded-md px-3 text-[14px] text-gray-300 flex items-center justify-between cursor-pointer hover:border-strong">
              <span>Last 30 Days</span>
              <LucideCalendar className="w-[14px] h-[14px] text-gray-500" />
            </div>
          </div>
        </div>

        {/* KPI CARDS ROW */}
        <div className="mt-6 flex gap-5 w-full">
          <KPIMini label="TODAY" value="18.4" unit="kWh" accent="amber" />
          <KPIMini label="THIS MONTH" value="423" unit="kWh" accent="blue" />
          <KPIMini label="ANOMALIES THIS MONTH" value="3" unit="" accent="red" pulse />
          <KPIMini label="VS SOCIETY AVG" value="+9.4%" unit="" accent="amber" />
        </div>

        {/* MAIN CHART */}
        <div className="mt-6 bg-level-2 border border-subtle rounded-xl p-6 h-[320px] w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[16px] font-semibold text-white">A112 — Consumption History (Last 30 Days)</h2>
            <div className="flex bg-level-1 border border-subtle rounded-md p-1">
              <button className="px-3 py-1 bg-level-3 text-white text-[12px] font-medium rounded-sm border border-subtle shadow-sm">Area</button>
              <button className="px-3 py-1 text-gray-400 text-[12px] font-medium hover:text-gray-200">Line</button>
              <button className="px-3 py-1 text-gray-400 text-[12px] font-medium hover:text-gray-200">Bar</button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBigKwh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(55,65,81,0.3)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontFamily: 'JetBrains Mono' }} dy={10} />
              <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontFamily: 'JetBrains Mono' }} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2D40', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontFamily: 'JetBrains Mono', fontWeight: 'bold' }}
                labelStyle={{ color: '#9CA3AF', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="kwh" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorBigKwh)" activeDot={{ r: 6 }} />
              {chartData.map((entry, index) => {
                if (entry.anomaly) {
                  return (
                    <g key={index}>
                      <line x1={`${(index / (chartData.length - 1)) * 100}%`} y1="0" x2={`${(index / (chartData.length - 1)) * 100}%`} y2="100%" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x={`${(index / (chartData.length - 1)) * 100}%`} y="10" fill="#F87171" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono" className="translate-y-[-10px] bg-red-900 px-1">{entry.date}</text>
                    </g>
                  );
                }
                return null;
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM TWO COLUMNS */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6 w-full">
          {/* ANOMALY HISTORY TABLE */}
          <div className="flex-[1.2] bg-level-2 border border-subtle rounded-xl p-6">
            <h3 className="text-[16px] font-semibold text-white">A112 Anomaly History</h3>
            <p className="text-[12px] text-gray-400 mt-1">3 events detected</p>

            <div className="mt-4 border border-subtle bg-level-1 rounded-lg overflow-hidden">
              <div className="flex items-center px-4 h-[40px] border-b border-subtle text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                <div className="w-[140px]">Date & Time</div>
                <div className="w-[100px]">Consumption</div>
                <div className="w-[100px]">Severity</div>
                <div className="w-[100px]">Status</div>
              </div>
              <div className="flex flex-col text-[14px]">
                <Row date="Jun 14 18:45" kwh="13.7" sev="Critical" stat="Investigating" />
                <Row date="Jun 9 07:22" kwh="14.9" sev="Critical" stat="Resolved" />
                <Row date="Jun 3 14:11" kwh="10.5" sev="Warning" stat="Resolved" last />
              </div>
            </div>
          </div>

          {/* HOURLY PATTERN HEATMAP */}
          <div className="flex-1 bg-level-2 border border-subtle rounded-xl p-6">
            <h3 className="text-[16px] font-semibold text-white">Consumption Patterns — Hourly</h3>
            <p className="text-[12px] text-gray-400 mt-1">Average kWh per hour over last 30 days</p>

            <div className="mt-4 aspect-[2/1] w-full flex flex-col pt-2 bg-level-1 rounded-lg border border-subtle p-4 justify-center items-center relative overflow-hidden">
              <span className="text-gray-500 opacity-50 font-mono text-[12px] absolute z-10 w-full text-center">[ Heatmap Matrix Rendering ]</span>
              <div className="w-full h-full grid grid-rows-7 gap-[2px] opacity-30 blur-sm">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="grid grid-cols-24 gap-[2px] w-full h-[28px]">
                    {[...Array(24)].map((_, j) => (
                       <div key={j} className="h-full w-full rounded-sm" style={{ backgroundColor: j >= 18 && j <= 22 ? ((i===5 || i===6) ? '#F59E0B' : '#EF4444') : (j >= 6 && j <= 9 ? '#1D4ED8' : '#1E3A5F')}}></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 bg-[rgba(245,158,11,0.08)] border border-amber-500/30 rounded-md p-3">
              <p className="text-[12px] text-amber-400 leading-tight">
                <span className="font-bold">💡 Peak usage:</span> Mon–Fri 18:00–22:00 · Likely HVAC and kitchen appliances
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const InfoChip = ({ children }) => (
  <span className="text-[12px] text-gray-400 font-inter font-medium bg-level-2 border border-subtle rounded-md px-3 py-1">
    {children}
  </span>
);

const KPIMini = ({ label, value, unit, accent, pulse }) => {
  const accentColors = { amber: 'text-amber-500', blue: 'text-blue-500', red: 'text-red-500' };
  return (
    <div className={`flex-[1] bg-level-2 border border-subtle rounded-lg p-5 relative overflow-hidden`}>
      <span className="text-[12px] text-gray-500 font-semibold uppercase tracking-[0.08em] block">{label}</span>
      <div className="mt-2 flex items-baseline gap-1 relative">
        <span className={`text-[28px] font-bold font-mono leading-none ${accentColors[accent]}`}>{value}</span>
        <span className="text-[14px] text-gray-400">{unit}</span>
        {pulse && <div className="absolute -top-1 -right-1 w-[8px] h-[8px] bg-red-500 rounded-full animate-ping-custom"></div>}
      </div>
    </div>
  );
}

const Row = ({ date, kwh, sev, stat, last }) => (
  <div className={`flex items-center px-4 h-[52px] ${!last ? 'border-b border-subtle' : ''}`}>
    <div className="w-[140px] text-gray-300 font-mono text-[13px]">{date}</div>
    <div className="w-[100px] text-red-400 font-mono font-semibold">{kwh} kWh</div>
    <div className="w-[100px]">
      <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${sev === 'Critical' ? 'bg-[#450A0A] text-red-400 border border-[#991B1B]' : 'bg-[#431407] text-amber-400 border border-[#92400E]'}`}>
        {sev}
      </span>
    </div>
    <div className="w-[100px] text-[13px] text-gray-400">{stat}</div>
  </div>
);
