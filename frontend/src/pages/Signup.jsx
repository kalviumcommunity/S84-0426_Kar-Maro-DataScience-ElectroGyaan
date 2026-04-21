import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [username, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signup(username, email, password, role);
      // Wait for auth to process, it should redirect normally
    } catch (err) {
      setError("Failed to create an account: " + (err.response?.data?.message || err.message));
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
      {/* Left Pane: Marketing Wrapper */}
      <div className="hidden lg:flex w-[60%] flex-col justify-center items-center relative overflow-hidden bg-level-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-level-0 z-0"></div>
        {/* Abstract floating mesh-like shapes */}
        <div className="absolute top-[30%] right-[30%] w-96 h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[30%] left-[20%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-shimmer"></div>
        
        <div className="relative z-10 text-center px-12">
          <h1 className="text-display-xl text-white mb-6 tracking-tight">Join ElectroGyaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">AI</span></h1>
          <p className="text-text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Take control of your apartment's energy future. Register today and unlock real-time intelligent insights and reporting.
          </p>
        </div>
      </div>

      {/* Right Pane: Auth Form */}
      <div className="w-full lg:w-[40%] flex justify-center items-center p-8 z-10 relative">
        <div className="w-full max-w-[420px] bg-level-1/50 backdrop-blur-xl p-8 rounded-2xl border border-subtle shadow-card-mockup">
          <h2 className="text-display-sm text-white mb-2">Create Account</h2>
          <p className="text-text-sm text-gray-400 mb-8">Fill in your details to get started.</p>
          
          {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-text-sm text-gray-300 font-medium">Full Name</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setname(e.target.value)}
                className="w-full h-[48px] bg-level-2 border border-subtle rounded-md px-4 text-white text-text-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-text-sm text-gray-300 font-medium">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[48px] bg-level-2 border border-subtle rounded-md px-4 text-white text-text-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-text-sm text-gray-300 font-medium">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[48px] bg-level-2 border border-subtle rounded-md px-4 text-white text-text-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1.5 pb-2">
              <label className="text-text-sm text-gray-300 font-medium">Account Type</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-[48px] bg-level-2 border border-subtle rounded-md px-4 text-white text-text-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              >
                <option value="user">Resident (User)</option>
                <option value="admin">Building Admin</option>
              </select>
            </div>

            <button disabled={loading} type="submit" className="w-full btn-primary bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-1 h-px bg-subtle"></div>
            <span className="px-4 text-text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-subtle"></div>
          </div>

          <div className="mt-6 flex justify-center">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-in was unsuccessful.")}
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="signup_with"
                width="100%"
             />
          </div>

          <p className="mt-8 text-center text-text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
