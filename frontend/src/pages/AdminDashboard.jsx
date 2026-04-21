import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { energyApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  LucideZap, LucideAlertTriangle, LucideBarChart2, LucideTrendingUp,
  LucideBuilding2, LucideChevronDown, LucideUsers
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Scatter, ComposedChart
} from 'recharts';

// Dummy data for demonstration
const chartData = [
  { time: '18:00', kwh: 12.1 },
  { time: '18:15', kwh: 12.8 },
  { time: '18:30', kwh: 13.2 },
  { time: '18:45', kwh: 13.7, anomaly: true, id: 'A112' },
  { time: '19:00', kwh: 14.1 },
  { time: '19:15', kwh: 14.8 },
  { time: '19:30', kwh: 15.2 },
  { time: '19:45', kwh: 14.6 }
];

const anomalyFeed = [
  { id: 'A112', kwh: '13.7', time: '18:45:12 · Today', level: 'Critical' },
  { id: 'A134', kwh: '11.2', time: '18:32:07 · Today', level: 'Warning' },
  { id: 'A108', kwh: '14.9', time: '17:58:44 · Today', level: 'Critical' },
  { id: 'A127', kwh: '10.5', time: '17:45:19 · Today', level: 'Warning' },
  { id: 'A119', kwh: '12.8', time: '16:22:03 · Today', level: 'Critical' },
];

