import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { energyApi } from '../api/apiClient';
import RealTimeChart from '../components/RealTimeChart';
import AnomalyFeed from '../components/AnomalyFeed';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  const [loading, setLoading] = useState(true);

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
    <div className="flex h-screen bg-neutral-900 text-white font-sans">
      {/* Sidebar for Users */}
      <aside className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col">
        <div className="p-4 border-b border-neutral-700">
          <h2 className="text-xl font-bold text-emerald-400">ElectroGyaan</h2>
          <p className="text-xs text-neutral-400 mt-1">Select a household</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
             <div className="text-neutral-500 text-sm p-4 text-center">Loading users...</div>
          ) : users.length === 0 ? (
             <div className="text-neutral-500 text-sm p-4 text-center">No users found in database</div>
          ) : (
            users.map(userId => (
              <button
                key={userId}
                onClick={() => setSelectedUser(userId)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  selectedUser === userId 
                    ? 'bg-emerald-500/20 text-emerald-400 font-medium' 
                    : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {userId}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Energy Dashboard: <span className="text-emerald-400">{selectedUser || 'Select User'}</span></h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-300">Admin: {user?.name}</span>
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
             {selectedUser ? <RealTimeChart userId={selectedUser} /> : <p className="text-neutral-400">Select a user to view data</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 h-64 flex items-center justify-center">
               <p className="text-neutral-400">ML Insights Widget (PR 10) will go here</p>
             </div>
             <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 h-64 overflow-hidden">
               {selectedUser ? <AnomalyFeed userId={selectedUser} /> : <p className="text-neutral-400">Waiting for user selection...</p>}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
