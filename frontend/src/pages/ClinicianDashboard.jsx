import { useAuth } from '../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function ClinicianDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome, Dr. {user.full_name}</h1>
      <p>Role: <strong>{user.role}</strong></p>
      <p>Email: {user.email}</p>
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
        <p>Patient records and uploads will appear here (Milestone 4).</p>
      </div>
      <button onClick={handleLogout}>Log out</button>
    </main>
  );
}