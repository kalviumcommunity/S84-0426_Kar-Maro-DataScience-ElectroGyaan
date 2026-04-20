import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { LucideZap, LucideMail, LucideLock, LucideArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@greenmeadows.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);
    try {
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Google login failed');
      }
    } catch (err) {
      setError('Google login encountered an error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-gray-100 flex font-inter relative overflow-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0A0F1E]/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNikiLz48L3N2Zz4=')] opacity-50 z-0"></div>

      {/* LEFT SIDE: Login Form */}
      <div className="w-full lg:w-[480px] bg-level-1/80 backdrop-blur-xl border-r border-subtle z-10 flex flex-col justify-center px-12 xl:px-16 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-[80px]">
          <div className="w-[40px] h-[40px] bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_24px_rgba(59,130,246,0.3)] border border-blue-400">
            <LucideZap className="w-[20px] h-[20px] text-white" />
          </div>
          <span className="text-[20px] font-bold tracking-tight text-white">ElectroGyaan <span className="text-blue-400 font-mono text-[12px] ml-1 bg-blue-900/40 px-2 py-0.5 rounded-full border border-blue-500/30">AI</span></span>
        </div>

        {/* HEADER */}
        <div>
          <h1 className="text-[32px] font-bold text-white mb-2 leading-tight">Welcome back</h1>
          <p className="text-[14px] text-gray-400 font-medium">Sign in to the Admin Dashboard for Green Meadows.</p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-[13px] font-medium">
            {error}
          </div>
        )}

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="relative">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Email Address</label>
            <div className="relative flex items-center">
              <LucideMail className="w-5 h-5 text-gray-500 absolute left-4 z-10" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@greenmeadows.com" 
                className="w-full h-[48px] bg-level-2 border border-subtle rounded-xl pl-12 pr-4 text-[14px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="relative">
             <div className="flex justify-between items-center pl-1 mb-2">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest block">Password</label>
                <a href="#" className="text-[12px] text-blue-400 hover:text-blue-300 font-semibold transition-colors">Forgot password?</a>
             </div>
            <div className="relative flex items-center">
              <LucideLock className="w-5 h-5 text-gray-500 absolute left-4 z-10" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full h-[48px] bg-level-2 border border-subtle rounded-xl pl-12 pr-4 text-[14px] text-white font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 w-full h-[48px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(59,130,246,0.4)] transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
            {!isLoading && <LucideArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* OR DIVIDER & GOOGLE LOGIN */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center w-full gap-4 mb-6">
            <div className="h-[1px] bg-subtle flex-1"></div>
            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">OR</span>
            <div className="h-[1px] bg-subtle flex-1"></div>
          </div>
          
          <div className="w-full flex justify-center [&>div]:w-full [&>div>div]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text="continue_with"
              width="100%"
            />
          </div>
        </div>

        <div className="mt-[60px] pt-6 border-t border-subtle text-[12px] text-gray-500 font-medium">
          Protected by <span className="text-gray-300">Phase.Zero Security API</span> · v2.4.1
        </div>
      </div>

      {/* RIGHT SIDE: Art/Marketing */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative z-10 p-12">
        <div className="max-w-[500px] text-center">
          <div className="mb-8 relative w-[320px] h-[320px] mx-auto opacity-80">
            {/* Abstract geometric AI shape using pure CSS/divs */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
            <div className="relative w-full h-full border border-subtle rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
               <div className="w-[80%] h-[80%] border border-blue-500/30 rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]"></div>
               <div className="absolute w-[60%] h-[60%] border-t-2 border-r-2 border-blue-400 rounded-full animate-[spin_20s_linear_infinite]"></div>
               <LucideZap className="absolute w-[40px] h-[40px] text-blue-400 rotate-12" />
            </div>
          </div>
          <h2 className="text-[28px] font-bold text-white mb-4">Precision load monitoring.</h2>
          <p className="text-[16px] text-gray-400 leading-relaxed">
            Real-time transformer analytics and predictive neural networks to prevent unbalanced phases before they trigger an outage.
          </p>
        </div>
      </div>

    </div>
  );
}
