import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedGrid from '../../components/ui/AnimatedGrid';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { 
  LucideZap, LucideArrowRight, LucidePlay, LucideActivity, 
  LucideTrendingUp, LucideBell, LucidePlug, LucideBrainCircuit,
  LucideWifi, LucideCpu, LucideAlertTriangle, LucideMonitor,
  LucideCheckCircle
} from 'lucide-react';
import { Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Scatter, ComposedChart } from 'recharts';

const FLAT_IDS = [
  'A101', 'A102', 'A103', 'A104', 'A105', 'A106', 'A107', 'A108', 'A109', 'A110',
  'A111', 'A112', 'A113', 'A114', 'A115', 'A116', 'A117', 'A118', 'A119', 'A120',
  'A121', 'A122', 'A123', 'A124', 'A125', 'A126', 'A127', 'A128', 'A129', 'A130',
  'A131', 'A132', 'A133', 'A134', 'A135', 'A136', 'A137', 'A138', 'A139', 'A140',
  'A141', 'A142', 'A143', 'A144', 'A145', 'A146', 'A147', 'A148', 'A149', 'A150',
];

const FLAT_KWH = [
  10.5, 10.7, 10.9, 11.1, 11.4, 11.7, 11.9, 12.1, 12.4, 12.7,
  12.9, 13.2, 13.6, 13.9, 14.1, 13.8, 13.5, 13.3, 13.1, 12.9,
  12.7, 12.8, 13.0, 13.2, 13.4, 13.7, 13.9, 14.0, 14.2, 14.3,
  14.1, 13.9, 13.8, 13.6, 13.5, 13.4, 13.2, 13.0, 12.8, 12.7,
  12.6, 12.5, 12.4, 12.3, 12.2, 12.4, 12.7, 13.0, 13.3, 13.6,
];

const FLAT_ALERTS = [
  2, 1, 2, 3, 2, 4, 3, 2, 5, 4,
  2, 6, 5, 4, 6, 5, 4, 3, 2, 3,
  2, 4, 3, 4, 5, 4, 5, 6, 5, 3,
  4, 5, 6, 5, 4, 5, 3, 4, 3, 2,
  2, 3, 2, 4, 1, 3, 2, 4, 3, 5,
];

const FLAT_AVG = [
  10.1, 10.4, 10.6, 10.9, 11.1, 11.4, 11.6, 11.8, 12.0, 12.2,
  12.4, 12.6, 12.8, 13.0, 13.2, 13.1, 12.9, 12.8, 12.7, 12.5,
  12.4, 12.6, 12.7, 12.9, 13.0, 13.2, 13.3, 13.5, 13.6, 13.7,
  13.5, 13.4, 13.3, 13.2, 13.1, 13.0, 12.8, 12.7, 12.6, 12.5,
  12.4, 12.3, 12.2, 12.1, 11.9, 12.1, 12.3, 12.5, 12.8, 13.0,
];

const FLAT_FCST = [
  10.9, 11.0, 11.3, 11.6, 11.8, 12.1, 12.3, 12.5, 12.8, 13.0,
  13.1, 13.4, 13.8, 14.1, 14.2, 14.0, 13.7, 13.5, 13.3, 13.1,
  13.0, 13.1, 13.4, 13.6, 13.8, 14.0, 14.1, 14.3, 14.5, 14.6,
  14.3, 14.1, 14.0, 13.9, 13.8, 13.7, 13.5, 13.3, 13.1, 13.0,
  12.9, 12.8, 12.7, 12.6, 12.4, 12.7, 13.0, 13.2, 13.5, 13.8,
];

const TIME_LABELS = ['18:00', '18:05', '18:10', '18:15', '18:20', '18:25', '18:30', '18:35', '18:40', '18:45'];

const ALERT_INDEX_PATTERNS = {
  1: [4],
  2: [2, 7],
  3: [1, 4, 8],
  4: [1, 3, 6, 8],
  5: [0, 2, 4, 7, 9],
  6: [0, 2, 4, 6, 8, 9],
};

