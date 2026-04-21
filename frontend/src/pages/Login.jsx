import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { LucideMail, LucideLock, LucideEye, LucideEyeOff, LucideCheckCircle, LucideZap } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError("Failed to sign in: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setLoading(true);
      await googleLogin(credentialResponse.credential);
    } catch (err) {
      setError("Google sign-in failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-level-0">
      {/* LEFT PANEL - 720px */}
      <div className="hidden lg:flex w-[720px] flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0D1425] via-[#0A0F1E] to-[#0D1A2E] p-[64px]">
        {/* Background decorative elements */}
        <div className="absolute top-[-60px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15),transparent)] pointer-events-none"></div>
        <div className="absolute bottom-[100px] right-[-40px] w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.1),transparent)] pointer-events-none"></div>
        
        {/* Animated waveform lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 200 Q 100 150, 200 200 T 400 200 T 600 200 T 800 200" stroke="#3B82F6" strokeWidth="1.5" fill="none" className="animate-[wave_8s_ease-in-out_infinite]" />
          <path d="M0 250 Q 100 200, 200 250 T 400 250 T 600 250 T 800 250" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.08" className="animate-[wave_8s_ease-in-out_infinite_1s]" />
          <path d="M0 300 Q 100 250, 200 300 T 400 300 T 600 300 T 800 300" stroke="#3B82F6" strokeWidth="1.5" fill="none" opacity="0.12" className="animate-[wave_8s_ease-in-out_infinite_2s]" />
        </svg>

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <LucideZap className="w-5 h-5 text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]" />
          <span className="text-[18px] font-bold text-white tracking-tight">ElectroGyaan</span>
          <span className="text-[12px] text-blue-400 align-super ml-[1px]">AI</span>
        </div>

        {/* Center: Illustration + Quote */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Abstract energy visualization */}
          <div className="w-[240px] h-[180px] relative mb-8">
            {/* Central hexagon with bolt */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rotate-0 flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <LucideZap className="w-8 h-8 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]" />
            </div>
            
            {/* Orbiting circles */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const radius = 90;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const colors = ['#3B82F6', '#FBBF24', '#10B981', '#3B82F6', '#FBBF24', '#10B981'];
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full animate-pulse-slow"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    backgroundColor: colors[i],
                    boxShadow: `0 0 12px ${colors[i]}40`,
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 w-[1px] h-[90px] bg-gradient-to-b from-gray-600/30 to-transparent" style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)`, transformOrigin: 'top' }}></div>
                </div>
              );
            })}
          </div>

          {/* Quote card */}
          <div className="w-[340px] bg-[rgba(17,24,39,0.7)] backdrop-blur-[10px] border border-subtle rounded-xl p-6">
            <p className="text-[16px] text-gray-300 italic leading-[26px]">
              "ElectroGyaan cut our electricity anomaly response time from 3 days to 3 minutes."
            </p>
            <div className="mt-4 flex items-center gap-[10px]">
              <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[14px] font-bold text-white">
                RK
              </div>
              <div className="flex-1 text-left">
                <div className="text-[14px] font-semibold text-white">Rajesh Kumar</div>
                <div className="text-[12px] text-gray-400">Secretary, Green Meadows Society, Delhi</div>
              </div>
            </div>
            <div className="mt-[10px] flex gap-[2px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-amber-400 text-[12px]">★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Feature bullets */}
        <div className="relative z-10 flex flex-col gap-3">
          {[
            "Real-time anomaly detection across all flats",
            "AI forecasting with 94%+ confidence",
            "Zero-downtime microservices architecture"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-[10px]">
              <LucideCheckCircle className="w-[14px] h-[14px] text-green-400 shrink-0" />
              <span className="text-[12px] text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - 720px */}
      <div className="w-full lg:w-[720px] flex justify-center items-center p-[64px] bg-[#0A0F1E]">
        <div className="w-[400px]">
          {/* TOP SECTION */}
          <h2 className="text-[30px] leading-[38px] font-semibold text-white">Welcome back</h2>
          <p className="text-[16px] text-gray-400 mt-2">Sign in to your society dashboard</p>

          {/* GOOGLE OAUTH BUTTON */}
          <button className="mt-8 w-full h-[44px] bg-level-2 border border-default rounded-md flex items-center justify-center gap-3 hover:bg-level-3 hover:border-strong transition-all">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.5818C15.3273 13.3 14.5636 14.3591 13.4182 15.0682V17.5773H16.7364C18.7091 15.7682 19.8 13.2318 19.8 10.2273Z" fill="#4285F4"/>
              <path d="M10.2 20C12.9 20 15.1727 19.1045 16.7364 17.5773L13.4182 15.0682C12.4636 15.6682 11.2545 16.0227 10.2 16.0227C7.59091 16.0227 5.37273 14.2 4.52727 11.8H1.11364V14.3909C2.66818 17.4909 6.20909 20 10.2 20Z" fill="#34A853"/>
              <path d="M4.52727 11.8C4.30909 11.2 4.18182 10.5545 4.18182 9.88636C4.18182 9.21818 4.30909 8.57273 4.52727 7.97273V5.38182H1.11364C0.418182 6.77273 0 8.28636 0 9.88636C0 11.4864 0.418182 13 1.11364 14.3909L4.52727 11.8Z" fill="#FBBC05"/>
              <path d="M10.2 3.75C11.3545 3.75 12.3818 4.13636 13.1909 4.90909L16.1364 1.96364C15.1682 1.06364 12.9 0 10.2 0C6.20909 0 2.66818 2.50909 1.11364 5.38182L4.52727 7.97273C5.37273 5.6 7.59091 3.75 10.2 3.75Z" fill="#EA4335"/>
            </svg>
            <span className="text-[14px] font-medium text-gray-200">Continue with Google</span>
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-gray-800"></div>
            <span className="text-[12px] text-gray-500 font-medium">or</span>
            <div className="flex-1 h-[1px] bg-gray-800"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-[14px]">
              {error}
            </div>
          )}

          {/* EMAIL FIELD */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[12px] text-gray-400 font-medium uppercase tracking-[0.08em] mb-[6px]">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <LucideMail className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@society.com"
                  className="w-full h-[44px] bg-level-1 border border-subtle rounded-md pl-[42px] pr-[14px] text-[16px] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="mb-4">
              <label className="block text-[12px] text-gray-400 font-medium uppercase tracking-[0.08em] mb-[6px]">
                PASSWORD
              </label>
              <div className="relative">
                <LucideLock className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[44px] bg-level-1 border border-subtle rounded-md pl-[42px] pr-[42px] text-[16px] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <LucideEye className="w-4 h-4" />
                  ) : (
                    <LucideEyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-[6px]">
                <div></div>
                <Link to="#" className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] hover:brightness-110 text-white text-[16px] font-semibold rounded-md mt-6 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* BOTTOM LINK */}
          <p className="mt-6 text-center text-[14px] text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Start free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
