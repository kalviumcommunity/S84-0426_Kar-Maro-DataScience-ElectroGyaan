import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LucideLayoutGrid, LucideList, LucideMap, LucideSearch } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const flats = [
  { id: 'A101', floor: '1', wing: 'A', kwh: 14.2, status: 'Normal', month: '↑ 423 kWh/mo', anomalies: 0, trend: Array.from({length: 12}, () => Math.random() * 10 + 5) },
  { id: 'A102', floor: '1', wing: 'A', kwh: 16.8, status: 'Normal', month: '↑ 456 kWh/mo', anomalies: 0, trend: Array.from({length: 12}, () => Math.random() * 10 + 5) },
  { id: 'A103', floor: '1', wing: 'A', kwh: 13.1, status: 'Normal', month: '↓ 398 kWh/mo', anomalies: 0, trend: Array.from({length: 12}, () => Math.random() * 10 + 5) },
  { id: 'A104', floor: '1', wing: 'A', kwh: 15.5, status: 'Normal', month: '↑ 440 kWh/mo', anomalies: 0, trend: Array.from({length: 12}, () => Math.random() * 10 + 5) },
  { id: 'A105', floor: '1', wing: 'A', kwh: 12.7, status: 'Normal', month: '↓ 385 kWh/mo', anomalies: 0, trend: Array.from({length: 12}, () => Math.random() * 10 + 5) },
  { id: 'A106', floor: '1', wing: 'A', kwh: 14.9, status: 'Normal', month: '↑ 412 kWh/mo', anomalies: 0, trend: Array.from({length: 12}, () => Math.random() * 10 + 5) },
  { id: 'A107', floor: '1', wing: 'A', kwh: 11.8, status: 'Normal', month: '↓ 370 kWh/mo', anomalies: 0, trend: Array.from({length: 12}, () => Math.random() * 10 + 5) },
  { id: 'A108', floor: '1', wing: 'A', kwh: 14.9, status: 'Anomaly', month: '↑ 489 kWh/mo', anomalies: 3, trend: Array.from({length: 12}, () => Math.random() * 15 + 8) },
  { id: 'A109', floor: '1', wing: 'A', kwh: 13.4, status: 'Normal', month: '↑ 405 kWh/mo', anomalies: 0, trend: Array.from({length: 12}, () => Math.random() * 10 + 5) },
  { id: 'A110', floor: '1', wing: 'A', kwh: 15.1, status: 'Warning', month: '↑ 442 kWh/mo', anomalies: 1, trend: Array.from({length: 12}, () => Math.random() * 12 + 6) },
];

export default function Apartments() {
  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E] min-h-full">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[30px] font-bold text-white leading-tight font-inter">Apartments</h1>
            <p className="text-[14px] text-gray-400 mt-1">50 units monitored · Green Meadows Society</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-level-2 border border-subtle rounded-md p-[3px] flex gap-[2px]">
              <button className="h-[32px] px-3 bg-level-4 text-white border border-subtle rounded-sm shadow-sm flex items-center justify-center text-[12px] font-medium gap-2">
                <LucideLayoutGrid className="w-4 h-4" /> Grid
              </button>
              <button className="h-[32px] px-3 bg-transparent text-gray-400 hover:text-gray-200 flex items-center justify-center text-[12px] font-medium gap-2 rounded-sm transition-colors">
                <LucideList className="w-4 h-4" /> List
              </button>
              <button className="h-[32px] px-3 bg-transparent text-gray-400 hover:text-gray-200 flex items-center justify-center text-[12px] font-medium gap-2 rounded-sm transition-colors">
                <LucideMap className="w-4 h-4" /> Heatmap
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER ROW */}
        <div className="mt-5 flex gap-3">
          <div className="relative w-[240px]">
            <LucideSearch className="w-[15px] h-[15px] text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input type="text" placeholder="Search flat ID or block..." className="h-[36px] w-full bg-level-1 border border-subtle rounded-md pl-9 pr-3 text-[14px] text-gray-100 placeholder-gray-500 hover:border-strong focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]" />
          </div>

          <select className="h-[36px] w-[140px] bg-level-1 border border-subtle rounded-md px-3 text-[14px] text-gray-300 cursor-pointer focus:outline-none hover:bg-level-3">
            <option>Block: All</option>
            <option>A-Wing</option>
            <option>B-Wing</option>
            <option>C-Wing</option>
          </select>

          <select className="h-[36px] w-[140px] bg-level-1 border border-subtle rounded-md px-3 text-[14px] text-gray-300 cursor-pointer focus:outline-none hover:bg-level-3">
            <option>Status: All</option>
            <option>Normal</option>
            <option>Anomaly</option>
            <option>Warning</option>
          </select>

          <select className="h-[36px] w-[180px] bg-level-1 border border-subtle rounded-md px-3 text-[14px] text-gray-300 cursor-pointer focus:outline-none hover:bg-level-3 ml-auto">
            <option>Sort: Consumption ↓</option>
          </select>
        </div>

        {/* GRID VIEW */}
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {flats.map((flat) => (
            <ApartmentCard key={flat.id} {...flat} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

const ApartmentCard = ({ id, floor, wing, kwh, status, month, anomalies, trend }) => {
  const isAnomaly = status === 'Anomaly';
  const isWarning = status === 'Warning';
  
  const statusColor = isAnomaly ? 'red' : isWarning ? 'amber' : 'green';
  const baseColorHex = isAnomaly ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';

  const chartData = trend.map((v, i) => ({ name: i, value: v }));

  return (
    <div className={`relative h-[180px] bg-level-2 border rounded-xl p-4 cursor-pointer transition-all duration-200 group
      ${isAnomaly ? 'border-red-500/50 bg-gradient-to-br from-[#111827] to-[rgba(127,29,29,0.15)] shadow-[0_0_16px_rgba(239,68,68,0.15)]' : 
        isWarning ? 'border-amber-500/50 bg-gradient-to-br from-[#111827] to-[rgba(180,83,9,0.1)]' : 
        'border-subtle hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-[2px]'
      }`}>
      
      {isAnomaly && (
        <div className="absolute top-4 right-4 w-[8px] h-[8px] bg-red-500 rounded-full animate-ping-custom"></div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[18px] font-bold text-white font-mono leading-none tracking-wide">{id}</h3>
          <p className="text-[12px] text-gray-500 mt-[2px]">Floor {floor} · {wing}-Wing</p>
        </div>
        {!isAnomaly && (
          <div className="flex gap-[6px]">
            <div className={`w-[10px] h-[10px] rounded-full bg-${statusColor}-500`}></div>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-3 flex items-baseline">
        <span className={`text-[24px] font-bold font-mono text-${statusColor}-500 leading-none`}>{kwh}</span>
        <span className="text-[12px] text-gray-400 ml-1">kWh</span>
      </div>

      {/* Sparkline */}
      <div className="mt-2 h-[40px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
             <defs>
              <linearGradient id={`color-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={baseColorHex} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={baseColorHex} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={baseColorHex} strokeWidth={1.5} fillOpacity={1} fill={`url(#color-${id})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom info */}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-[12px] text-gray-400">{month}</span>
        {anomalies > 0 ? (
          <span className="text-[12px] text-red-500 font-semibold flex items-center gap-1">⚠ {anomalies}</span>
        ) : (
          <span className="text-[12px] text-green-400 font-semibold flex items-center gap-1">✓ Normal</span>
        )}
      </div>
    </div>
  );
};
