import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import RecordCard from '../components/RecordCard.jsx';
import AppointmentCard from '../components/AppointmentCard.jsx';
import AppointmentForm from '../components/AppointmentForm.jsx';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/'); // ???
  };

  const refresh = () => {
    Promise.all([api.listRecords(), api.listAppointments()])
      .then(([r, a]) => {
        setRecords(r);
        setAppointments(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Welcome, {user.full_name}</h1>
      <p>Role: <strong>{user.role}</strong></p>
      <p>Email: {user.email}</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>📋 My Medical Records</h2>
        {records.length === 0
          ? <p>No records yet.</p>
          : records.map(r => <RecordCard key={r.id} record={r} />)}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>📅 Book an Appointment</h2>
        <AppointmentForm onCreated={refresh} />
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>📅 My Appointments</h2>
        {appointments.length === 0
          ? <p>No appointments yet.</p>
          : appointments.map(a => (
              <AppointmentCard key={a.id} appointment={a} onUpdate={refresh} />
            ))}
      </section>

      <button onClick={handleLogout} style={{ marginTop: '2rem' }}>Log out</button>
    </main>
  );
  
}