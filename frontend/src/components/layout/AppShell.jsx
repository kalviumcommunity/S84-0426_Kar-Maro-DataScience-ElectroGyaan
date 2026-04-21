import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LucideZap, 
  LucideLayoutDashboard, 
  LucideActivity, 
  LucideAlertTriangle, 
  LucideTrendingUp, 
  LucideBuilding2, 
  LucideFileText, 
  LucideSettings, 
  LucideHelpCircle,
  LucideChevronDown,
  LucideBell,
  LucideLogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',    icon: LucideLayoutDashboard, path: '/dashboard' },
  { id: 'monitor',     label: 'Live Monitor', icon: LucideActivity,        path: '/monitor' },
  { id: 'alerts',      label: 'Anomaly Log',  icon: LucideAlertTriangle,   path: '/alerts', badge: 7 },
  { id: 'predictions', label: 'Predictions',  icon: LucideTrendingUp,      path: '/predictions' },
  { id: 'apartments',  label: 'Apartments',   icon: LucideBuilding2,       path: '/apartments' },
  { id: 'reports',     label: 'Reports',      icon: LucideFileText,        path: '/reports' }
];

const SETTINGS_ITEMS = [
  { id: 'settings',    label: 'Settings',     icon: LucideSettings,        path: '/settings' },
  { id: 'help',        label: 'Help & Docs',  icon: LucideHelpCircle,      path: '/help' }
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-[240px_1fr] grid-rows-[64px_1fr] h-[100vh] w-full bg-level-0 font-sans text-white overflow-hidden">
      
      {/* ── LEFT SIDEBAR ── */}
      <div className="row-span-2 bg-level-1 border-r border-subtle flex flex-col relative z-20 h-full overflow-y-auto">
        
        {/* Sidebar Header */}
        <div className="h-[64px] px-[20px] flex items-center gap-[10px] border-b border-subtle shrink-0">
          <LucideZap className="w-[18px] h-[18px] text-amber-400" style={{ filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.4))' }} />
          <span className="text-[16px] font-bold">ElectroGyaan AI</span>
        </div>

        {/* User Info Card */}
        <div className="m-[16px_12px] bg-level-2 border border-subtle rounded-md p-[12px] flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="w-[36px] h-[36px] rounded-md bg-gradient-to-br from-blue-700 to-purple-600 flex items-center justify-center text-[14px] font-bold shadow-inner">
              {user?.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-white truncate max-w-[100px]">{user?.name || 'User'}</span>
              <div className="flex items-center gap-[6px] mt-1">
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[12px] font-semibold px-[8px] py-[2px] rounded-full capitalize">
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex-1 px-[8px] flex flex-col gap-[2px]">
          <div className="text-[12px] text-gray-600 font-semibold uppercase tracking-widest px-[12px] pt-[16px] pb-[6px]">Main</div>
          
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button 
                key={item.id}
                onClick={() => handleNav(item.path)}
                className={`h-[36px] px-[12px] rounded-md flex items-center gap-[10px] cursor-pointer transition-all duration-150 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 font-semibold border-l-2 border-blue-500 -ml-[2px] pl-[14px]' 
                    : 'bg-transparent text-gray-400 font-medium hover:bg-level-2 hover:text-gray-200'
                }`}
              >
                <item.icon className="w-[16px] h-[16px]" style={{ color: isActive ? '#60A5FA' : '' }} />
                <span className="flex-1 text-left text-[14px]">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-900 text-red-400 text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="h-[1px] bg-subtle m-[8px_12px]"></div>

          {SETTINGS_ITEMS.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button 
                key={item.id}
                onClick={() => handleNav(item.path)}
                className={`h-[36px] px-[12px] rounded-md flex items-center gap-[10px] cursor-pointer transition-all duration-150 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 font-semibold border-l-2 border-blue-500 -ml-[2px] pl-[14px]' 
                    : 'bg-transparent text-gray-400 font-medium hover:bg-level-2 hover:text-gray-200'
                }`}
              >
                <item.icon className="w-[16px] h-[16px]" style={{ color: isActive ? '#60A5FA' : '' }} />
                <span className="flex-1 text-left text-[14px]">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer (User) */}
        <div className="mt-auto border-t border-subtle bg-level-1 p-[16px_12px] flex items-center gap-[10px] shrink-0">
          <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[12px] font-bold text-white shadow-inner">
            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[12px] font-semibold text-white">{user?.name || 'User'}</span>
            <span className="text-[12px] text-gray-500 truncate max-w-[120px]">{user?.email || 'user@example.com'}</span>
          </div>
          <button onClick={logout} className="text-gray-500 hover:text-red-400 transition-colors" title="Log Out">
            <LucideLogOut className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>

      {/* ── TOP BAR ── */}
      <div className="bg-[#0A0F1E]/90 backdrop-blur-[12px] border-b border-subtle px-[32px] flex justify-between items-center z-10 sticky top-0 h-[64px]">
        
        {/* Left: Breadcrumbs */}
        <div className="flex items-center">
          <span className="text-[16px] font-semibold text-white">Dashboard</span>
          <span className="text-gray-600 mx-[8px]">/</span>
          <span className="text-[14px] text-gray-400 capitalize">{user?.role || 'User'} View</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-[16px]">
          {/* Live Badge */}
          <div className="flex items-center gap-[6px] bg-green-500/10 border border-green-500/20 rounded-full px-[12px] py-[4px]">
            <div className="relative flex items-center justify-center w-[8px] h-[8px]">
              <div className="absolute w-[12px] h-[12px] bg-green-500/30 rounded-full animate-ping-slow"></div>
              <div className="w-[8px] h-[8px] bg-green-500 rounded-full"></div>
            </div>
            <span className="text-[12px] font-medium text-green-400">Live · Updated 2s ago</span>
          </div>

          <div className="w-[1px] h-[24px] bg-gray-700"></div>

          {/* Notifications */}
          <button className="relative w-[36px] h-[36px] flex items-center justify-center rounded-md hover:bg-level-3 transition-colors group">
            <LucideBell className="w-[18px] h-[18px] text-gray-400 group-hover:text-white transition-colors" />
            <div className="absolute top-[4px] right-[4px] w-[14px] h-[14px] bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-level-1">
              3
            </div>
          </button>

          {/* Topbar User Avatar Dropdown */}
          <div className="flex items-center gap-[4px] cursor-pointer border border-transparent hover:border-subtle p-1 rounded-md transition-colors">
            <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[12px] font-bold text-white shadow-inner">
              {user?.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <LucideChevronDown className="w-[12px] h-[12px] text-gray-500" />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT OUTLET ── */}
      <div className="bg-level-0 min-h-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}