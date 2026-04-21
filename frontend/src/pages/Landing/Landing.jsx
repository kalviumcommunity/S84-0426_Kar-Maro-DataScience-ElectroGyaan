import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LucideZap, LucideArrowRight, LucidePlay, LucideActivity, 
  LucideTrendingUp, LucideBell, LucidePlug, LucideBrainCircuit,
  LucideWifi, LucideCpu, LucideAlertTriangle, LucideMonitor,
  LucideCheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Scatter, ComposedChart } from 'recharts';

// Mock data for dashboard mockup chart
const mockupChartData = [
  { time: '18:00', kwh: 10.5 },
  { time: '18:15', kwh: 11.2 },
  { time: '18:30', kwh: 12.1 },
  { time: '18:45', kwh: 13.7, anomaly: true },
  { time: '19:00', kwh: 12.8 },
  { time: '19:15', kwh: 13.5 },
  { time: '19:30', kwh: 14.2 },
  { time: '19:45', kwh: 13.9 }
];

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
          <Link to="/login" className="h-[36px] px-[16px] text-[14px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center transition-all active:scale-95">
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
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIC41SDQwTS41IDB2NDAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')]"></div>
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
              <div className="gradient-text">Intelligence for</div>
              <div className="text-white">Modern Societies</div>
            </h1>

            <p className="mt-[24px] text-[18px] leading-[28px] text-gray-400 font-normal max-w-[460px]">
              Real-time anomaly detection, AI-powered forecasting, and live dashboards — purpose built for 50–500 apartment communities across India.
            </p>

            <div className="mt-[40px] flex gap-[14px]">
              <Link to="/login" className="h-[48px] px-[28px] text-[16px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center transition-all active:scale-95">
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

            {/* SOCIAL PROOF */}
            <div className="mt-[48px] flex items-center gap-[16px]">
              {/* Avatar Stack */}
              <div className="flex -space-x-2">
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-[#0A0F1E] flex items-center justify-center text-[12px] font-bold text-white">RK</div>
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-[#0A0F1E] flex items-center justify-center text-[12px] font-bold text-white">SM</div>
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-[#0A0F1E] flex items-center justify-center text-[12px] font-bold text-white">AP</div>
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-[#0A0F1E] flex items-center justify-center text-[12px] font-bold text-white">VK</div>
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-[#0A0F1E] flex items-center justify-center text-[12px] font-bold text-white">NK</div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-white">120+ housing societies</span>
                <span className="text-[14px] text-gray-400">trust ElectroGyaan for energy monitoring</span>
              </div>
              
              <div className="w-[1px] h-[32px] bg-gray-700"></div>
              
              <div className="flex items-center gap-[6px]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-[14px]">★</span>
                ))}
                <span className="text-[12px] text-gray-400 ml-[6px]">4.9/5 rating</span>
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
      <section id="features" className="py-[96px] px-[80px] max-w-[1280px] mx-auto">
        <div className="text-center mb-[64px]">
          <div className="text-[12px] text-blue-400 font-bold uppercase tracking-[0.12em] mb-[12px]">CAPABILITIES</div>
          <h2 className="text-[36px] font-bold text-white mb-4">Everything you need to monitor energy at scale</h2>
          <p className="text-[18px] text-gray-400 max-w-[560px] mx-auto">Built for facilities managers, society secretaries, and engineers.</p>
        </div>

        <div className="grid grid-cols-3 gap-[24px]">
          <FeatureCard 
            icon={LucideActivity} 
            color="text-blue-400" 
            bg="bg-blue-400/10" 
            border="border-blue-400/20"
            title="Real-Time Monitoring" 
            desc="50+ apartments tracked simultaneously with 5-second polling cycles and sub-200ms latency."
          />
          <FeatureCard 
            icon={LucideBrainCircuit} 
            color="text-purple-500" 
            bg="bg-purple-500/10" 
            border="border-purple-500/20"
            title="AI Anomaly Detection" 
            desc="Isolation Forest ML model flags abnormal consumption spikes with 97%+ precision on test data."
          />
          <FeatureCard 
            icon={LucideTrendingUp} 
            color="text-green-500" 
            bg="bg-green-500/10" 
            border="border-green-500/20"
            title="Consumption Forecasting" 
            desc="Linear Regression hour-ahead predictions so facilities managers can plan load distribution proactively."
          />
          <FeatureCard 
            icon={LucideActivity} 
            color="text-blue-400" 
            bg="bg-blue-400/10" 
            border="border-blue-400/20"
            title="Live Dashboards" 
            desc="Recharts-powered ComposedChart with 50-reading window — anomalies marked as red scatter overlays."
          />
          <FeatureCard 
            icon={LucideBell} 
            color="text-amber-400" 
            bg="bg-amber-400/10" 
            border="border-amber-400/20"
            title="Instant Anomaly Alerts" 
            desc="Timestamped feed of every detected spike with flat ID, kWh reading, and ML confidence score."
          />
          <FeatureCard 
            icon={LucidePlug} 
            color="text-gray-300" 
            bg="bg-gray-300/10" 
            border="border-gray-300/20"
            title="IoT REST API" 
            desc="Plug any smart meter into our /api/energy/ingest endpoint. JSON payload, 201 response, done."
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-[96px] px-[80px] bg-level-1 border-t border-b border-subtle">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-[64px]">
            <div className="text-[12px] text-blue-400 font-bold uppercase tracking-[0.12em] mb-[12px]">PROCESS</div>
            <h2 className="text-[36px] font-bold text-white">From meter to insight in milliseconds</h2>
          </div>

          {/* Steps */}
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
        </div>
      </section>
      
      {/* FINAL CTA & FOOTER */}
      <section className="py-[100px] text-center max-w-[800px] mx-auto px-[20px]">
        <h2 className="text-[32px] font-bold text-white mb-6">Ready to optimize your infrastructure?</h2>
        <Link to="/login" className="inline-flex h-[56px] px-[32px] text-[16px] font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md hover:shadow-[0_0_24px_rgba(59,130,246,0.3)] items-center justify-center transition-all active:scale-95">
          Get Started Now
        </Link>
        
        {/* FOOTER */}
        <div className="mt-[80px] pt-[40px] border-t border-subtle">
          <div className="flex justify-between items-center text-[14px] text-gray-500">
            <div className="flex items-center gap-2">
              <LucideZap className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-gray-400">ElectroGyaan AI</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a id="docs" href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Status</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-[20px] text-[12px] text-gray-500 text-center">
            © 2024 ElectroGyaan AI · Built for Bharat 🇮🇳
          </div>
        </div>
      </section>

    </div>
  );
}