const FLAT_ANOMALY_SHIFTS = [
  0, 2, 4, 1, 3, 5, 7, 9, 6, 8,
  1, 3, 5, 7, 9, 0, 2, 4, 6, 8,
  3, 5, 7, 9, 1, 0, 2, 4, 6, 8,
  9, 7, 5, 3, 1, 2, 4, 6, 8, 0,
  1, 3, 5, 7, 9, 8, 6, 4, 2, 0,
];

const BASE_PROFILES = [
  [-0.8, -0.5, -0.2, 0.1, 0.3, 0.5, 0.4, 0.2, 0.0, -0.1],
  [-0.6, -0.3, 0.1, 0.4, 0.6, 0.3, 0.0, -0.2, -0.4, -0.1],
  [-0.7, -0.4, -0.1, 0.2, 0.4, 0.7, 0.5, 0.1, -0.2, -0.3],
  [-0.5, -0.1, 0.2, 0.5, 0.7, 0.6, 0.3, 0.0, -0.3, -0.2],
];

const buildLineSeries = (kwh, flatIdx) => {
  const profile = BASE_PROFILES[flatIdx % BASE_PROFILES.length];
  return profile.map((delta, pointIdx) => {
    const microOffset = (((flatIdx + pointIdx) % 5) - 2) * 0.08;
    return Number((kwh + delta + microOffset).toFixed(1));
  });
};

const FLAT_DATASET_50 = FLAT_IDS.map((flatId, idx) => ({
  flatId,
  kwh: FLAT_KWH[idx],
  alerts: FLAT_ALERTS[idx],
  avg: FLAT_AVG[idx],
  fcst: FLAT_FCST[idx],
  lineSeries: buildLineSeries(FLAT_KWH[idx], idx),
  anomalyIndices: ALERT_INDEX_PATTERNS[FLAT_ALERTS[idx]]
    .map((basePoint) => (basePoint + FLAT_ANOMALY_SHIFTS[idx]) % TIME_LABELS.length)
    .sort((a, b) => a - b),
}));

