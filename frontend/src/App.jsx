import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './pages/Dashboard/Dashboard';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import AnomalyLog from './pages/AnomalyLog/AnomalyLog';
import Apartments from './pages/Apartments/Apartments';
import ApartmentDetail from './pages/ApartmentDetail/ApartmentDetail';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';

// Temporary simpler routing for mockup phase
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/anomalies" element={<AnomalyLog />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/apartments/a112" element={<ApartmentDetail />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "temp_client_id";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
