import React from 'react';
import { Link } from 'react-router-dom';
import { LucideZap, LucideArrowRight, LucidePlay, LucideActivity, LucideTrendingUp, LucideBell, LucidePlug, LucideBrainCircuit } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] font-inter text-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-[64px] bg-[rgba(10,15,30,0.85)] backdrop-blur-[20px] border-b border-[rgba(55,65,81,0.4)] px-[80px] flex justify-between items-center z-[100]">
        <div className="w-[200px] flex items-center gap-2">
          <LucideZap className="w-5 h-5 text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]" />
          <span className="text-[18px] font-bold text-white tracking-tight">ElectroGyaan</span>
          <span className="text-[12px] text-blue-400 align-super ml-[1px]">AI</span>
        </div>
        <div className="flex gap-[32px]">
          <a href="#features" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors duration-150">Features</a>
          <a href="#how-it-works" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors duration-150">How It Works</a>
          <a href="#docs" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors duration-150">Docs</a>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link to="/login" className="h-[36px] flex items-center px-[16px] text-[14px] text-gray-300 font-medium hover:text-white border border-transparent hover:border-strong hover:bg-level-3 rounded-md transition-all">
            Log In
          </Link>
          <Link to="/dashboard" className="h-[36px] px-[16px] text-[14px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center transition-all active:scale-95">
            Get Started <LucideArrowRight className="w-[14px] h-[14px] ml-[6px]" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[720px] h-screen pt-[120px] pb-0 px-[80px]">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[30%] left-[30%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-[30%] left-[75%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIC41SDRwLjUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSLCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]"></div>
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10 grid grid-cols-12 gap-[24px]">
          {/* Left Column */}
          <div className="col-span-6 pr-[48px]">
            <div className="inline-flex items-center bg-blue-600/10 border border-blue-500/30 rounded-full px-[14px] py-[5px] gap-[6px]">
              <span className="w-[6px] h-[6px] bg-green-500 rounded-full animate-pulse-custom"></span>
              <span className="text-[12px] font-semibold text-blue-400">⚡ Now in Beta — 120+ Societies Live</span>
            </div>

            <h1 className="mt-[20px] text-[56px] leading-[64px] font-extrabold tracking-[-0.03em] h-[192px]">
              <div className="text-white">Smart Energy</div>
              <div className="bg-gradient-to-r from-blue-500 to-amber-400 bg-clip-text text-transparent">Intelligence for</div>
              <div className="text-white">Modern Societies</div>
            </h1>

            <p className="mt-[24px] text-[18px] leading-[28px] text-gray-400 font-normal max-w-[460px]">
              Real-time anomaly detection, AI-powered forecasting, and live dashboards — purpose built for 50–500 apartment communities across India.
            </p>

            <div className="mt-[40px] flex gap-[14px]">
              <Link to="/dashboard" className="h-[48px] px-[28px] text-[16px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center transition-all active:scale-95">
                Get Started <LucideArrowRight className="w-[16px] h-[16px] ml-[8px]" />
              </Link>
              <button className="h-[48px] px-[24px] rounded-md border border-default text-gray-300 hover:border-strong hover:bg-level-3 hover:text-white flex items-center transition-all">
                <div className="w-[24px] h-[24px] bg-white/10 rounded-full flex items-center justify-center mr-[8px]">
                  <LucidePlay className="w-[10px] h-[10px] text-white ml-[2px]" fill="currentColor" />
                </div>
                Watch Demo
                <span className="ml-[8px] text-gray-500 font-mono text-[14px]">2:34</span>
              </button>
            </div>
          </div>

          {/* Right Column / Mockup */}
          <div className="col-span-6 pl-[24px] relative flex justify-end">
            <div className="w-[580px] h-[380px] bg-level-2 border border-blue-500/40 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] transform perspective-[1200px] rotate-y-[-8deg] rotate-x-[3deg] rotate-z-[0.5deg]">
               <div className="h-[40px] bg-level-1 border-b border-subtle flex items-center px-4 rounded-t-2xl relative">
                  <div className="flex gap-[6px]">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="absolute inset-0 flex justify-center items-center">
                    <span className="text-[12px] text-gray-400">ElectroGyaan AI — Live Dashboard</span>
                  </div>
               </div>
               <div className="p-4">
                 {/* Mockup Dashboard Content */}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="h-[80px] bg-level-1 border-t border-b border-subtle flex">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-[24px] font-mono font-bold text-amber-400">36,000+</div>
            <div className="text-[12px] text-gray-500 uppercase tracking-widest mt-1">Readings Processed Monthly</div>
          </div>
        </div>
        <div className="w-[1px] h-[36px] bg-gray-800 my-auto"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-[24px] font-mono font-bold text-green-400">98.5%</div>
            <div className="text-[12px] text-gray-500 uppercase tracking-widest mt-1">Platform Uptime SLA</div>
          </div>
        </div>
        <div className="w-[1px] h-[36px] bg-gray-800 my-auto"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-[24px] font-mono font-bold text-blue-400">&lt;200ms</div>
            <div className="text-[12px] text-gray-500 uppercase tracking-widest mt-1">Average Ingest Latency</div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section id="features" className="py-[120px] px-[80px] max-w-[1280px] mx-auto">
        <div className="text-center mb-[80px]">
          <h2 className="text-[36px] font-bold text-white mb-4">Unprecedented Grid Visibility</h2>
          <p className="text-[18px] text-gray-400 max-w-[600px] mx-auto">Stop guessing where power is being wasted. Get precise, apartment-level diagnostics and predictive anomaly detection.</p>
        </div>

        <div className="grid grid-cols-3 gap-[32px]">
          <FeatureCard 
            icon={LucideActivity} color="text-amber-400" bg="bg-amber-400/10" border="border-amber-400/20"
            title="Real-Time Telemetry" 
            desc="Live feeds from every transformer and apartment with sub-second latency filtering."
          />
          <FeatureCard 
            icon={LucideBrainCircuit} color="text-blue-400" bg="bg-blue-400/10" border="border-blue-400/20"
            title="Predictive Neural Network" 
            desc="Our ML engine analyzes Z-scores to accurately flag upcoming phase imbalances."
          />
          <FeatureCard 
            icon={LucideBell} color="text-red-400" bg="bg-red-400/10" border="border-red-400/20"
            title="Automated Alerting" 
            desc="Instant SMS and webhook triggers directly to maintenance teams to prevent critical overloads."
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-[120px] px-[80px] bg-level-1 border-t border-b border-subtle">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 gap-[80px] items-center">
           <div>
             <h2 className="text-[36px] font-bold text-white mb-6">Built for Scale, Designed for Humans.</h2>
             <p className="text-[18px] text-gray-400 mb-10 leading-relaxed">
               The entire infrastructure from ingestion to the dashboard is tightly coupled. ElectroGyaan intercepts raw IoT MQTT packets, validates anomaly parameters via statistical heuristics in your localized node, and renders complex analytics within an absolute native SaaS shell.
             </p>
             <ul className="flex flex-col gap-6">
                <li className="flex gap-4">
                  <div className="w-[32px] h-[32px] rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-[14px] shrink-0 mt-1">1</div>
                  <div>
                    <h4 className="text-[16px] font-bold text-white">Smart Meter Integration</h4>
                    <p className="text-[14px] text-gray-400 mt-1">Securely bind building hardware arrays directly to your Cloud endpoint.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-[32px] h-[32px] rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-[14px] shrink-0 mt-1">2</div>
                  <div>
                    <h4 className="text-[16px] font-bold text-white">Continuous Computation</h4>
                    <p className="text-[14px] text-gray-400 mt-1">The system establishes 24-hour moving baselines for regular load capacity.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-[32px] h-[32px] rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-[14px] shrink-0 mt-1">3</div>
                  <div>
                    <h4 className="text-[16px] font-bold text-white">Decisive Action</h4>
                    <p className="text-[14px] text-gray-400 mt-1">Export analytical reports automatically and restrict rogue loads dynamically.</p>
                  </div>
                </li>
             </ul>
           </div>
           <div className="bg-level-2 h-[500px] border border-subtle rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="text-[14px] font-mono text-gray-500 mb-4">[ Live Execution Payload Trace ]</div>
              <div className="flex-1 bg-level-0 rounded-lg border border-subtle p-4 font-mono text-[12px] text-green-400/80 leading-relaxed overflow-hidden">
                <span className="text-blue-400">{'>>'} POST /api/ingest</span><br/>
                {'{\n'}
                {'  "building": "GM-A",\n'}
                {'  "units": 50,\n'}
                {'  "aggregated": 412.5,\n'}
                {'  "timestamp": "14:24:00Z"\n'}
                {'}'}<br/><br/>
                <span className="text-gray-500">{"// Running inference model..."}</span><br/><br/>
                <span className="text-amber-400">{'>>'} WARN: Phase A deviation detected (z=2.8)</span><br/>
                <span className="text-gray-500">{"// Dispatched push notification"}</span><br/>
                <span className="text-blue-400">{'>>'} 200 OK</span><br/>
              </div>
           </div>
        </div>
      </section>
      
      {/* FINAL CTA & FOOTER */}
      <section className="py-[100px] text-center max-w-[800px] mx-auto px-[20px]">
        <h2 className="text-[32px] font-bold text-white mb-6">Ready to optimize your infrastructure?</h2>
        <Link to="/dashboard" className="inline-flex h-[56px] px-[32px] text-[16px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-[0_0_24px_rgba(59,130,246,0.3)] items-center justify-center transition-all active:scale-95">
          Get Started Now
        </Link>
        <div className="mt-[80px] pt-[40px] border-t border-subtle text-[14px] text-gray-500 flex justify-between">
           <div className="flex items-center gap-2">
             <LucideZap className="w-4 h-4 text-amber-400" />
             <span className="font-semibold text-gray-400">ElectroGyaan AI</span>
           </div>
           <div className="flex gap-6">
             <a id="docs" href="#" className="hover:text-white transition-colors">Documentation</a>
             <a href="#" className="hover:text-white transition-colors">API Reference</a>
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
           </div>
        </div>
      </section>

    </div>
  );
}

const FeatureCard = ({ icon: Icon, color, bg, border, title, desc }) => (
  <div className="p-6 bg-level-2 border border-subtle rounded-xl hover:border-strong transition-colors group">
    <div className={`w-[48px] h-[48px] ${bg} ${border} border rounded-lg flex items-center justify-center mb-6`}>
      <Icon className={`w-[24px] h-[24px] ${color}`} />
    </div>
    <h3 className="text-[20px] font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{title}</h3>
    <p className="text-[15px] text-gray-400 leading-relaxed">{desc}</p>
  </div>
);
