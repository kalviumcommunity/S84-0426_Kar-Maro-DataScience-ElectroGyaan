import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { LucideZap, LucideEye, LucideEyeOff, LucideMail, LucideLock } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import AuthLeftPane from "../components/ui/AuthLeftPane";

const Login = () => {
  const [email, setEmail]      = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]  = useState(false);
  const [error, setError]      = useState("");
  const [loading, setLoading]  = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate               = useNavigate();
  const { isDark }             = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(""); setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError(""); setLoading(true);
      await googleLogin(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please use email/password login.");
    } finally { setLoading(false); }
  };

  return (
    <AuthShell>
      <AuthLeftPane
        heading={<>Smart Energy<br /><span className="gradient-text">Intelligence</span></>}
        subtext="Real-time anomaly detection, AI-powered forecasting, and live dashboards — purpose built for modern housing societies."
        highlights={[
          { icon: "⚡", text: "Live consumption tracking every 5 seconds" },
          { icon: "🤖", text: "AI anomaly detection with 97%+ precision" },
          { icon: "📊", text: "Hour-ahead ML forecasting & reports" },
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
          title="Welcome back"
          subtitle="Sign in to your account to continue."
          error={error}
          footer={
            <p className="text-center text-[13px] text-[var(--color-text-muted)]">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <AuthField label="Email Address">
              <InputWithIcon icon={<LucideMail className="w-4 h-4" />}>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="you@example.com"
                />
              </InputWithIcon>
            </AuthField>

            {/* Password */}
            <AuthField
              label="Password"
              labelRight={
                <a href="#" className="text-[12px] text-blue-500 hover:text-blue-400 transition-colors">
                  Forgot password?
                </a>
              }
            >
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

            <AuthSubmitButton loading={loading} label="Sign In" loadingLabel="Signing in…" />
          </form>

          <AuthDivider />

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed. Please use email/password login instead.")}
              theme={isDark ? "filled_black" : "outline"}
              shape="rectangular" size="large" text="continue_with" useOneTap={false}
            />
          </div>
        </AuthCard>
      </AuthRightPane>
    </AuthShell>
  );
};

export default Login;

/* ─── Shared layout primitives (used by both Login & Signup) ─── */

export function AuthShell({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-level-0 transition-colors duration-300">
      {children}
    </div>
  );
}

export function AuthRightPane({ children }) {
  return (
    /* Right pane: slightly different bg from left so there's visual separation in light mode */
    <div className="w-full lg:w-[42%] flex flex-col justify-center items-center p-6 lg:p-10 relative bg-level-0">
      {/* Theme toggle */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <LucideZap className="w-6 h-6 text-amber-400" />
        <span className="text-[20px] font-bold text-[var(--color-text-primary)]">ElectroGyaan AI</span>
      </div>

      <div className="w-full max-w-[420px]">
        {children}
      </div>
    </div>
  );
}

export function AuthCard({ title, subtitle, error, footer, children }) {
  return (
    /* Card: white in both modes, but with a real shadow in light so it lifts off the bg */
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl p-8"
      style={{ boxShadow: 'var(--shadow-card-lg)' }}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-[var(--color-text-primary)] leading-tight">{title}</h2>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1">{subtitle}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-500 text-[13px] flex items-start gap-2">
          <span className="shrink-0 mt-[1px]">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {children}

      {/* Footer */}
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}

export function AuthField({ label, labelRight, children }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-[13px] text-[var(--color-text-secondary)] font-medium">{label}</label>
        {labelRight}
      </div>
      {children}
    </div>
  );
}

export function InputWithIcon({ icon, right, children }) {
  return (
    <div className="relative flex items-center">
      {/* Left icon */}
      <span className="absolute left-3 text-[var(--color-text-faint)] pointer-events-none">
        {icon}
      </span>
      {/* Clone child with padding */}
      {React.cloneElement(children, {
        className: `${children.props.className} pl-10 ${right ? "pr-10" : ""}`,
      })}
      {/* Right slot */}
      {right && (
        <span className="absolute right-2">{right}</span>
      )}
    </div>
  );
}

export function AuthSubmitButton({ loading, label, loadingLabel, color = "blue" }) {
  const colors = {
    blue:  "from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-glow",
    green: "from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-glow",
  };
  return (
    <button
      disabled={loading} type="submit"
      className={`w-full h-[46px] rounded-lg bg-gradient-to-r ${colors[color]} text-white text-[14px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1`}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="flex-1 h-px bg-[var(--color-border-subtle)]"></div>
      <span className="text-[11px] text-[var(--color-text-faint)] uppercase tracking-widest">or</span>
      <div className="flex-1 h-px bg-[var(--color-border-subtle)]"></div>
    </div>
  );
}