// Dashboard Mockup Component
const DashboardMockup = () => {
  return (
    <div className="relative">
      {/* Main Mockup Card */}
      <div className="w-[580px] h-[380px] bg-level-2 border border-blue-500/40 rounded-2xl shadow-card-mockup mockup-3d">
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
              <div className="text-[14px] font-mono font-bold text-amber-400">847</div>
              <div className="text-[9px] text-gray-500 uppercase">kWh</div>
            </div>
            <div className="flex-1 h-[52px] bg-level-3 rounded-lg p-2 flex flex-col justify-center">
              <div className="text-[14px] font-mono font-bold text-red-400">7</div>
              <div className="text-[9px] text-gray-500 uppercase">Alerts</div>
            </div>
            <div className="flex-1 h-[52px] bg-level-3 rounded-lg p-2 flex flex-col justify-center">
              <div className="text-[14px] font-mono font-bold text-blue-400">16.9</div>
              <div className="text-[9px] text-gray-500 uppercase">avg</div>
            </div>
            <div className="flex-1 h-[52px] bg-level-3 rounded-lg p-2 flex flex-col justify-center">
              <div className="text-[14px] font-mono font-bold text-green-400">23.4</div>
              <div className="text-[9px] text-gray-500 uppercase">fcst</div>
            </div>
          </div>
          
          {/* Chart Area */}
          <div className="h-[200px] bg-level-1 rounded-lg overflow-hidden relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockupChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mockupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.25)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="rgba(59,130,246,0.0)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(55,65,81,0.15)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                <YAxis domain={[0, 16]} ticks={[0, 4, 8, 12, 16]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                <Area type="monotone" dataKey="kwh" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#mockupGradient)" />
                <Scatter data={mockupChartData.filter(d => d.anomaly)} fill="#EF4444" shape={(props) => {
                  const { cx, cy } = props;
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
            <div className="absolute top-[60px] left-[55%] bg-level-4 border border-red-400/40 rounded-md p-2 text-[9px] shadow-red-glow">
              <div className="text-white font-mono">A112 · 13.7 kWh</div>
              <div className="text-red-400 mt-0.5">⚠ Anomaly</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Stat Card A - Bottom Left */}
      <div className="absolute bottom-[-20px] left-[-40px] w-[160px] h-[72px] bg-level-3 border border-blue-400/40 rounded-lg shadow-blue-glow p-3">
        <div className="text-[10px] text-gray-400">🚨 Active Anomaly</div>
        <div className="text-[12px] text-white font-semibold mt-1">Flat A112 · 13.7 kWh</div>
        <div className="text-[9px] text-gray-500 mt-1">3 seconds ago</div>
      </div>
      
      {/* Floating Stat Card B - Top Right */}
      <div className="absolute top-[-20px] right-[-30px] w-[180px] h-[68px] bg-level-3 border border-amber-400/40 rounded-lg shadow-amber-glow p-3">
        <div className="text-[10px] text-gray-400">🔮 Next Hour Forecast</div>
        <div className="text-[20px] text-amber-400 font-mono font-bold mt-1">23.4 <span className="text-[12px] text-gray-400">kWh</span></div>
        <div className="text-[9px] text-red-400 mt-1">↑ 8% vs last hour</div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, color, bg, border, title, desc }) => (
  <div className="p-[28px_24px] bg-level-2 border border-subtle rounded-2xl hover:border-blue-400/50 hover:-translate-y-[2px] hover:shadow-blue-glow transition-all duration-[250ms] cubic-bezier(0.4,0,0.2,1) group">
    <div className={`w-[48px] h-[48px] ${bg} ${border} border rounded-lg flex items-center justify-center mb-4`}>
      <Icon className={`w-[20px] h-[20px] ${color}`} />
    </div>
    <h3 className="text-[18px] font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
    <p className="text-[14px] text-gray-400 leading-[22px]">{desc}</p>
  </div>
);

// Process Step Component
const ProcessStep = ({ number, icon: Icon, title, desc, iconColor = "text-gray-300" }) => (
  <div className="flex flex-col items-center text-center w-[220px] relative z-10">
    <div className="w-[48px] h-[48px] bg-level-2 border border-blue-400/40 rounded-full flex items-center justify-center text-[24px] font-extrabold text-blue-400 shadow-blue-glow mb-4">
      {number}
    </div>
    <Icon className={`w-[32px] h-[32px] ${iconColor} mb-3`} />
    <h4 className="text-[18px] font-semibold text-white mb-2">{title}</h4>
    <p className="text-[14px] text-gray-400 max-w-[180px]">{desc}</p>
  </div>
);
