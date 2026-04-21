import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LucideDownload, LucideAlertTriangle, LucideClock, LucideCheckCircle, LucideSearch, LucideArrowUpDown, LucideArrowUp } from 'lucide-react';

const anomalies = [
  { id: 'A112', time: '18:45:12', date: 'Jun 14, 2024', kwh: '13.7', deviation: '+174%', status: 'New', severity: 'Critical' },
  { id: 'A134', time: '18:32:07', date: 'Jun 14, 2024', kwh: '11.2', deviation: '+46%', status: 'Investigating', severity: 'Warning' },
  { id: 'A108', time: '17:58:44', date: 'Jun 14, 2024', kwh: '14.9', deviation: '+196%', status: 'New', severity: 'Critical' },
  { id: 'A127', time: '17:45:19', date: 'Jun 14, 2024', kwh: '10.5', deviation: '+21%', status: 'New', severity: 'Warning' },
  { id: 'A119', time: '16:22:03', date: 'Jun 14, 2024', kwh: '12.8', deviation: '+67%', status: 'Investigating', severity: 'Critical' },
  { id: 'A143', time: '15:10:55', date: 'Jun 14, 2024', kwh: '11.7', deviation: '+53%', status: 'Resolved', severity: 'Warning' },
  { id: 'A102', time: '14:08:32', date: 'Jun 14, 2024', kwh: '13.1', deviation: '+70%', status: 'Resolved', severity: 'Critical' },
  { id: 'A138', time: '13:55:17', date: 'Jun 14, 2024', kwh: '10.8', deviation: '+29%', status: 'Resolved', severity: 'Warning' },
];

