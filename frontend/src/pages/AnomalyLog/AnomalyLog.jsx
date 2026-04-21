import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LucideAlertTriangle, LucideClock, LucideCheckCircle, LucideSearch, LucideArrowUpDown, LucideArrowUp, LucideRefreshCw } from 'lucide-react';
import apiClient from '../../api/apiClient';

const PAGE_SIZE = 15;

export default function AnomalyLog() {
  const [anomalies, setAnomalies] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('All');

  const fetchAnomalies = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/energy/anomalies/all?page=${p}&limit=${PAGE_SIZE}`);
      setAnomalies(res.data.data || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
      setPage(p);
    } catch (err) {
      console.error('Failed to fetch anomalies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnomalies(1);
    const interval = setInterval(() => fetchAnomalies(page), 15000);
    return () => clearInterval(interval);
  }, [fetchAnomalies]);

  // Filter by search and time
  const now = Date.now();
  const filtered = anomalies.filter(a => {
    const matchSearch = !search || a.flatId.toLowerCase().includes(search.toLowerCase());
    const ts = new Date(a.timestamp).getTime();
    const matchTime =
      timeFilter === 'All' ? true
      : timeFilter === 'Today' ? ts > now - 86400000
      : timeFilter === 'This Week' ? ts > now - 7 * 86400000
      : timeFilter === 'Month' ? ts > now - 30 * 86400000
      : true;
    return matchSearch && matchTime;
  });

  // Stats
  const todayCount = anomalies.filter(a => new Date(a.timestamp).getTime() > now - 86400000).length;
  const resolvedCount = 0; // backend doesn't track resolved state yet

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E] min-h-full">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[30px] font-bold text-white leading-tight font-inter">Anomaly Log</h1>
            <p className="text-[14px] text-gray-400 mt-1">
              {loading ? 'Loading...' : `${total} total · ${todayCount} today`}
            </p>
          </div>
          <button
            onClick={() => fetchAnomalies(page)}
            className="h-[36px] px-4 border border-subtle rounded-md text-[14px] text-gray-300 font-medium hover:border-strong hover:bg-level-3 hover:text-white transition-all flex items-center gap-2"
          >
            <LucideRefreshCw className="w-[14px] h-[14px]" /> Refresh
          </button>
        </div>

        {/* STATS ROW */}
        <div className="mt-6 flex gap-4">
          <StatCard bg="bg-[rgba(239,68,68,0.1)]" icon={<LucideAlertTriangle className="text-red-500 w-5 h-5" />} num={`${todayCount} Today`} numClass="text-red-500" />
          <StatCard bg="bg-[rgba(245,158,11,0.1)]" icon={<LucideClock className="text-amber-500 w-5 h-5" />} num={`${total} Total`} numClass="text-amber-500" />
          <StatCard bg="bg-[rgba(16,185,129,0.1)]" icon={<LucideCheckCircle className="text-green-500 w-5 h-5" />} num={`${pages} Pages`} numClass="text-green-500" />
        </div>

        {/* FILTER BAR */}
        <div className="mt-6 bg-level-2 border border-subtle rounded-xl p-[16px_20px] flex items-center gap-4 flex-wrap">
          <div className="relative w-[240px]">
            <LucideSearch className="w-[15px] h-[15px] text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search flat ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-[36px] w-full bg-level-1 border border-subtle rounded-md pl-9 pr-3 text-[14px] text-gray-100 placeholder-gray-500 hover:border-strong focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-[1px] h-[24px] bg-gray-700"></div>

          <div className="flex gap-[6px]">
            {['All', 'Today', 'This Week', 'Month'].map(label => (
              <button
                key={label}
                onClick={() => setTimeFilter(label)}
                className={`h-[30px] px-[14px] rounded-md text-[12px] font-semibold transition-colors ${
                  timeFilter === label
                    ? 'bg-[rgba(37,99,235,0.2)] text-blue-400 border border-[rgba(59,130,246,0.3)]'
                    : 'bg-level-1 text-gray-400 border border-transparent hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="text-[12px] text-gray-500">Showing {filtered.length} of {total} results</span>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="mt-5 bg-level-2 border border-subtle rounded-xl overflow-hidden">
          <div className="h-[40px] bg-level-1 border-b border-[rgba(55,65,81,0.5)] px-5 flex items-center">
            <div className="w-[90px] flex items-center gap-1 text-[12px] font-semibold text-gray-500 uppercase tracking-wide">FLAT ID <LucideArrowUpDown className="w-[12px] h-[12px]" /></div>
            <div className="w-[200px] flex items-center gap-1 text-[12px] font-semibold text-blue-400 uppercase tracking-wide">TIMESTAMP <LucideArrowUp className="w-[12px] h-[12px]" /></div>
            <div className="w-[140px] flex items-center gap-1 text-[12px] font-semibold text-gray-500 uppercase tracking-wide">CONSUMPTION</div>
            <div className="w-[120px] text-[12px] font-semibold text-gray-500 uppercase tracking-wide">ML CONFIDENCE</div>
            <div className="w-[120px] text-[12px] font-semibold text-gray-500 uppercase tracking-wide">SEVERITY</div>
          </div>

          {loading ? (
            <div className="flex flex-col">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[52px] px-5 flex items-center border-b border-[rgba(55,65,81,0.25)] animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-16 mr-8"></div>
                  <div className="h-4 bg-gray-700 rounded w-40 mr-8"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-500">No anomalies found.</div>
          ) : (
            <div className="flex flex-col">
              {filtered.map((row, i) => {
                const ts = new Date(row.timestamp);
                const confidence = row.mlConfidence != null ? `${(row.mlConfidence * 100).toFixed(0)}%` : 'N/A';
                const isCritical = row.units_kWh > 12;
                return (
                  <div
                    key={row._id}
                    className={`h-[52px] px-5 flex items-center border-b border-[rgba(55,65,81,0.25)] hover:bg-level-4 cursor-pointer transition-all ${i % 2 === 0 ? 'bg-level-2' : 'bg-level-3'}`}
                  >
                    <div className="w-[90px] flex items-center gap-[6px]">
                      <div className="w-[6px] h-[6px] bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-[14px] font-mono font-semibold text-white">{row.flatId}</span>
                    </div>
                    <div className="w-[200px]">
                      <div className="text-[14px] font-mono text-gray-200">
                        {ts.toLocaleTimeString('en-IN')}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        {ts.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="w-[140px] text-[14px] font-mono font-semibold flex items-center gap-1 text-red-400">
                      <LucideArrowUp className="w-[12px] h-[12px]" /> {row.units_kWh.toFixed(3)} kWh
                    </div>
                    <div className={`w-[120px] text-[14px] font-mono ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                      {confidence}
                    </div>
                    <div className="w-[120px]">
                      <SeverityBadge critical={isCritical} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION */}
          <div className="h-[52px] border-t border-subtle px-5 flex justify-between items-center bg-level-2">
            <span className="text-[14px] text-gray-400">
              Page {page} of {pages} · {total} total anomalies
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => fetchAnomalies(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-[32px] h-[32px] flex items-center justify-center rounded border border-subtle text-gray-400 hover:bg-level-3 disabled:opacity-30"
              >←</button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => fetchAnomalies(p)}
                    className={`w-[32px] h-[32px] flex items-center justify-center rounded text-[13px] ${
                      page === p
                        ? 'bg-[rgba(37,99,235,0.2)] text-blue-400 border border-[rgba(59,130,246,0.3)]'
                        : 'hover:bg-level-3 text-gray-400'
                    }`}
                  >{p}</button>
                );
              })}
              {pages > 5 && <button className="w-[32px] h-[32px] flex items-center justify-center text-gray-400">...</button>}
              <button
                onClick={() => fetchAnomalies(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="w-[32px] h-[32px] flex items-center justify-center rounded border border-subtle text-gray-400 hover:bg-level-3 disabled:opacity-30"
              >→</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ icon, num, numClass, bg }) => (
  <div className="flex-1 bg-level-2 border border-subtle rounded-md h-[72px] px-4 flex items-center gap-[14px]">
    <div className={`w-[36px] h-[36px] rounded-md flex justify-center items-center ${bg}`}>{icon}</div>
    <div>
      <div className={`font-mono text-[24px] font-bold leading-none ${numClass}`}>{num.split(' ')[0]}</div>
      <div className="text-[12px] text-gray-500 uppercase font-semibold mt-1">{num.split(' ').slice(1).join(' ')}</div>
    </div>
  </div>
);

const SeverityBadge = ({ critical }) => critical ? (
  <span className="bg-[#450A0A] text-red-300 border border-red-800 h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em] flex items-center gap-[6px] w-fit">
    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
    Critical
  </span>
) : (
  <span className="bg-[#431407] text-amber-400 border border-amber-800 h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em]">Warning</span>
);
