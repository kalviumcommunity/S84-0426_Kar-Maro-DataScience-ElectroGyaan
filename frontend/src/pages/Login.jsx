import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.success) {
      const userRes = res.data;
      if (userRes && userRes.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const res = await googleLogin(credentialResponse.credential);
    if (res.success) {
      const userRes = res.data;
      if (userRes && userRes.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-900 justify-center items-center font-sans">
      <div className="bg-neutral-800 p-8 rounded-xl border border-neutral-700 w-full max-w-md">
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">ElectroGyaan Login</h2>
        
        {error && <div className="bg-rose-500/20 text-rose-400 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 text-white outline-none focus:border-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 text-white outline-none focus:border-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded transition-colors"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center space-y-4">
          <span className="text-neutral-500 text-sm">-- OR --</span>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError('Google Login Failed');
            }}
          />
        </div>

        <p className="text-neutral-400 text-sm text-center mt-6">
          Don't have an account? <Link to="/signup" className="text-emerald-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;