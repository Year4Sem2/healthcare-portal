import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function AppointmentForm({ onCreated }) {
  const [clinicians, setClinicians] = useState([]);
  const [clinicianId, setClinicianId] = useState('');
  const [appointmentAt, setAppointmentAt] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.listClinicians().then(setClinicians).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.createAppointment({
        clinician_id: clinicianId,
        appointment_at: new Date(appointmentAt).toISOString(),
        reason,
      });
      setClinicianId('');
      setAppointmentAt('');
      setReason('');
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      border: '1px solid #ddd',
      borderRadius: 6,
      padding: '1rem',
      marginBottom: '1rem',
      background: '#f0fdf4',
    }}>
      <h4 style={{ marginTop: 0 }}>Book appointment</h4>

      <select
        value={clinicianId}
        onChange={(e) => setClinicianId(e.target.value)}
        required
        style={{ display: 'block', padding: '0.5rem', marginBottom: '0.5rem' }}
      >
        <option value="">Select clinician...</option>
        {clinicians.map(c => (
          <option key={c.id} value={c.id}>Dr. {c.full_name}</option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={appointmentAt}
        onChange={(e) => setAppointmentAt(e.target.value)}
        required
        style={{ display: 'block', padding: '0.5rem', marginBottom: '0.5rem' }}
      />

      <input
        placeholder="Reason (optional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Booking...' : 'Request appointment'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
}