const shuffleIndexes = (count) => {
  const values = Array.from({ length: count }, (_, i) => i);
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-level-0 font-inter text-[var(--color-text-primary)] overflow-hidden transition-colors duration-300">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-[64px] bg-[var(--color-surface-topbar)] z-[100] px-[80px] flex justify-between items-center border-b border-subtle">
        <div className="w-[200px] flex items-center gap-2">
          <LucideZap className="w-5 h-5 text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]" />
          <span className="text-[18px] font-bold text-[var(--color-text-primary)] tracking-tight">ElectroGyaan</span>
          <span className="text-[12px] text-blue-500 align-super ml-[1px]">AI</span>
        </div>
        <div className="flex gap-[32px]">
          <a href="#features" className="text-[14px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-150">Features</a>
          <a href="#how-it-works" className="text-[14px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-150">How It Works</a>
          <a href="#docs" className="text-[14px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-150">Docs</a>
        </div>
        <div className="flex items-center gap-[12px]">
          <ThemeToggle />
          <Link to="/login" className="h-[36px] flex items-center px-[16px] text-[14px] text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)] border border-transparent hover:border-subtle hover:bg-level-3 rounded-md transition-all">
            Log In
          </Link>
          <Link to="/login" className="h-[36px] px-[16px] text-[14px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-blue-glow flex items-center transition-all active:scale-95">
            Get Started <LucideArrowRight className="w-[14px] h-[14px] ml-[6px]" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[720px] h-screen pt-[120px] pb-0 px-[80px]">
        {/* Background Patterns */}
        <AnimatedGrid />
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[30%] left-[30%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-[30%] left-[75%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10 grid grid-cols-12 gap-[24px]">
          {/* Left Column */}
          <div className="col-span-6 pr-[48px]">
            <div className="inline-flex items-center bg-blue-600/10 border border-blue-500/30 rounded-full px-[14px] py-[5px] gap-[6px]">
              <span className="w-[6px] h-[6px] bg-green-500 rounded-full animate-pulse-custom"></span>
              <span className="text-[12px] font-semibold text-blue-400">⚡ Now in Beta — 120+ Societies Live</span>
            </div>

            <h1 className="mt-[20px] text-[56px] leading-[64px] font-extrabold tracking-[-0.03em] h-[192px]">
              <div className="text-[var(--color-text-primary)]">Smart Energy</div>
              <div className="gradient-text">Intelligence for</div>
              <div className="text-[var(--color-text-primary)]">Modern Societies</div>
            </h1>

            <p className="mt-[24px] text-[18px] leading-[28px] text-[var(--color-text-muted)] font-normal max-w-[460px]">
              Real-time anomaly detection, AI-powered forecasting, and live dashboards — purpose built for 50–500 apartment communities across India.
            </p>

            <div className="mt-[40px] flex gap-[14px]">
              <Link to="/login" className="h-[48px] px-[28px] text-[16px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-blue-glow flex items-center transition-all active:scale-95">
                Get Started <LucideArrowRight className="w-[16px] h-[16px] ml-[8px]" />
              </Link>
              <button className="h-[48px] px-[24px] rounded-md border border-subtle text-[var(--color-text-secondary)] hover:border-strong hover:bg-level-3 hover:text-[var(--color-text-primary)] flex items-center transition-all">
                <div className="w-[24px] h-[24px] bg-[var(--color-border-subtle)] rounded-full flex items-center justify-center mr-[8px]">
                  <LucidePlay className="w-[10px] h-[10px] text-[var(--color-text-primary)] ml-[2px]" fill="currentColor" />
                </div>
                Watch Demo
                <span className="ml-[8px] text-[var(--color-text-faint)] font-mono text-[14px]">2:34</span>
              </button>
            </div>

            {/* SOCIAL PROOF */}
            <div className="mt-[48px] flex items-center gap-[16px]">
              <div className="flex -space-x-2">
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-[var(--color-level-0)] flex items-center justify-center text-[12px] font-bold text-white">RK</div>
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-[var(--color-level-0)] flex items-center justify-center text-[12px] font-bold text-white">SM</div>
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-[var(--color-level-0)] flex items-center justify-center text-[12px] font-bold text-white">AP</div>
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-[var(--color-level-0)] flex items-center justify-center text-[12px] font-bold text-white">VK</div>
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-[var(--color-level-0)] flex items-center justify-center text-[12px] font-bold text-white">NK</div>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">120+ housing societies</span>
                <span className="text-[14px] text-[var(--color-text-muted)]">trust ElectroGyaan for energy monitoring</span>
              </div>
              <div className="w-[1px] h-[32px] bg-[var(--color-border-subtle)]"></div>
              <div className="flex items-center gap-[6px]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-[14px]">★</span>
                ))}
                <span className="text-[12px] text-[var(--color-text-muted)] ml-[6px]">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Right Column / Mockup */}
          <div className="col-span-6 pl-[24px] relative flex justify-end items-start">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <ScrollReveal className="w-full" delay={40}>
      <div className="h-[80px] bg-level-1 border-t border-b border-subtle flex">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-[24px] font-mono font-bold text-amber-500">36,000+</div>
            <div className="text-[12px] text-[var(--color-text-faint)] uppercase tracking-widest mt-1">Readings Processed Monthly</div>
          </div>
        </div>
        <div className="w-[1px] h-[36px] bg-[var(--color-border-subtle)] my-auto"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-[24px] font-mono font-bold text-green-500">98.5%</div>
            <div className="text-[12px] text-[var(--color-text-faint)] uppercase tracking-widest mt-1">Platform Uptime SLA</div>
          </div>
        </div>
        <div className="w-[1px] h-[36px] bg-[var(--color-border-subtle)] my-auto"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-[24px] font-mono font-bold text-blue-500">&lt;200ms</div>
            <div className="text-[12px] text-[var(--color-text-faint)] uppercase tracking-widest mt-1">Average Ingest Latency</div>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* FEATURES SECTION */}
      <section id="features" className="py-[96px] px-[80px] max-w-[1280px] mx-auto">
        <ScrollReveal delay={60}>
        <div className="text-center mb-[64px]">
          <div className="text-[12px] text-blue-500 font-bold uppercase tracking-[0.12em] mb-[12px]">CAPABILITIES</div>
          <h2 className="text-[36px] font-bold text-[var(--color-text-primary)] mb-4">Everything you need to monitor energy at scale</h2>
          <p className="text-[18px] text-[var(--color-text-muted)] max-w-[560px] mx-auto">Built for facilities managers, society secretaries, and engineers.</p>
        </div>
        </ScrollReveal>

        <div className="grid grid-cols-3 gap-[24px]">
          <ScrollReveal delay={80}><FeatureCard 
            icon={LucideActivity} 
            color="text-blue-400" 
            bg="bg-blue-400/10" 
            border="border-blue-400/20"
            title="Real-Time Monitoring" 
            desc="50+ apartments tracked simultaneously with 5-second polling cycles and sub-200ms latency."
          /></ScrollReveal>
          <ScrollReveal delay={110}><FeatureCard 
            icon={LucideBrainCircuit} 
            color="text-purple-500" 
            bg="bg-purple-500/10" 
            border="border-purple-500/20"
            title="AI Anomaly Detection" 
            desc="Isolation Forest ML model flags abnormal consumption spikes with 97%+ precision on test data."
          /></ScrollReveal>
          <ScrollReveal delay={140}><FeatureCard 
            icon={LucideTrendingUp} 
            color="text-green-500" 
            bg="bg-green-500/10" 
            border="border-green-500/20"
            title="Consumption Forecasting" 
            desc="Linear Regression hour-ahead predictions so facilities managers can plan load distribution proactively."
          /></ScrollReveal>
          <ScrollReveal delay={80}><FeatureCard 
            icon={LucideActivity} 
            color="text-blue-400" 
            bg="bg-blue-400/10" 
            border="border-blue-400/20"
            title="Live Dashboards" 
            desc="Recharts-powered ComposedChart with 50-reading window — anomalies marked as red scatter overlays."
          /></ScrollReveal>
          <ScrollReveal delay={110}><FeatureCard 
            icon={LucideBell} 
            color="text-amber-400" 
            bg="bg-amber-400/10" 
            border="border-amber-400/20"
            title="Instant Anomaly Alerts" 
            desc="Timestamped feed of every detected spike with flat ID, kWh reading, and ML confidence score."
          /></ScrollReveal>
          <ScrollReveal delay={140}><FeatureCard 
            icon={LucidePlug} 
            color="text-gray-300" 
            bg="bg-gray-300/10" 
            border="border-gray-300/20"
            title="IoT REST API" 
            desc="Plug any smart meter into our /api/energy/ingest endpoint. JSON payload, 201 response, done."
          /></ScrollReveal>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-[96px] px-[80px] bg-level-1 border-t border-b border-subtle">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal delay={50}>
          <div className="text-center mb-[64px]">
            <div className="text-[12px] text-blue-500 font-bold uppercase tracking-[0.12em] mb-[12px]">PROCESS</div>
            <h2 className="text-[36px] font-bold text-[var(--color-text-primary)]">From meter to insight in milliseconds</h2>
          </div>
          </ScrollReveal>

          {/* Steps */}
          <ScrollReveal delay={90}>
          <div className="flex items-start justify-between relative">
            {/* Connector lines */}
            <div className="absolute top-[24px] left-[10%] right-[10%] h-[1px] border-t-[1.5px] border-dashed border-gray-700"></div>
            
            <ProcessStep 
              number="1" 
              icon={LucideWifi}
              title="Smart Meter Sends Data"
              desc="IoT simulator POSTs reading to /api/energy/ingest every 5 seconds"
            />
            <ProcessStep 
              number="2" 
              icon={LucideCpu}
              title="AI Analyzes in Real-Time"
              desc="Express calls FastAPI. IsolationForest runs cyclical feature inference"
            />
            <ProcessStep 
              number="3" 
              icon={LucideAlertTriangle}
              title="Anomalies Flagged"
              desc="isAnomaly=true saved to MongoDB. Feed updates. Alert fired."
              iconColor="text-amber-400"
            />
            <ProcessStep 
              number="4" 
              icon={LucideMonitor}
              title="Dashboard Goes Live"
              desc="React polls every 5s. Chart updates. Red dot appears. Manager acts."
              iconColor="text-green-400"
            />
          </div>
          </ScrollReveal>
        </div>
      </section>
      
      {/* FINAL CTA & FOOTER */}
      <section className="py-[96px] px-[80px] bg-[linear-gradient(180deg,rgba(10,15,30,0)_0%,rgba(8,14,30,0.68)_36%,rgba(8,14,30,0.96)_100%)] border-t border-subtle">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal delay={60}>
          <div className="text-center">
            <h2 className="text-[42px] leading-[52px] font-bold text-[var(--color-text-primary)]">Ready to optimize your infrastructure?</h2>
            <p className="mt-4 text-[20px] leading-[32px] text-[var(--color-text-muted)] max-w-[760px] mx-auto">Deploy AI-driven monitoring, anomaly detection, and forecasting for every apartment block in your society.</p>
            <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
              <Link to="/login" className="inline-flex h-[56px] min-w-[220px] px-[34px] text-[18px] font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg hover:shadow-[0_0_24px_rgba(59,130,246,0.32)] items-center justify-center transition-all active:scale-95">
                Get Started Now
              </Link>
              <a href="#features" className="inline-flex h-[56px] min-w-[220px] px-[32px] text-[17px] font-semibold text-gray-200 border border-blue-400/35 rounded-lg hover:border-blue-300 hover:text-white hover:bg-blue-500/10 transition-all items-center justify-center">
                Explore Features
              </a>
            </div>
          </div>
          </ScrollReveal>

          {/* FOOTER */}
          <ScrollReveal delay={100}>
          <footer className="mt-[76px] pt-[34px] border-t border-subtle">
            <div className="grid grid-cols-12 gap-y-8 gap-x-10 items-start">
              <div className="col-span-12 lg:col-span-4">
                <div className="flex items-center gap-2">
                  <LucideZap className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-[var(--color-text-primary)] text-[28px] leading-none">ElectroGyaan AI</span>
                </div>
                <p className="mt-4 text-[16px] leading-7 text-[var(--color-text-muted)]">Smart energy intelligence platform for modern societies. Monitor usage, detect anomalies, and forecast demand in real-time.</p>
              </div>

              <div className="col-span-6 sm:col-span-4 lg:col-span-2">
                <div className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-text-faint)] mb-4">Platform</div>
                <div className="space-y-3 text-[16px]">
                  <a href="#features" className="block text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Features</a>
                  <a href="#how-it-works" className="block text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">How It Works</a>
                  <a id="docs" href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Docs</a>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-4 lg:col-span-2">
                <div className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-text-faint)] mb-4">Company</div>
                <div className="space-y-3 text-[16px]">
                  <a href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Privacy</a>
                  <a href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Terms</a>
                  <a href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Contact</a>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-4 lg:col-span-4">
                <div className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-text-faint)] mb-4">Realtime Snapshot</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-blue-500/25 bg-blue-500/10 p-3">
                    <div className="text-[11px] text-[var(--color-text-faint)]">Flats</div>
                    <div className="text-[20px] leading-6 font-mono text-[var(--color-text-primary)]">50</div>
                  </div>
                  <div className="rounded-lg border border-green-500/25 bg-green-500/10 p-3">
                    <div className="text-[11px] text-[var(--color-text-faint)]">Uptime</div>
                    <div className="text-[20px] leading-6 font-mono text-[var(--color-text-primary)]">98.5%</div>
                  </div>
                  <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3">
                    <div className="text-[11px] text-[var(--color-text-faint)]">Latency</div>
                    <div className="text-[20px] leading-6 font-mono text-[var(--color-text-primary)]">&lt;200ms</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-5 border-t border-subtle flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
              <div className="text-[13px] text-[var(--color-text-faint)]">© 2026 ElectroGyaan AI</div>
              <div className="text-[13px] text-[var(--color-text-faint)]">Powering data-driven energy decisions for housing communities</div>
            </div>
          </footer>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}

