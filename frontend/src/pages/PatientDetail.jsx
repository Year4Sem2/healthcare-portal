import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import RecordCard from '../components/RecordCard.jsx';
import RecordForm from '../components/RecordForm.jsx';
import AppointmentCard from '../components/AppointmentCard.jsx';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    Promise.all([
      api.getPatient(id),
      api.listRecords(id),
      api.listAppointments(),
    ])
      .then(([p, r, a]) => {
        setPatient(p);
        setRecords(r);
        setAppointments(a.filter(x => x.patient_id === id));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!patient) return <div style={{ padding: '2rem' }}>Patient not found.</div>;

  return (
    <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <Link to="/clinician">← Back to dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>{patient.full_name}</h1>
      <p style={{ color: '#666' }}>{patient.email}</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>📋 Records</h2>
        <RecordForm patientId={id} onCreated={refresh} />
        {records.length === 0
          ? <p>No records yet.</p>
          : records.map(r => <RecordCard key={r.id} record={r} />)}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>📅 Appointments</h2>
        {appointments.length === 0
          ? <p>No appointments.</p>
          : appointments.map(a => <AppointmentCard key={a.id} appointment={a} onUpdate={refresh} />)}
      </section>
    </main>
  );
}