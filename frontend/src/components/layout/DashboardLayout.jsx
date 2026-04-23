import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LucideLayoutDashboard, LucideActivity, LucideAlertTriangle, LucideTrendingUp, LucideBuilding2, LucideFileText, LucideSettings, LucideHelpCircle, LucideLogOut, LucideChevronDown, LucideBell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

const Topbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/admin') return 'Admin Dashboard';
    if (path.startsWith('/user/')) return 'User Dashboard';
    if (path === '/apartments') return 'Apartments';
    if (path === '/anomalies') return 'Anomaly Log';
    if (path === '/reports') return 'Reports';
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="fixed left-[240px] right-0 top-0 h-[64px] bg-[rgba(10,15,30,0.9)] backdrop-blur-[12px] border-b border-subtle px-8 flex justify-between items-center z-50">
      <div className="flex items-center text-sm">
        <span className="text-[16px] font-semibold text-white">{getPageTitle()}</span>
        <span className="text-gray-600 mx-2">/</span>
        <span className="text-[14px] text-gray-400 capitalize">{user?.role || 'User'} View</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center gap-[6px] bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] rounded-full px-[12px] py-[4px]">
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-500 opacity-30 animate-pulse-custom"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </div>
          <span className="text-[12px] font-medium text-green-400">Live · Updated 2s ago</span>
        </div>

        <div className="h-[24px] w-[1px] bg-gray-700"></div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-[24px] w-[1px] bg-gray-700"></div>

        <button className="relative w-[36px] h-[36px] flex items-center justify-center rounded-md hover:bg-level-3 group transition-colors">
          <LucideBell className="w-[18px] h-[18px] text-gray-400 group-hover:text-white" />
          <span className="absolute top-[4px] right-[4px] w-[8px] h-[8px] bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[9px] text-white font-bold hidden">3</span>
          </span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[12px] text-white font-semibold">
            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <LucideChevronDown className="w-[12px] h-[12px] text-gray-500" />
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[240px] bg-level-1 border-r border-subtle flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="h-[64px] px-5 flex items-center gap-[10px] border-b border-subtle shrink-0">
        <span className="text-amber-400 font-bold text-[18px] drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">⚡</span>
        <span className="text-[16px] font-bold text-[var(--color-text-primary)] tracking-tight">ElectroGyaan AI</span>
      </div>

      {/* User Info Card */}
      <div className="m-[16px_12px] bg-level-2 border border-subtle rounded-md p-3 flex items-center gap-[10px]">
        <div className="w-[36px] h-[36px] rounded-md bg-gradient-to-br from-blue-700 to-purple-600 flex justify-center items-center text-[14px] font-bold text-white shrink-0">
          {user?.name?.substring(0, 2).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate">{user?.name || 'User'}</div>
          <div className="flex items-center gap-[6px] mt-[2px]">
            <span className="bg-amber-500/10 border border-amber-500/30 text-[12px] font-semibold text-amber-500 px-[8px] py-[2px] rounded-full capitalize">
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="px-2 flex-1">
        <div className="text-[12px] text-[var(--color-text-faint)] font-semibold uppercase tracking-[0.1em] p-[16px_12px_6px]">MAIN</div>
        <nav className="flex flex-col gap-[2px]">
          <NavItem to="/dashboard" icon={<LucideLayoutDashboard className="w-4 h-4" />} label="Dashboard" />
          
          {/* Admin-only navigation */}
          {user?.role === 'admin' && (
            <>
              <NavItem to="/apartments" icon={<LucideBuilding2 className="w-4 h-4" />} label="Apartments" />
              <NavItem to="/anomalies" icon={<LucideAlertTriangle className="w-4 h-4" />} label="Anomaly Log" />
              <NavItem to="/reports" icon={<LucideFileText className="w-4 h-4" />} label="Reports" />
            </>
          )}
          
          {/* User-only navigation */}
          {user?.role === 'user' && (
            <>
              <NavItem to="/anomalies" icon={<LucideAlertTriangle className="w-4 h-4" />} label="My Anomalies" />
            </>
          )}
          
          <div className="h-[1px] bg-[var(--color-border-subtle)] my-[8px] mx-[12px]"></div>
          <NavItem to="/settings" icon={<LucideSettings className="w-4 h-4" />} label="Settings" />
        </nav>
      </div>

      {/* Footer */}
      <div className="p-[16px_12px] border-t border-subtle bg-level-1 mt-auto">
        <div className="flex items-center gap-[10px]">
          <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[12px] text-white shrink-0">
            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-[var(--color-text-primary)] truncate">{user?.name || 'User'}</div>
            <div className="text-[12px] text-[var(--color-text-faint)] truncate max-w-[140px]">{user?.email || 'user@example.com'}</div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-[16px] h-[16px] text-[var(--color-text-faint)] hover:text-red-500 cursor-pointer shrink-0 transition-colors"
            title="Logout"
          >
            <LucideLogOut className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, badge }) => {
  const location = useLocation();
  const active = to ? location.pathname.startsWith(to) : false;

  const Wrapper = to ? Link : 'div';
  const props = to ? { to } : {};

  return (
    <Wrapper {...props} className={`h-[36px] px-[12px] rounded-md flex items-center justify-between cursor-pointer transition-all duration-150 group ${active ? 'bg-blue-500/10 border-l-[2px] border-blue-500 -ml-[2px]' : 'hover:bg-level-2'}`}>
      <div className="flex items-center gap-[10px]">
        <div className={`${active ? 'text-blue-500' : 'text-[var(--color-text-faint)] group-hover:text-[var(--color-text-secondary)]'}`}>
          {icon}
        </div>
        <span className={`text-[14px] ${active ? 'text-blue-500 font-semibold' : 'text-[var(--color-text-muted)] font-medium group-hover:text-[var(--color-text-primary)]'}`}>
          {label}
        </span>
      </div>
      {badge && (
        <span className="bg-red-500/15 text-red-500 text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 font-bold border border-red-500/30">
          {badge}
        </span>
      )}
    </Wrapper>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-level-0 font-inter text-[var(--color-text-primary)]">
      <Sidebar />
      <Topbar />
      <main className="ml-[240px] mt-[64px] min-h-[calc(100vh-64px)] overflow-x-hidden bg-level-0">
        {children}
      </main>
    </div>
  );
}
