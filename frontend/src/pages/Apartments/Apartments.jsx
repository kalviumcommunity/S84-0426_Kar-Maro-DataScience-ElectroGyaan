import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LucideLayoutGrid, LucideList, LucideSearch, LucideRefreshCw } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import apiClient from '../../api/apiClient';

export default function Apartments() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('desc');
  const navigate = useNavigate();

  const fetchFlats = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/energy/all-flats');
      setFlats(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch flats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlats();
    const interval = setInterval(fetchFlats, 10000);
    return () => clearInterval(interval);
  }, [fetchFlats]);

  const filtered = flats
    .filter(f => {
      const matchSearch = f.flatId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All'
        ? true
        : statusFilter === 'Anomaly' ? f.isAnomaly
        : statusFilter === 'Normal' ? !f.isAnomaly && f.units_kWh > 0
        : f.units_kWh === 0;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'asc-id' || sortBy === 'desc') {
        // Default: sort by flat ID ascending (A101, A102, ...)
        return parseInt(a.flatId.slice(1)) - parseInt(b.flatId.slice(1));
      }
      if (sortBy === 'kwh-desc') return b.units_kWh - a.units_kWh;
      if (sortBy === 'kwh-asc')  return a.units_kWh - b.units_kWh;
      return parseInt(a.flatId.slice(1)) - parseInt(b.flatId.slice(1));
    });

  const activeCount = flats.filter(f => f.units_kWh > 0).length;
  const anomalyCount = flats.filter(f => f.isAnomaly).length;

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E] min-h-full">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[30px] font-bold text-white leading-tight font-inter">Apartments</h1>
            <p className="text-[14px] text-gray-400 mt-1">
              {loading ? 'Loading...' : `${activeCount} active · ${anomalyCount} anomalies · ${flats.length} total units`}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={fetchFlats} className="h-[36px] px-3 border border-subtle rounded-md text-gray-400 hover:text-white hover:border-strong transition-colors flex items-center gap-2 text-[13px]">
              <LucideRefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER ROW */}
        <div className="mt-5 flex gap-3 flex-wrap">
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

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-[36px] w-[160px] bg-level-1 border border-subtle rounded-md px-3 text-[14px] text-gray-300 cursor-pointer focus:outline-none hover:bg-level-3"
          >
            <option value="All">Status: All</option>
            <option value="Normal">Normal</option>
            <option value="Anomaly">Anomaly</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="h-[36px] w-[220px] bg-level-1 border border-subtle rounded-md px-3 text-[14px] text-gray-300 cursor-pointer focus:outline-none hover:bg-level-3 ml-auto"
          >
            <option value="desc">Sort: Flat ID ↑ (A101 first)</option>
            <option value="kwh-desc">Sort: Consumption ↓</option>
            <option value="kwh-asc">Sort: Consumption ↑</option>
          </select>
        </div>

        {/* GRID VIEW */}
        {loading ? (
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-[180px] bg-level-2 border border-subtle rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 text-center text-gray-500">No flats match your filters.</div>
        ) : (
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {filtered.map(flat => (
              <ApartmentCard
                key={flat.flatId}
                flat={flat}
                onClick={() => navigate(`/user/${flat.flatId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const ApartmentCard = ({ flat, onClick }) => {
  const { flatId, units_kWh, isAnomaly, timestamp } = flat;
  const isInactive = units_kWh === 0;
  const statusColor = isAnomaly ? 'red' : isInactive ? 'gray' : 'green';
  const baseColorHex = isAnomaly ? '#EF4444' : isInactive ? '#6B7280' : '#10B981';
  // Fake sparkline from single value — in real use you'd store history
  const trend = Array.from({ length: 12 }, (_, i) => ({ name: i, value: units_kWh * (0.8 + Math.random() * 0.4) }));
  const floor = flatId.replace('A', '').slice(0, -1) || '1';

  return (
    <div
      onClick={onClick}
      className={`relative h-[180px] bg-level-2 border rounded-xl p-4 cursor-pointer transition-all duration-200 group
        ${isAnomaly
          ? 'border-red-500/50 bg-gradient-to-br from-[#111827] to-[rgba(127,29,29,0.15)] shadow-[0_0_16px_rgba(239,68,68,0.15)]'
          : 'border-subtle hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-[2px]'
        }`}
    >
      {isAnomaly && (
        <div className="absolute top-4 right-4 w-[8px] h-[8px] bg-red-500 rounded-full animate-ping"></div>
      )}

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[18px] font-bold text-white font-mono leading-none tracking-wide">{flatId}</h3>
          <p className="text-[12px] text-gray-500 mt-[2px]">Floor {floor} · A-Wing</p>
        </div>
        {!isAnomaly && (
          <div className={`w-[10px] h-[10px] rounded-full bg-${statusColor}-500`}></div>
        )}
      </div>

      <div className="mt-3 flex items-baseline">
        <span className={`text-[24px] font-bold font-mono text-${statusColor}-500 leading-none`}>
          {units_kWh.toFixed(2)}
        </span>
        <span className="text-[12px] text-gray-400 ml-1">kWh</span>
      </div>

      <div className="mt-2 h-[40px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${flatId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={baseColorHex} stopOpacity={0.8} />
                <stop offset="100%" stopColor={baseColorHex} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={baseColorHex} strokeWidth={1.5} fillOpacity={1} fill={`url(#color-${flatId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <span className="text-[11px] text-gray-500">
          {timestamp ? new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'No data'}
        </span>
        {isAnomaly ? (
          <span className="text-[12px] text-red-500 font-semibold">⚠ Anomaly</span>
        ) : isInactive ? (
          <span className="text-[12px] text-gray-500 font-semibold">Inactive</span>
        ) : (
          <span className="text-[12px] text-green-400 font-semibold">✓ Normal</span>
        )}
      </div>
    </div>
  );
};
