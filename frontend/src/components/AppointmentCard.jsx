import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { useState } from 'react';

const STATUS_COLORS = {
  requested: '#f59e0b',
  confirmed: '#10b981',
  completed: '#3b82f6',
  cancelled: '#ef4444',
};

export default function AppointmentCard({ appointment, onUpdate }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const action = async (fn) => {
    setBusy(true);
    try {
      await fn();
      onUpdate?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 6,
      padding: '1rem',
      marginBottom: '0.75rem',
      background: '#fff',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{new Date(appointment.appointment_at).toLocaleString()}</strong>
        <span style={{
          background: STATUS_COLORS[appointment.status],
          color: 'white',
          padding: '0.15rem 0.6rem',
          borderRadius: 12,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
        }}>
          {appointment.status}
        </span>
      </div>

      {appointment.reason && <p style={{ marginTop: '0.5rem' }}>{appointment.reason}</p>}

      {user.role === 'clinician' && appointment.patient_name && (
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Patient: {appointment.patient_name}
        </p>
      )}
      {user.role === 'patient' && appointment.clinician_name && (
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Clinician: Dr. {appointment.clinician_name}
        </p>
      )}

      {user.role === 'clinician' && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
          {appointment.status === 'requested' && (
            <button onClick={() => action(() => api.confirmAppointment(appointment.id))} disabled={busy}>
              Confirm
            </button>
          )}
          {appointment.status === 'confirmed' && (
            <button onClick={() => action(() => api.completeAppointment(appointment.id))} disabled={busy}>
              Mark Completed
            </button>
          )}
          {['requested', 'confirmed'].includes(appointment.status) && (
            <button onClick={() => action(() => api.cancelAppointment(appointment.id))} disabled={busy}>
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}