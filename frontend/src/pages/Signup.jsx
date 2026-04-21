import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { LucideMail, LucideLock, LucideEye, LucideEyeOff, LucideCheckCircle, LucideZap, LucideUser, LucideBuilding2, LucideChevronDown } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    societyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    societySize: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signup(formData);
    } catch (err) {
      setError("Failed to create account: " + (err.response?.data?.message || err.message));
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
      setError("Google sign-up failed: " + (err.response?.data?.message || err.message));
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
      <div className="w-full lg:w-[720px] flex justify-center items-center p-[64px] bg-[#0A0F1E] overflow-y-auto">
        <div className="w-[400px] my-8">
          {/* TOP SECTION */}
          <h2 className="text-[30px] leading-[38px] font-semibold text-white">Create your account</h2>
          <p className="text-[16px] text-gray-400 mt-2">Start monitoring your society in 5 minutes</p>

          {/* GOOGLE OAUTH BUTTON */}
          <div className="mt-8">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-up failed")}
              useOneTap
              theme="filled_black"
              size="large"
              text="signup_with"
              shape="rectangular"
              logo_alignment="left"
              width="400"
            />
          </div>

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

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ROW 1: Full Name | Society Name */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[12px] text-gray-400 font-medium uppercase tracking-[0.08em] mb-[6px]">
                  FULL NAME
                </label>
                <div className="relative">
                  <LucideUser className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full h-[44px] bg-level-1 border border-subtle rounded-md pl-[42px] pr-[14px] text-[16px] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[12px] text-gray-400 font-medium uppercase tracking-[0.08em] mb-[6px]">
                  SOCIETY NAME
                </label>
                <div className="relative">
                  <LucideBuilding2 className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="societyName"
                    required
                    value={formData.societyName}
                    onChange={handleChange}
                    placeholder="Society name"
                    className="w-full h-[44px] bg-level-1 border border-subtle rounded-md pl-[42px] pr-[14px] text-[16px] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ROW 2: Email */}
            <div>
              <label className="block text-[12px] text-gray-400 font-medium uppercase tracking-[0.08em] mb-[6px]">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <LucideMail className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@society.com"
                  className="w-full h-[44px] bg-level-1 border border-subtle rounded-md pl-[42px] pr-[14px] text-[16px] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                />
              </div>
            </div>

            {/* ROW 3: Password | Confirm Password */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[12px] text-gray-400 font-medium uppercase tracking-[0.08em] mb-[6px]">
                  PASSWORD
                </label>
                <div className="relative">
                  <LucideLock className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-[44px] bg-level-1 border border-subtle rounded-md pl-[42px] pr-[42px] text-[16px] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[14px] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <LucideEye className="w-4 h-4" /> : <LucideEyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[12px] text-gray-400 font-medium uppercase tracking-[0.08em] mb-[6px]">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <LucideLock className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-[44px] bg-level-1 border border-subtle rounded-md pl-[42px] pr-[42px] text-[16px] text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-[14px] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <LucideEye className="w-4 h-4" /> : <LucideEyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* ROW 4: Society Size Dropdown */}
            <div>
              <label className="block text-[12px] text-gray-400 font-medium uppercase tracking-[0.08em] mb-[6px]">
                SOCIETY SIZE
              </label>
              <div className="relative">
                <LucideBuilding2 className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                <select
                  name="societySize"
                  required
                  value={formData.societySize}
                  onChange={handleChange}
                  className="w-full h-[44px] bg-level-1 border border-subtle rounded-md pl-[42px] pr-[42px] text-[16px] text-gray-100 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select society size</option>
                  <option value="<50">{"< 50 units"}</option>
                  <option value="50-100">50–100 units</option>
                  <option value="100-200">100–200 units</option>
                  <option value="200+">200+ units</option>
                </select>
                <LucideChevronDown className="absolute right-[14px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-[10px] mt-4">
              <div className="relative flex items-center justify-center mt-[2px]">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="peer w-[18px] h-[18px] appearance-none border border-default bg-level-1 rounded-[4px] cursor-pointer checked:bg-blue-600 checked:border-blue-600 transition-all"
                />
                <svg
                  className="absolute w-[12px] h-[12px] text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <label className="text-[12px] text-gray-400 cursor-pointer">
                I agree to the{" "}
                <Link to="#" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
                {" "}and{" "}
                <Link to="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
              </label>
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] hover:brightness-110 text-white text-[16px] font-semibold rounded-md mt-6 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          {/* BOTTOM LINK */}
          <p className="mt-6 text-center text-[14px] text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
