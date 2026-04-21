import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setLoading(true);
      console.log('Google credential received:', credentialResponse);
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || "Google sign-in failed. Please use email/password login or configure Google OAuth in Google Cloud Console.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in failed. Please use email/password login instead.");
  };

  return (
    <div className="min-h-screen w-full flex bg-level-0">
      {/* Left Pane: Marketing Wrapper */}
      <div className="hidden lg:flex w-[60%] flex-col justify-center items-center relative overflow-hidden bg-level-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-level-0 z-0"></div>
        {/* Abstract floating mesh-like shapes */}
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[20%] w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] animate-ping-slow"></div>
        
        <div className="relative z-10 text-center px-12">
          <h1 className="text-display-xl text-white mb-6 tracking-tight">ElectroGyaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI</span></h1>
          <p className="text-text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Real-time smart energy analytics SaaS platform. Monitor consumption, detect anomalies, and track carbon emissions effortlessly.
          </p>
        </div>
      </div>

      {/* Right Pane: Auth Form */}
      <div className="w-full lg:w-[40%] flex justify-center items-center p-8 z-10 relative">
        <div className="w-full max-w-[420px] bg-level-1/50 backdrop-blur-xl p-8 rounded-2xl border border-subtle shadow-card-mockup">
          <h2 className="text-display-sm text-white mb-2">Welcome Back</h2>
          <p className="text-text-sm text-gray-400 mb-8">Please enter your details to sign in.</p>
          
          {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-text-sm text-gray-300 font-medium">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[48px] bg-level-2 border border-subtle rounded-md px-4 text-white text-text-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-text-sm text-gray-300 font-medium">Password</label>
                <a href="#" className="text-text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[48px] bg-level-2 border border-subtle rounded-md px-4 text-white text-text-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="........"
              />
            </div>

            <button disabled={loading} type="submit" className="w-full btn-primary mt-2">
              {loading ? "Signing in..." : "Sign In"}
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
                onError={handleGoogleError}
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="continue_with"
                useOneTap={false}
             />
          </div>

          <p className="mt-8 text-center text-text-sm text-gray-400">
            Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