export default function AnomalyLog() {
  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E] min-h-full">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[30px] font-bold text-white leading-tight font-inter">Anomaly Log</h1>
            <p className="text-[14px] text-gray-400 mt-1">1,800 total · 7 active · 120 resolved this month</p>
          </div>
          <div className="flex gap-3">
            <button className="h-[36px] px-4 border border-default rounded-md text-[14px] text-gray-300 font-medium hover:border-strong hover:bg-level-3 hover:text-white transition-all flex items-center">
              <LucideDownload className="w-[14px] h-[14px] mr-2" /> Export CSV
            </button>
            <button className="h-[36px] px-4 border border-default rounded-md text-[14px] text-gray-300 font-medium hover:border-strong hover:bg-level-3 hover:text-white transition-all flex items-center">
              <LucideDownload className="w-[14px] h-[14px] mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="mt-6 flex gap-4">
          <StatCard bg="bg-[rgba(239,68,68,0.1)]" icon={<LucideAlertTriangle className="text-red-500" />} num="7 Active" numClass="text-red-500" />
          <StatCard bg="bg-[rgba(245,158,11,0.1)]" icon={<LucideClock className="text-amber-500" />} num="1,673 Historical" numClass="text-amber-500" />
          <StatCard bg="bg-[rgba(16,185,129,0.1)]" icon={<LucideCheckCircle className="text-green-500" />} num="120 Resolved" numClass="text-green-500" />
        </div>

        {/* FILTER BAR */}
        <div className="mt-6 bg-level-2 border border-subtle rounded-xl p-[16px_20px] flex items-center gap-4 flex-wrap">
          <div className="relative w-[240px]">
            <LucideSearch className="w-[15px] h-[15px] text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input type="text" placeholder="Search flat ID..." className="h-[36px] w-full bg-level-1 border border-subtle rounded-md pl-9 pr-3 text-[14px] text-gray-100 placeholder-gray-500 hover:border-strong focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]" />
          </div>

          <div className="w-[1px] h-[24px] bg-gray-700"></div>

          <div className="flex gap-[6px]">
            <TimePill label="All" active />
            <TimePill label="Today" />
            <TimePill label="This Week" />
            <TimePill label="Month" />
          </div>

          <select className="h-[36px] w-[150px] bg-level-1 border border-subtle rounded-md px-3 text-[14px] text-gray-300 cursor-pointer focus:outline-none hover:bg-level-3">
            <option>Status: All</option>
            <option>New</option>
            <option>Investigating</option>
            <option>Resolved</option>
          </select>

          <select className="h-[36px] w-[170px] bg-level-1 border border-subtle rounded-md px-3 text-[14px] text-gray-300 cursor-pointer focus:outline-none hover:bg-level-3">
            <option>Severity: All</option>
            <option>Critical (&gt;12 kWh)</option>
            <option>Warning (10-12 kWh)</option>
          </select>

          <div className="ml-auto flex items-center gap-4">
            <span className="text-[12px] text-gray-500">Showing 1,800 results</span>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="mt-5 bg-level-2 border border-subtle rounded-xl overflow-hidden">
          <div className="h-[40px] bg-level-1 border-b border-[rgba(55,65,81,0.5)] px-5 flex items-center">
            <div className="w-[80px] flex items-center gap-1 text-[12px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer">FLAT ID <LucideArrowUpDown className="w-[12px] h-[12px]" /></div>
            <div className="w-[160px] flex items-center gap-1 text-[12px] font-semibold text-blue-400 uppercase tracking-wide cursor-pointer">TIMESTAMP <LucideArrowUp className="w-[12px] h-[12px]" /></div>
            <div className="w-[120px] flex items-center gap-1 text-[12px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer">CONSUMPTION <LucideArrowUpDown className="w-[12px] h-[12px]" /></div>
            <div className="w-[110px] flex items-center gap-1 text-[12px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer">DEVIATION <LucideArrowUpDown className="w-[12px] h-[12px]" /></div>
            <div className="w-[120px] text-[12px] font-semibold text-gray-500 uppercase tracking-wide">STATUS</div>
            <div className="w-[110px] text-[12px] font-semibold text-gray-500 uppercase tracking-wide">SEVERITY</div>
            <div className="w-[100px] text-[12px] font-semibold text-gray-500 uppercase tracking-wide text-right">ACTIONS</div>
          </div>
          
          <div className="flex flex-col">
            {anomalies.map((row, i) => (
              <div key={i} className={`h-[52px] px-5 flex items-center border-b border-[rgba(55,65,81,0.25)] hover:bg-level-4 hover:border-l-2 hover:border-l-blue-500 hover:pl-[18px] cursor-pointer transition-all ${i % 2 === 0 ? 'bg-level-2' : 'bg-level-3'}`}>
                <div className="w-[80px] flex items-center gap-[6px]">
                  {row.status !== 'Resolved' && <div className="w-[6px] h-[6px] bg-red-500 rounded-full"></div>}
                  <span className="text-[14px] font-mono font-semibold text-white">{row.id}</span>
                </div>
                <div className="w-[160px]">
                  <div className="text-[14px] font-mono text-gray-200">{row.time}</div>
                  <div className="text-[12px] text-gray-500">{row.date}</div>
                </div>
                <div className="w-[120px] text-[14px] font-mono font-semibold flex items-center gap-1 text-red-400">
                  <LucideArrowUp className="w-[12px] h-[12px]" /> {row.kwh} kWh
                </div>
                <div className={`w-[110px] text-[14px] font-mono ${row.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'}`}>
                  {row.deviation}
                </div>
                <div className="w-[120px]">
                  <StatusBadge status={row.status} />
                </div>
                <div className="w-[110px]">
                  <SeverityBadge severity={row.severity} />
                </div>
                <div className="w-[100px] flex justify-end items-center gap-2">
                  <span className="text-[12px] text-blue-400 hover:underline">View</span>
                  <span className="text-gray-700">|</span>
                  <span className="text-[12px] text-green-400 hover:underline">Resolve</span>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[52px] border-t border-subtle px-5 flex justify-between items-center bg-level-2">
            <span className="text-[14px] text-gray-400">Showing 1–8 of 1,800 anomalies</span>
            <div className="flex gap-1">
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded border border-subtle text-gray-400 hover:bg-level-3">←</button>
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded bg-[rgba(37,99,235,0.2)] text-blue-400 border border-[rgba(59,130,246,0.3)]">1</button>
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded hover:bg-level-3 text-gray-400">2</button>
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded hover:bg-level-3 text-gray-400">3</button>
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded text-gray-400">...</button>
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded hover:bg-level-3 text-gray-400">72</button>
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded border border-subtle text-gray-400 hover:bg-level-3">→</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Subcomponents

const StatCard = ({ icon, num, numClass, bg }) => (
  <div className="flex-1 bg-level-2 border border-subtle rounded-md h-[72px] px-4 flex items-center gap-[14px]">
    <div className={`w-[32px] h-[32px] rounded-md flex justify-center items-center ${bg}`}>{icon}</div>
    <div>
      <div className={`font-mono text-[24px] font-bold leading-none ${numClass}`}>{num.split(' ')[0]}</div>
      <div className="text-[12px] text-gray-500 uppercase font-semibold mt-1">{num.split(' ')[1]}</div>
    </div>
  </div>
);

const TimePill = ({ label, active }) => (
  <button className={`h-[30px] px-[14px] rounded-md text-[12px] font-semibold transition-colors ${
    active 
    ? 'bg-[rgba(37,99,235,0.2)] text-blue-400 border border-[rgba(59,130,246,0.3)]' 
    : 'bg-level-1 text-gray-400 border border-transparent hover:text-gray-200'
  }`}>
    {label}
  </button>
);

const StatusBadge = ({ status }) => {
  if (status === 'New') return <span className="bg-[#1E3A5F] text-blue-300 border border-blue-700 h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em]">New</span>;
  if (status === 'Investigating') return <span className="bg-[#431407] text-amber-400 border border-amber-800 h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em]">Investigating</span>;
  if (status === 'Resolved') return <span className="bg-[#1C1917] text-gray-400 border border-gray-600 h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em]">Resolved</span>;
  return null;
};

const SeverityBadge = ({ severity }) => {
  if (severity === 'Critical') {
    return (
      <span className="bg-[#450A0A] text-red-300 border border-red-800 h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em] flex items-center gap-[6px] w-fit">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-custom"></span>
        Critical
      </span>
    );
  }
  return <span className="bg-[#431407] text-amber-400 border border-amber-800 h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em]">Warning</span>;
};