// Dashboard Mockup Component
const DashboardMockup = () => {
  const orderRef = useRef(shuffleIndexes(FLAT_DATASET_50.length));
  const pointerRef = useRef(0);
  const [activeFlatIndex, setActiveFlatIndex] = useState(orderRef.current[0]);

  useEffect(() => {
    const rotateTimer = setInterval(() => {
      pointerRef.current += 1;
      if (pointerRef.current >= orderRef.current.length) {
        orderRef.current = shuffleIndexes(FLAT_DATASET_50.length);
        pointerRef.current = 0;
      }
      setActiveFlatIndex(orderRef.current[pointerRef.current]);
    }, 3000);

    return () => clearInterval(rotateTimer);
  }, []);

  const activeFlat = FLAT_DATASET_50[activeFlatIndex];

  const chartData = useMemo(() => {
    return TIME_LABELS.map((time, index) => ({
      pointIndex: index,
      time,
      kwh: activeFlat.lineSeries[index],
      anomaly: activeFlat.anomalyIndices.includes(index),
    }));
  }, [activeFlat]);

  const anomalyData = useMemo(
    () => chartData.filter((point) => point.anomaly),
    [chartData]
  );

  const highlightAnomaly = anomalyData[0] || chartData[0];

  const forecastDelta = activeFlat.fcst - activeFlat.kwh;
  const forecastDirection = forecastDelta >= 0 ? '↑' : '↓';
  const forecastDeltaPercent = Math.abs((forecastDelta / activeFlat.kwh) * 100).toFixed(1);

  return (
    <div className="relative w-full max-w-[580px]">
      {/* Main Mockup Card */}
      <div className="w-full min-h-[360px] bg-level-2 border border-blue-500/40 rounded-2xl shadow-card-mockup mockup-3d">
        {/* Top Bar */}
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
        
        {/* Content */}
        <div className="p-4">
          {/* Mini KPI Row */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 h-[52px] bg-level-3 rounded-lg p-2 flex flex-col justify-center">
              <div className="text-[14px] font-mono font-bold text-amber-400">{activeFlat.kwh.toFixed(1)}</div>
              <div className="text-[9px] text-gray-500 uppercase">kWh</div>
            </div>
            <div className="flex-1 h-[52px] bg-level-3 rounded-lg p-2 flex flex-col justify-center">
              <div className="text-[14px] font-mono font-bold text-red-400">{activeFlat.alerts}</div>
              <div className="text-[9px] text-gray-500 uppercase">Alerts</div>
            </div>
            <div className="flex-1 h-[52px] bg-level-3 rounded-lg p-2 flex flex-col justify-center">
              <div className="text-[14px] font-mono font-bold text-blue-400">{activeFlat.avg.toFixed(1)}</div>
              <div className="text-[9px] text-gray-500 uppercase">avg</div>
            </div>
            <div className="flex-1 h-[52px] bg-level-3 rounded-lg p-2 flex flex-col justify-center">
              <div className="text-[14px] font-mono font-bold text-green-400">{activeFlat.fcst.toFixed(1)}</div>
              <div className="text-[9px] text-gray-500 uppercase">fcst</div>
            </div>
          </div>
          
          {/* Chart Area */}
          <div className="h-[200px] sm:h-[220px] bg-level-1 rounded-lg overflow-hidden relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mockupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.25)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="rgba(59,130,246,0.0)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(55,65,81,0.15)" />
                <XAxis
                  dataKey="pointIndex"
                  type="number"
                  domain={[0, TIME_LABELS.length - 1]}
                  ticks={[0, 2, 4, 6, 8, 9]}
                  tickFormatter={(value) => TIME_LABELS[value] || ''}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                />
                <YAxis domain={[8, 16]} ticks={[8, 10, 12, 14, 16]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                <Area type="monotone" dataKey="kwh" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#mockupGradient)" />
                <Scatter data={anomalyData} dataKey="kwh" fill="#EF4444" shape={(props) => {
                  const { cx, cy } = props;
                  if (typeof cx !== 'number' || typeof cy !== 'number') {
                    return null;
                  }
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={6} fill="none" stroke="#EF4444" strokeWidth={1.5} opacity={0.4} />
                      <circle cx={cx} cy={cy} r={3} fill="#EF4444" />
                    </g>
                  );
                }} />
              </ComposedChart>
            </ResponsiveContainer>
            
            {/* LIVE Badge */}
            <div className="absolute top-2 right-2 flex items-center gap-[4px] bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded-full px-[6px] py-[2px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-custom"></span>
              <span className="text-[9px] font-bold text-green-400">LIVE</span>
            </div>
            
            {/* Tooltip on anomaly */}
            <div className="absolute top-[62px] left-[52%] z-20 min-w-[126px] bg-[rgba(15,23,42,0.92)] border border-red-400/70 rounded-lg px-3 py-2 text-[11px] backdrop-blur-sm shadow-[0_0_24px_rgba(239,68,68,0.28)] pointer-events-none">
              <div className="text-white font-mono font-semibold tracking-wide">{activeFlat.flatId} · {highlightAnomaly.kwh.toFixed(1)} kWh</div>
              <div className="text-red-300 mt-1 font-medium">⚠ Anomaly</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Stat Card A - Bottom Left */}
      <div className="absolute bottom-[-20px] left-[-18px] sm:left-[-40px] w-[160px] h-[72px] bg-level-3 border border-blue-400/40 rounded-lg shadow-blue-glow p-3">
        <div className="text-[10px] text-[var(--color-text-faint)]">🚨 Active Anomaly</div>
        <div className="text-[12px] text-[var(--color-text-primary)] font-semibold mt-1">Flat {activeFlat.flatId} · {highlightAnomaly.kwh.toFixed(1)} kWh</div>
        <div className="text-[9px] text-[var(--color-text-faint)] mt-1">3 seconds ago</div>
      </div>
      
      {/* Floating Stat Card B - Top Right */}
      <div className="absolute top-[-20px] right-[-10px] sm:right-[-30px] w-[180px] h-[68px] bg-level-3 border border-amber-400/40 rounded-lg shadow-amber-glow p-3">
        <div className="text-[10px] text-[var(--color-text-faint)]">🔮 Next Hour Forecast</div>
        <div className="text-[20px] text-amber-500 font-mono font-bold mt-1">{activeFlat.fcst.toFixed(1)} <span className="text-[12px] text-[var(--color-text-faint)]">kWh</span></div>
        <div className="text-[9px] text-red-500 mt-1">{forecastDirection} {forecastDeltaPercent}% vs last hour</div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, color, bg, border, title, desc }) => (
  <div className="p-[28px_24px] bg-level-2 border border-subtle rounded-2xl hover:border-blue-500/40 hover:-translate-y-[2px] hover:shadow-blue-glow transition-all duration-[250ms] group shadow-card">
    <div className={`w-[48px] h-[48px] ${bg} ${border} border rounded-lg flex items-center justify-center mb-4`}>
      <Icon className={`w-[20px] h-[20px] ${color}`} />
    </div>
    <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-blue-500 transition-colors">{title}</h3>
    <p className="text-[14px] text-[var(--color-text-muted)] leading-[22px]">{desc}</p>
  </div>
);

// Process Step Component
const ProcessStep = ({ number, icon: Icon, title, desc, iconColor = "text-[var(--color-text-secondary)]" }) => (
  <div className="flex flex-col items-center text-center w-[220px] relative z-10">
    <div className="w-[48px] h-[48px] bg-level-2 border border-blue-500/40 rounded-full flex items-center justify-center text-[24px] font-extrabold text-blue-500 shadow-blue-glow mb-4">
      {number}
    </div>
    <Icon className={`w-[32px] h-[32px] ${iconColor} mb-3`} />
    <h4 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2">{title}</h4>
    <p className="text-[14px] text-[var(--color-text-muted)] max-w-[180px]">{desc}</p>
  </div>
);

const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const revealRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = revealRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.18,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={revealRef}
      className={`${className} transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
