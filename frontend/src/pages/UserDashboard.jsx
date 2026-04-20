import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RealTimeChart from '../components/RealTimeChart';
import AnomalyFeed from '../components/AnomalyFeed';

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // We are passing user?.id or user?.email to the components
  // In a real app we map this securely. Let's assume we map user.id to user-001 or whichever is needed for charts temporarily.
  // Or handle new users seamlessly. For now, since user.id controls user specific data in our charts, we pass it.
  const chartUserId = user?.id || 'user-001';

  return (
    <div className="flex h-screen bg-neutral-900 text-white font-sans">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">My Energy Dashboard: <span className="text-emerald-400">{user?.name}</span></h1>
          <div className="flex flex-row items-center gap-4">
            <span className="text-sm px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">Status: Active</span>
            <button 
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 bg-neutral-700 hover:bg-rose-500/20 hover:text-rose-400 transition-colors rounded"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 h-96">
            <RealTimeChart userId={chartUserId} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 h-64 flex items-center justify-center">
               <p className="text-neutral-400">ML Insights Widget</p>
             </div>
             <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 h-64 overflow-hidden">
               <AnomalyFeed userId={chartUserId} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;