function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await energyApi.getUsers();
        if (response.success && response.data.length > 0) {
          setUsers(response.data.sort());
          if (!response.data.includes(selectedUser)) {
            setSelectedUser(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E]">
        {/* ADMIN HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-[30px] font-semibold text-white">Admin Dashboard</h1>
            <p className="text-[14px] text-gray-400 mt-1">Monitor all apartments and users</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-level-2 border border-subtle rounded-md px-4 py-2">
              <LucideUsers className="w-4 h-4 text-blue-400" />
              <span className="text-[14px] text-gray-300">Admin: {user?.name}</span>
            </div>
          </div>
        </div>

        {/* USER SELECTOR */}
        <div className="mb-6 bg-level-2 border border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LucideBuilding2 className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-[12px] text-gray-500 font-semibold uppercase tracking-[0.08em]">SELECTED APARTMENT</div>
                <div className="text-[18px] font-semibold text-white mt-1">{selectedUser || 'Select User'}</div>
              </div>
            </div>
            <div className="relative">
              <select
                value={selectedUser || ''}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="h-[44px] px-4 pr-10 bg-level-1 border border-subtle rounded-md text-[16px] text-gray-100 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all appearance-none cursor-pointer"
              >
                {loading ? (
                  <option>Loading...</option>
                ) : users.length === 0 ? (
                  <option>No users found</option>
                ) : (
                  users.map(userId => (
                    <option key={userId} value={userId}>{userId}</option>
                  ))
                )}
              </select>
              <LucideChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* KPI CARDS ROW */}
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <KPICard 
            accentColor="amber" 
            label="TODAY'S CONSUMPTION" 
            icon={<LucideZap className="w-[14px] h-[14px] text-amber-500" />}
            value={<>847.3 <span className="text-[14px] text-gray-400 font-inter">kWh</span></>}
            change="↑ +12.4% vs yesterday"
            changeColor="red"
          />
          <KPICard 
            accentColor="red" 
            label="ACTIVE ANOMALIES" 
            icon={<LucideAlertTriangle className="w-[14px] h-[14px] text-red-500" />}
            value={<div className="text-[40px] text-red-400 leading-tight flex items-center gap-2">7 <div className="w-2 h-2 bg-red-500 rounded-full animate-ping-custom mt-2"></div></div>}
            subRow={
              <div className="flex gap-2 mt-[6px]">
                <Badge color="red">3 Critical</Badge>
                <Badge color="amber">4 Warnings</Badge>
              </div>
            }
          />
          <KPICard 
            accentColor="blue" 
            label="AVG PER FLAT TODAY" 
            icon={<LucideBarChart2 className="w-[14px] h-[14px] text-blue-500" />}
            value="16.9 kWh"
            subRow={
              <div className="mt-[10px]">
                <div className="h-[4px] rounded-full bg-[rgba(55,65,81,0.5)] w-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '65%' }}></div>
                </div>
                <div className="text-[12px] text-gray-500 mt-2">Normal range: 12–20 kWh</div>
              </div>
            }
          />
          <KPICard 
            accentColor="green" 
            label="NEXT HOUR FORECAST" 
            icon={<LucideTrendingUp className="w-[14px] h-[14px] text-green-500" />}
            value="23.4 kWh"
            subRow={
              <div>
                <div className="text-[12px] text-gray-400 mt-1">🔮 94% ML confidence</div>
                <div className="text-[12px] text-gray-600 mt-1">Refreshes in 8 min</div>
              </div>
            }
          />
        </div>

        {/* MAIN CHART SECTION */}
        <div className="mt-6 w-full bg-level-2 border border-subtle rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[18px] font-semibold font-inter text-white">Real-Time Consumption Monitor</h2>
              <p className="text-[14px] text-gray-400 mt-[2px]">Last 50 readings — {selectedUser || 'all apartments'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <TimePill label="1H" active />
                <TimePill label="6H" />
                <TimePill label="24H" />
                <TimePill label="7D" />
              </div>
              <div className="flex items-center justify-center gap-[6px] bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] rounded-full px-[10px] py-[3px]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-custom ring-4 ring-green-500/20"></span>
                <span className="text-[12px] font-bold text-green-400">LIVE</span>
              </div>
            </div>
          </div>

          <div className="mt-5 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.20)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="rgba(59,130,246,0.00)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(55,65,81,0.3)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontFamily: 'JetBrains Mono' }} dy={10} />
                <YAxis domain={[0, 16]} ticks={[0, 4, 8, 12, 16]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontFamily: 'JetBrains Mono' }} dx={-10} />
                <Area type="monotone" dataKey="kwh" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorKwh)" activeDot={{ r: 6 }} />
                <Scatter data={chartData.filter(d => d.anomaly)} fill="#EF4444" shape={(props) => {
                  const { cx, cy } = props;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={9} fill="none" stroke="#EF4444" strokeWidth={2} opacity={0.35} className="animate-ping-custom" />
                      <circle cx={cx} cy={cy} r={5} fill="#EF4444" />
                    </g>
                  );
                }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6 w-full">
          {/* ANOMALY FEED */}
          <div className="w-full lg:w-[380px] bg-level-2 border border-subtle rounded-lg h-[380px] flex flex-col overflow-hidden">
            <div className="p-5 pb-0 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <LucideAlertTriangle className="w-4 h-4 text-red-500" />
                <h3 className="text-[16px] font-semibold text-white">Anomaly Feed</h3>
                <div className="bg-red-900/50 text-red-400 text-[12px] h-[20px] min-w-[20px] rounded-full flex items-center justify-center px-2 font-bold ml-1">7</div>
              </div>
              <button className="text-[12px] text-blue-400 hover:text-blue-300">View All →</button>
            </div>
            <div className="my-3 mx-0 h-[1px] bg-gray-800"></div>
            
            <div className="px-4 pb-4 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
              {anomalyFeed.map((item, i) => (
                <div key={i} className={`bg-level-3 border border-subtle rounded-md p-3 cursor-pointer hover:bg-level-4 transition-colors ${item.level === 'Critical' ? 'border-l-[3px] border-l-red-500 hover:border-l-red-400' : 'border-l-[3px] border-l-amber-500 hover:border-l-amber-400'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[14px] font-bold text-white tracking-widest">{item.id}</span>
                    <span className="font-mono text-[14px] font-semibold text-red-400">{item.kwh} kWh</span>
                  </div>
                  <div className="text-[12px] text-gray-500 mt-1">{item.time}</div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge color={item.level === 'Critical' ? 'red' : 'amber'}>{item.level}</Badge>
                    <span className="text-[12px] text-gray-500 hover:text-blue-400">View →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* USER LIST */}
          <div className="flex-1 bg-level-2 border border-subtle rounded-lg h-[380px] p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <LucideUsers className="w-4 h-4 text-blue-500" />
                  <span className="text-[16px] font-semibold text-white">All Users</span>
                </div>
                <div className="text-[12px] text-gray-400 mt-[2px]">{users.length} apartments registered</div>
              </div>
            </div>

            <div className="mt-5 overflow-y-auto h-[280px] custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                {loading ? (
                  <div className="col-span-2 text-center text-gray-500 text-[14px] py-8">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="col-span-2 text-center text-gray-500 text-[14px] py-8">No users found</div>
                ) : (
                  users.map(userId => (
                    <button
                      key={userId}
                      onClick={() => setSelectedUser(userId)}
                      className={`p-4 rounded-md border transition-all ${
                        selectedUser === userId 
                          ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' 
                          : 'bg-level-3 border-subtle text-gray-300 hover:bg-level-4 hover:border-strong'
                      }`}
                    >
                      <div className="text-[14px] font-semibold">{userId}</div>
                      <div className="text-[12px] text-gray-500 mt-1">Active</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Subcomponents
const KPICard = ({ accentColor, label, icon, value, change, changeColor, subRow }) => {
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

      {change && (
        <div className="flex items-center gap-1 mt-[6px]">
          <span className={`text-[12px] font-semibold ${changeColor === 'red' ? 'text-red-500' : 'text-green-500'}`}>{change}</span>
        </div>
      )}

      {subRow}
    </div>
  );
};

const TimePill = ({ label, active }) => {
  return (
    <button className={`h-[30px] px-3 rounded-md text-[12px] font-semibold font-inter transition-colors ${
      active 
      ? 'bg-[rgba(37,99,235,0.2)] text-blue-400 border border-[rgba(59,130,246,0.3)]' 
      : 'bg-level-1 text-gray-400 border border-transparent hover:text-gray-200'
    }`}>
      {label}
    </button>
  );
};

const Badge = ({ color, children }) => {
  if (color === 'red') {
    return <span className="bg-[#450A0A] text-red-400 border border-[#991B1B] h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em] flex items-center justify-center">
      {children}
    </span>;
  }
  if (color === 'amber') {
    return <span className="bg-[#431407] text-amber-400 border border-[#92400E] h-[22px] px-[10px] py-[3px] rounded-full text-[12px] font-bold uppercase tracking-[0.06em] flex items-center justify-center">
      {children}
    </span>;
  }
  return null;
};

export default AdminDashboard;
