import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import ClinicianDashboard from './pages/ClinicianDashboard.jsx';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  return <Navigate to={user ? `/${user.role}` : '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/patient" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
            <Route path="/clinician" element={<ProtectedRoute role="clinician"><ClinicianDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}