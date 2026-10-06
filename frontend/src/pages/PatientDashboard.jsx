import { useAuth } from '../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome, {user.full_name}</h1>
      <p>Role: <strong>{user.role}</strong></p>
      <p>Email: {user.email}</p>
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
        <p>Your medical records will appear here (Milestone 4).</p>
      </div>
      <button onClick={handleLogout}>Log out</button>
    </main>
  );
}