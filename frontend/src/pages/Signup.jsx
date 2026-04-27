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
import { LucideZap } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";

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
  );
};

export default Signup;
