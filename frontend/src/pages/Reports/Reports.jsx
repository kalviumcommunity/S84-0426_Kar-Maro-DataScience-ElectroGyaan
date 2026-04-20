import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LucideFileText, LucideDownload, LucideFilter, LucideCalendar, LucideCheckCircle2, LucideClock } from 'lucide-react';

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E] min-h-full">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[30px] font-bold text-white leading-tight font-inter">Reports & Exports</h1>
            <p className="text-[14px] text-gray-400 mt-1">Generate PDF and CSV reports for compliance and auditing</p>
          </div>
          <button className="h-[40px] px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[14px] font-semibold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all">
            <LucideFileText className="w-[16px] h-[16px]" /> Generate New Report
          </button>
        </div>

        <div className="mt-8 flex gap-8">
          {/* QUICK TEMPLATES (left col) */}
          <div className="w-[320px] flex-shrink-0 flex flex-col gap-4">
            <h2 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2">QUICK TEMPLATES</h2>
            <TemplateCard title="Monthly Consumption Summary" desc="Aggregated kWh usage per block for billing." icon="bar" ext="CSV" />
            <TemplateCard title="Anomaly Incident Log" desc="All flagged Phase-2 anomalies over 30 days." icon="alert" ext="PDF" />
            <TemplateCard title="Sustainability & Carbon" desc="Estimated CO2 offset and green impact." icon="leaf" ext="PDF, CSV" />
            <TemplateCard title="Peak Load Analysis" desc="Hourly demand curve for HVAC optimization." icon="zap" ext="CSV" />
          </div>

          {/* RECENT REPORTS (right col) */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 pl-1">
              <h2 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">RECENT EXPORTS</h2>
              <div className="flex gap-3">
                <button className="h-[32px] px-3 bg-level-2 border border-subtle rounded-md text-[13px] text-gray-300 hover:border-strong flex items-center gap-2">
                  <LucideFilter className="w-4 h-4" /> Filter
                </button>
                <button className="h-[32px] px-3 bg-level-2 border border-subtle rounded-md text-[13px] text-gray-300 hover:border-strong flex items-center gap-2">
                  <LucideCalendar className="w-4 h-4" /> Date Range
                </button>
              </div>
            </div>

            <div className="border border-subtle bg-level-1 rounded-xl overflow-hidden">
              <div className="flex items-center px-6 h-[48px] border-b border-subtle bg-level-2 text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                <div className="flex-[2]">Report Name</div>
                <div className="flex-1">Date Generated</div>
                <div className="flex-[0.8] text-center">Format</div>
                <div className="flex-1">Status</div>
                <div className="flex-[0.5] text-right">Actions</div>
              </div>

              <div className="flex flex-col text-[14px]">
                <Row title="May 2024 Consumption Summary" date="Jun 01, 00:05" fmt="CSV" status="Ready" />
                <Row title="Weekly Anomaly Audit - Week 22" date="Jun 01, 10:30" fmt="PDF" status="Ready" />
                <Row title="Phase-1 Unbalanced Load Report" date="May 28, 14:15" fmt="PDF" status="Ready" />
                <Row title="Custom Export: A-Wing Q2" date="May 25, 09:44" fmt="CSV" status="Processing" />
                <Row title="Custom Export: C-Wing Q2" date="May 25, 09:42" fmt="CSV" status="Failed" last />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[rgba(59,130,246,0.05)] border border-blue-500/20 rounded-xl flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                 <LucideClock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-blue-400">Scheduled Reports Active</h4>
                <p className="text-[13px] text-gray-400 mt-1">The system is configured to auto-generate the 'Monthly Consumption Summary' on the 1st of every month at 00:00 IST.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const TemplateCard = ({ title, desc, ext }) => (
  <div className="p-4 bg-level-2 border border-subtle hover:border-blue-500/50 rounded-xl cursor-pointer transition-colors group relative overflow-hidden">
    <div className="absolute right-[-20px] top-[-20px] text-[60px] font-black text-white/[0.02] transform rotate-12 group-hover:text-blue-500/[0.05] transition-colors">{ext.split(',')[0]}</div>
    <h3 className="text-[15px] font-bold text-gray-100 group-hover:text-blue-400 relative z-10 transition-colors">{title}</h3>
    <p className="text-[13px] text-gray-400 mt-1 leading-snug relative z-10">{desc}</p>
    <div className="mt-4 flex items-center justify-between relative z-10">
      <span className="text-[11px] font-mono text-gray-500 bg-level-1 px-2 py-1 rounded-sm border border-subtle">{ext}</span>
      <button className="text-blue-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[13px] font-semibold">Use Template →</button>
    </div>
  </div>
);

const Row = ({ title, date, fmt, status, last }) => {
  const isReady = status === 'Ready';
  const isProcessing = status === 'Processing';
  const isFailed = status === 'Failed';

  return (
    <div className={`flex items-center px-6 h-[64px] hover:bg-level-2 transition-colors ${!last ? 'border-b border-subtle' : ''}`}>
      <div className="flex-[2] font-medium text-gray-200 truncate pr-4">{title}</div>
      <div className="flex-1 text-gray-400 font-mono text-[13px]">{date}</div>
      <div className="flex-[0.8] text-center">
        <span className={`text-[11px] font-bold font-mono px-2 py-1 rounded-sm border ${fmt === 'CSV' ? 'bg-[#064E3B] text-green-400 border-[#047857]' : 'bg-[#7F1D1D] text-red-400 border-[#B91C1C]'}`}>{fmt}</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        {isReady && <><LucideCheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-green-500 font-medium">{status}</span></>}
        {isProcessing && <><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div><span className="text-blue-400 font-medium">{status}</span></>}
        {isFailed && <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-red-500 font-medium">{status}</span></>}
      </div>
      <div className="flex-[0.5] text-right">
        {isReady ? (
          <button className="p-2 bg-level-3 hover:bg-level-4 rounded-md border border-subtle text-gray-300 hover:text-white transition-colors">
            <LucideDownload className="w-4 h-4" />
          </button>
        ) : (
          <button disabled className="p-2 opacity-30 cursor-not-allowed rounded-md border border-transparent text-gray-500">
            <LucideDownload className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
