import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard/Dashboard';
import AnomalyLog from './pages/AnomalyLog/AnomalyLog';
import Apartments from './pages/Apartments/Apartments';
import ApartmentDetail from './pages/ApartmentDetail/ApartmentDetail';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';

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
        <Route path="/" element={<Landing />} />
        
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
        
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['admin', 'user']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/anomalies" element={
          <ProtectedRoute roles={['admin', 'user']}>
            <AnomalyLog />
          </ProtectedRoute>
        } />

        <Route path="/apartments" element={
          <ProtectedRoute roles={['admin', 'user']}>
            <Apartments />
          </ProtectedRoute>
        } />

        <Route path="/apartments/:id" element={
          <ProtectedRoute roles={['admin', 'user']}>
            <ApartmentDetail />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute roles={['admin', 'user']}>
            <Reports />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute roles={['admin', 'user']}>
            <Settings />
          </ProtectedRoute>
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

        <Route path="*" element={<Navigate to="/" replace />} />
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
