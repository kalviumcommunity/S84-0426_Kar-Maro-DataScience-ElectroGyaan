import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { LucideEye, LucideEyeOff, LucideMail, LucideLock, LucideUser, LucideShield } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import AuthLeftPane from "../components/ui/AuthLeftPane";
import {
  AuthShell,
  AuthRightPane,
  AuthCard,
  AuthField,
  InputWithIcon,
  AuthSubmitButton,
  AuthDivider,
} from "./Login";
import { LucideZap, LucideEye, LucideEyeOff } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const Signup = () => {
  const [username, setName]     = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [role, setRole]         = useState("user");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { signUp, googleLogin } = useAuth();
  const navigate                = useNavigate();
  const { isDark }              = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(""); setLoading(true);
      await signUp(username, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create an account");
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError(""); setLoading(true);
      await googleLogin(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please use email/password signup.");
    } finally { setLoading(false); }
  };

  return (
    <AuthShell>
      {/* Same left pane structure as Login — unified look */}
      <AuthLeftPane
        heading={<>Join the Future of<br /><span className="gradient-text">Energy Management</span></>}
        subtext="Take control of your apartment's energy future. Register today and unlock real-time intelligent insights and reporting."
        highlights={[
          { icon: "⚡", text: "Live consumption tracking every 5 seconds" },
          { icon: "🤖", text: "AI anomaly detection with 97%+ precision" },
          { icon: "📊", text: "Hourly forecasting & detailed reports" },
          { icon: "🔔", text: "Instant spike alerts for every flat" },
        ]}
        stats={[
          { value: "120+", label: "Societies" },
          { value: "98.5%", label: "Uptime" },
          { value: "<200ms", label: "Latency" },
        ]}
      />

      <AuthRightPane>
        <AuthCard
          title="Create account"
          subtitle="Fill in your details to get started."
          error={error}
          footer={
            <p className="text-center text-[13px] text-[var(--color-text-muted)]">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <AuthField label="Full Name">
              <InputWithIcon icon={<LucideUser className="w-4 h-4" />}>
                <input
                  type="text" required value={username}
                  onChange={e => setName(e.target.value)}
                  className="auth-input"
                  placeholder="John Doe"
                />
              </InputWithIcon>
            </AuthField>

            {/* Email */}
            <AuthField label="Email Address">
              <InputWithIcon icon={<LucideMail className="w-4 h-4" />}>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="john@example.com"
                />
              </InputWithIcon>
            </AuthField>

            {/* Password */}
            <AuthField label="Password">
              <InputWithIcon
                icon={<LucideLock className="w-4 h-4" />}
                right={
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] transition-colors p-1">
                    {showPwd ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                  </button>
                }
              >
                <input
                  type={showPwd ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                />
              </InputWithIcon>
            </AuthField>

            {/* Account Type */}
            <AuthField label="Account Type">
              <InputWithIcon icon={<LucideShield className="w-4 h-4" />}>
                <select
                  value={role} onChange={e => setRole(e.target.value)}
                  className="auth-input"
                >
                  <option value="user">Resident (User)</option>
                  <option value="admin">Building Admin</option>
                </select>
              </InputWithIcon>
            </AuthField>

            <AuthSubmitButton loading={loading} label="Create Account" loadingLabel="Creating account…" />
          </form>

          <AuthDivider />

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-up failed. Please use email/password signup instead.")}
              theme={isDark ? "filled_black" : "outline"}
              shape="rectangular" size="large" text="signup_with" useOneTap={false}
            />
          </div>
        </AuthCard>
      </AuthRightPane>
    </AuthShell>
    <div className="min-h-screen w-full flex bg-level-0 transition-colors duration-300">

      {/* ── LEFT PANE ── */}
      <div className="hidden lg:flex w-[60%] flex-col justify-center items-center relative overflow-hidden bg-level-1 border-r border-subtle">
        <div className="absolute top-[30%] right-[30%] w-96 h-96 bg-green-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-[30%] left-[20%] w-80 h-80 bg-blue-500/8 rounded-full blur-[100px] animate-ping-slow pointer-events-none"></div>

        <div className="relative z-10 text-center px-12 max-w-[520px]">
          <div className="flex items-center justify-center gap-2 mb-8">
            <LucideZap className="w-8 h-8 text-amber-400" style={{ filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.5))' }} />
            <span className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">ElectroGyaan</span>
            <span className="text-[14px] text-green-500 font-bold align-super">AI</span>
          </div>

          <h1 className="text-[42px] leading-[52px] font-extrabold tracking-tight text-[var(--color-text-primary)] mb-4">
            Join the Future of<br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Energy Management</span>
          </h1>
          <p className="text-[16px] text-[var(--color-text-muted)] leading-relaxed">
            Take control of your apartment's energy future. Register today and unlock real-time intelligent insights and reporting.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 flex flex-col gap-3 text-left">
            {[
              '⚡ Real-time consumption monitoring',
              '🤖 AI-powered anomaly detection',
              '📊 Hourly forecasting & reports',
              '🔔 Instant spike alerts',
            ].map(f => (
              <div key={f} className="flex items-center gap-2 text-[14px] text-[var(--color-text-secondary)]">
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANE ── */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center p-8 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-[420px]">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <LucideZap className="w-6 h-6 text-amber-400" />
            <span className="text-[20px] font-bold text-[var(--color-text-primary)]">ElectroGyaan AI</span>
          </div>

          <div className="bg-level-1 border border-subtle rounded-2xl p-8 shadow-card-lg">
            <h2 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-1">Create account</h2>
            <p className="text-[14px] text-[var(--color-text-muted)] mb-7">Fill in your details to get started.</p>

            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-[13px] flex items-start gap-2">
                <span className="mt-[1px]">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] text-[var(--color-text-secondary)] font-medium mb-1.5">Full Name</label>
                <input
                  type="text" required value={username}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-[46px] bg-level-2 border border-subtle rounded-lg px-4 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[13px] text-[var(--color-text-secondary)] font-medium mb-1.5">Email Address</label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-[46px] bg-level-2 border border-subtle rounded-lg px-4 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-[13px] text-[var(--color-text-secondary)] font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-[46px] bg-level-2 border border-subtle rounded-lg px-4 pr-11 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] transition-colors">
                    {showPwd ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[var(--color-text-secondary)] font-medium mb-1.5">Account Type</label>
                <select
                  value={role} onChange={e => setRole(e.target.value)}
                  className="w-full h-[46px] bg-level-2 border border-subtle rounded-lg px-4 text-[14px] text-[var(--color-text-primary)] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all appearance-none cursor-pointer">
                  <option value="user">Resident (User)</option>
                  <option value="admin">Building Admin</option>
                </select>
              </div>

              <button disabled={loading} type="submit"
                className="w-full h-[46px] rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-[14px] font-semibold transition-all hover:shadow-green-glow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--color-border-subtle)]"></div>
              <span className="text-[12px] text-[var(--color-text-faint)]">OR</span>
              <div className="flex-1 h-px bg-[var(--color-border-subtle)]"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-up failed. Please use email/password signup instead.")}
                theme={isDark ? "filled_black" : "outline"}
                shape="rectangular" size="large" text="signup_with" useOneTap={false}
              />
            </div>

            <p className="mt-7 text-center text-[13px] text-[var(--color-text-muted)]">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
