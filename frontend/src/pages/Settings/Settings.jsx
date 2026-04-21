import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LucideSettings, LucideBell, LucideUser, LucideShield, LucideDatabase, LucideMail, LucideMonitor, LucideActivity } from 'lucide-react';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="p-8 bg-[#0A0F1E] min-h-[calc(100vh-64px)] w-full max-w-[1440px] mx-auto flex gap-8">
        
        {/* Left Sidebar (Settings Navigation) */}
        <div className="w-[280px] shrink-0">
          <h1 className="text-[24px] font-bold text-white font-inter mb-6">Configuration</h1>
          
          <nav className="flex flex-col gap-[2px]">
            <NavGroup title="PREFERENCES">
              <NavItem icon={LucideActivity} label="System thresholds" active />
              <NavItem icon={LucideBell} label="Alerts & Notifications" />
              <NavItem icon={LucideMonitor} label="Display" />
            </NavGroup>
            
            <div className="h-[1px] bg-subtle my-4 mx-2"></div>
            
            <NavGroup title="ACCOUNT & ACCESS">
              <NavItem icon={LucideUser} label="Profile & Security" />
              <NavItem icon={LucideShield} label="Roles & Permissions" />
              <NavItem icon={LucideDatabase} label="Data Management" />
              <NavItem icon={LucideMail} label="API & Integrations" />
            </NavGroup>
          </nav>
        </div>

        {/* Main Content Area (System Thresholds active) */}
        <div className="flex-1 bg-level-2 border border-subtle rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-subtle bg-level-2/50">
            <h2 className="text-[20px] font-bold text-white mb-1">System Thresholds</h2>
            <p className="text-[14px] text-gray-400">Configure baselines and sensitivity parameters for the ML Anomaly Detection engine.</p>
          </div>

          <div className="p-6 flex flex-col gap-6">
            
            <Section title="Detection Sensitivity" desc="Adjust how aggressively the ML model flags spikes in individual apartment consumption.">
              <div className="bg-level-1 border border-subtle rounded-lg p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-white">Threshold Multiplier (Z-Score)</span>
                    <span className="text-[12px] text-gray-500 mt-1">Deviations beyond this multiplier are flagged as anomalies.</span>
                  </div>
                  <div className="text-blue-400 font-mono text-[16px] font-bold">2.5σ</div>
                </div>
                
                <input type="range" min="1" max="5" step="0.1" defaultValue="2.5" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                <div className="flex justify-between text-[11px] text-gray-500 font-mono mt-2 font-medium">
                  <span>1.0σ (High false positives)</span>
                  <span>3.0σ (Default)</span>
                  <span>5.0σ (Low sensitivity)</span>
                </div>
              </div>
            </Section>

            <Section title="Transformer Limits (Phase & Neutral)" desc="Hard limits for alert generation if the model fails or during manual overrides.">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-level-1 border border-subtle rounded-lg p-4">
                  <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Phase A Overload Limit</label>
                  <div className="relative">
                    <input type="number" defaultValue="450" className="w-full bg-level-2 border border-subtle rounded-md px-3 py-2 text-white font-mono focus:border-red-500 focus:outline-none transition-colors" />
                    <span className="absolute right-3 top-2 text-gray-500 font-mono text-[14px]">Amps</span>
                  </div>
                </div>
                
                <div className="bg-level-1 border border-subtle rounded-lg p-4">
                  <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Unbalanced Neutral Limit</label>
                  <div className="relative">
                    <input type="number" defaultValue="50" className="w-full bg-level-2 border border-subtle rounded-md px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none transition-colors" />
                    <span className="absolute right-3 top-2 text-gray-500 font-mono text-[14px]">Amps</span>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Night-Time Baseline Rules" desc="Special heuristic overrides applied between 01:00 AM and 05:00 AM.">
              <div className="bg-level-1 border border-subtle rounded-lg flex items-center justify-between p-4">
                 <div>
                    <h4 className="text-[14px] font-semibold text-white">Enable strict off-peak monitoring</h4>
                    <p className="text-[12px] text-gray-400 mt-1">If enabled, the model will lower variance thresholds during deep night hours.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
              </div>
            </Section>

            {/* SAVE BUTTON */}
            <div className="mt-4 flex justify-end gap-3 pt-6 border-t border-subtle">
              <button className="px-5 py-2 rounded-md font-semibold text-[14px] text-gray-400 hover:text-white transition-colors bg-transparent border border-transparent hover:bg-level-3 hover:border-subtle">Reset to Defaults</button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-[14px] shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all">Save Changes</button>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const NavGroup = ({ title, children }) => (
  <div className="mb-2">
    <h3 className="text-[11px] font-bold text-gray-500 mb-2 pl-3 tracking-widest">{title}</h3>
    {children}
  </div>
);

const NavItem = ({ icon: Icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-lg text-[14px] font-medium transition-colors ${
    active 
      ? 'bg-[rgba(59,130,246,0.1)] text-blue-400 border border-blue-500/20' 
      : 'text-gray-400 hover:bg-level-2 hover:text-white border border-transparent'
  }`}>
    <Icon className={`w-[18px] h-[18px] ${active ? 'text-blue-400' : 'text-gray-500'}`} />
    {label}
  </button>
);

const Section = ({ title, desc, children }) => (
  <div>
    <h3 className="text-[15px] font-bold text-gray-200 mb-1">{title}</h3>
    <p className="text-[13px] text-gray-500 mb-4">{desc}</p>
    {children}
  </div>
);
