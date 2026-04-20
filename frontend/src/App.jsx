import { useState } from 'react';
import './App.css';

function App() {
  const [selectedUser, setSelectedUser] = useState('user-001');

  // Mock list of 50 users (Will be fetched via API in PR 8)
  const users = Array.from({ length: 50 }, (_, i) => `user-${String(i + 1).padStart(3, '0')}`);

  return (
    <div className="flex h-screen bg-neutral-900 text-white font-sans">
      {/* Sidebar for Users */}
      <aside className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col">
        <div className="p-4 border-b border-neutral-700">
          <h2 className="text-xl font-bold text-emerald-400">ElectroGyaan</h2>
          <p className="text-xs text-neutral-400 mt-1">Select a household</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {users.map(userId => (
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
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center px-6">
          <h1 className="text-xl font-semibold">Energy Dashboard: <span className="text-emerald-400">{selectedUser}</span></h1>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 h-96 flex items-center justify-center">
             <p className="text-neutral-400">Chart Component (PR 9) will go here</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 h-64 flex items-center justify-center">
               <p className="text-neutral-400">ML Insights Widget (PR 10) will go here</p>
             </div>
             <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 h-64 flex items-center justify-center">
               <p className="text-neutral-400">Anomaly Alert Feed (PR 10) will go here</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
