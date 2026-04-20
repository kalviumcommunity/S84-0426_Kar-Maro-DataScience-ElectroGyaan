import React from 'react';
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
          <a href="#" className="text-[14px] font-medium text-white transition-colors duration-150">Features</a>
          <a href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors duration-150">How It Works</a>
          <a href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors duration-150">Pricing</a>
          <a href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors duration-150">Docs</a>
        </div>
        <div className="flex items-center gap-[12px]">
          <button className="h-[36px] px-[16px] text-[14px] text-gray-300 font-medium hover:text-white border border-transparent hover:border-strong hover:bg-level-3 rounded-md transition-all">
            Log In
          </button>
          <button className="h-[36px] px-[16px] text-[14px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center transition-all active:scale-95">
            Get Started Free <LucideArrowRight className="w-[14px] h-[14px] ml-[6px]" />
          </button>
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
              <button className="h-[48px] px-[28px] text-[16px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center transition-all active:scale-95">
                Start Free Trial <LucideArrowRight className="w-[16px] h-[16px] ml-[8px]" />
              </button>
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
    </div>
  );
}
