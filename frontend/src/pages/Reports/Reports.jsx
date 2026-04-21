import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LucideFileText, LucideDownload, LucideFilter, LucideCalendar, LucideCheckCircle2, LucideClock, LucideZap, LucideAlertTriangle, LucideTrendingUp, LucideBarChart2 } from 'lucide-react';
import apiClient from '../../api/apiClient';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [anomalyStats, setAnomalyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [flatsRes, anomRes] = await Promise.allSettled([
          apiClient.get('/api/energy/all-flats'),
          apiClient.get('/api/energy/anomalies/all?limit=100')
        ]);

        if (flatsRes.status === 'fulfilled') {
          const flats = flatsRes.value.data.data || [];
          const totalKwh = flats.reduce((s, f) => s + (f.units_kWh || 0), 0);
          const activeFlats = flats.filter(f => f.units_kWh > 0).length;
          const anomalyFlats = flats.filter(f => f.isAnomaly).length;
          setStats({ totalKwh, activeFlats, anomalyFlats, totalFlats: flats.length });
        }

        if (anomRes.status === 'fulfilled') {
          setAnomalyStats({
            total: anomRes.value.data.total || 0,
            recent: anomRes.value.data.data || []
          });
        }
      } catch (err) {
        console.error('Failed to fetch report stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await apiClient.get('/api/energy/all-flats');
      const flats = res.data.data || [];
      const headers = ['Flat ID', 'Consumption (kWh)', 'Is Anomaly', 'Last Updated'];
      const rows = flats.map(f => [
        f.flatId,
        f.units_kWh.toFixed(3),
        f.isAnomaly ? 'Yes' : 'No',
        f.timestamp ? new Date(f.timestamp).toLocaleString('en-IN') : 'N/A'
      ]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `electrogyaan_report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleExportAnomalyCSV = async () => {
    try {
      const res = await apiClient.get('/api/energy/anomalies/all?limit=1000');
      const anomalies = res.data.data || [];
      const headers = ['Flat ID', 'Timestamp', 'Consumption (kWh)', 'ML Confidence'];
      const rows = anomalies.map(a => [
        a.flatId,
        new Date(a.timestamp).toLocaleString('en-IN'),
        a.units_kWh.toFixed(3),
        a.mlConfidence != null ? (a.mlConfidence * 100).toFixed(0) + '%' : 'N/A'
      ]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `electrogyaan_anomalies_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Anomaly export failed:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E] min-h-full">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[30px] font-bold text-white leading-tight font-inter">Reports & Exports</h1>
            <p className="text-[14px] text-gray-400 mt-1">Generate and download real-time energy reports</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="h-[40px] px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[14px] font-semibold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all"
          >
            <LucideFileText className="w-[16px] h-[16px]" /> Export All Data
          </button>
        </div>

        {/* LIVE STATS CARDS */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <StatCard
            icon={<LucideZap className="w-5 h-5 text-amber-400" />}
            bg="bg-amber-400/10"
            label="Total Consumption"
            value={loading ? '...' : `${stats?.totalKwh.toFixed(1)} kWh`}
            sub="Current snapshot"
            color="text-amber-400"
          />
          <StatCard
            icon={<LucideBarChart2 className="w-5 h-5 text-blue-400" />}
            bg="bg-blue-400/10"
            label="Active Flats"
            value={loading ? '...' : `${stats?.activeFlats} / ${stats?.totalFlats}`}
            sub="Reporting data"
            color="text-blue-400"
          />
          <StatCard
            icon={<LucideAlertTriangle className="w-5 h-5 text-red-400" />}
            bg="bg-red-400/10"
            label="Total Anomalies"
            value={loading ? '...' : `${anomalyStats?.total || 0}`}
            sub="All time"
            color="text-red-400"
          />
          <StatCard
            icon={<LucideTrendingUp className="w-5 h-5 text-green-400" />}
            bg="bg-green-400/10"
            label="Avg Consumption"
            value={loading ? '...' : stats?.activeFlats > 0 ? `${(stats.totalKwh / stats.activeFlats).toFixed(2)} kWh` : '0 kWh'}
            sub="Per active flat"
            color="text-green-400"
          />
        </div>

        <div className="mt-8 flex gap-8">
          {/* QUICK TEMPLATES */}
          <div className="w-[320px] flex-shrink-0 flex flex-col gap-4">
            <h2 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2">QUICK EXPORTS</h2>

            <TemplateCard
              title="All Flats Consumption"
              desc="Current kWh reading for all A101–A150 units."
              ext="CSV"
              onClick={handleExportCSV}
            />
            <TemplateCard
              title="Anomaly Incident Log"
              desc="All ML-flagged anomalies with timestamps and confidence."
              ext="CSV"
              onClick={handleExportAnomalyCSV}
            />
            <TemplateCard
              title="Peak Load Analysis"
              desc="Download hourly pattern data for load analysis."
              ext="CSV"
              onClick={async () => {
                try {
                  // Fetch hourly pattern for a sample flat (A101) as representative data
                  const res = await apiClient.get('/api/energy/hourly-pattern/A101');
                  const data = res.data.data || [];
                  const headers = ['Hour', 'Day of Week', 'Avg kWh'];
                  const rows = data.map(d => [d.hour, d.dayOfWeek, d.avgUnits]);
                  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `electrogyaan_hourly_${new Date().toISOString().slice(0, 10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error('Hourly export failed:', err);
                }
              }}
            />
          </div>

          {/* RECENT ANOMALIES TABLE */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4 pl-1">
              <h2 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">RECENT ANOMALIES</h2>
              <button
                onClick={handleExportAnomalyCSV}
                className="h-[32px] px-3 bg-level-2 border border-subtle rounded-md text-[13px] text-gray-300 hover:border-strong flex items-center gap-2"
              >
                <LucideDownload className="w-4 h-4" /> Export CSV
              </button>
            </div>

            <div className="border border-subtle bg-level-1 rounded-xl overflow-hidden">
              <div className="flex items-center px-6 h-[40px] border-b border-subtle bg-level-2 text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                <div className="w-[90px]">Flat ID</div>
                <div className="flex-1">Timestamp</div>
                <div className="w-[120px]">Consumption</div>
                <div className="w-[120px]">ML Confidence</div>
              </div>

              {loading ? (
                <div className="py-8 text-center text-gray-500">Loading...</div>
              ) : anomalyStats?.recent.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No anomalies recorded yet.</div>
              ) : (
                <div className="flex flex-col text-[14px]">
                  {anomalyStats?.recent.slice(0, 10).map((a, i) => (
                    <div
                      key={a._id}
                      className={`flex items-center px-6 h-[52px] border-b border-subtle hover:bg-level-2 transition-colors ${i % 2 === 0 ? '' : 'bg-level-2/50'}`}
                    >
                      <div className="w-[90px] font-mono font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {a.flatId}
                      </div>
                      <div className="flex-1 text-gray-400 font-mono text-[13px]">
                        {new Date(a.timestamp).toLocaleString('en-IN')}
                      </div>
                      <div className="w-[120px] text-red-400 font-mono font-semibold">
                        {a.units_kWh.toFixed(3)} kWh
                      </div>
                      <div className="w-[120px] text-amber-400 font-mono">
                        {a.mlConfidence != null ? `${(a.mlConfidence * 100).toFixed(0)}%` : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-[rgba(59,130,246,0.05)] border border-blue-500/20 rounded-xl flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                <LucideClock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-blue-400">Live Data</h4>
                <p className="text-[13px] text-gray-400 mt-1">
                  All data is fetched in real-time from MongoDB. Use the export buttons above to download CSV reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ icon, bg, label, value, sub, color }) => (
  <div className="bg-level-2 border border-subtle rounded-xl p-5">
    <div className="flex justify-between items-start mb-3">
      <span className="text-[12px] text-gray-500 font-semibold uppercase tracking-wide">{label}</span>
      <div className={`w-[32px] h-[32px] rounded-md flex items-center justify-center ${bg}`}>{icon}</div>
    </div>
    <div className={`text-[28px] font-mono font-bold ${color}`}>{value}</div>
    <div className="text-[12px] text-gray-500 mt-1">{sub}</div>
  </div>
);

const TemplateCard = ({ title, desc, ext, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 bg-level-2 border border-subtle hover:border-blue-500/50 rounded-xl cursor-pointer transition-colors group relative overflow-hidden"
  >
    <div className="absolute right-[-20px] top-[-20px] text-[60px] font-black text-white/[0.02] transform rotate-12 group-hover:text-blue-500/[0.05] transition-colors">{ext}</div>
    <h3 className="text-[15px] font-bold text-gray-100 group-hover:text-blue-400 relative z-10 transition-colors">{title}</h3>
    <p className="text-[13px] text-gray-400 mt-1 leading-snug relative z-10">{desc}</p>
    <div className="mt-4 flex items-center justify-between relative z-10">
      <span className="text-[11px] font-mono text-gray-500 bg-level-1 px-2 py-1 rounded-sm border border-subtle">{ext}</span>
      <span className="text-blue-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[13px] font-semibold">
        <LucideDownload className="w-4 h-4 mr-1" /> Download →
      </span>
    </div>
  </div>
);
