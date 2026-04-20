import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen bg-neutral-900 text-white flex items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  
  if (roles && !roles.includes(user.role)) {
    // Redirect based on role if they try unauthorized access
    return user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

// Public Route Component - redirects logged in users back to dashboard
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen bg-neutral-900 text-white flex items-center justify-center">Loading...</div>;
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/user/dashboard" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/signup" element={
           <PublicRoute>
             <Signup />
           </PublicRoute>
        } />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/user/dashboard" element={
          <ProtectedRoute roles={['user', 'admin']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
