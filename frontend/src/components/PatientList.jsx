import { Link } from 'react-router-dom';

export default function PatientList({ patients }) {
  if (patients.length === 0) return <p>No patients yet.</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {patients.map(p => (
        <li key={p.id} style={{
          border: '1px solid #ddd',
          borderRadius: 6,
          padding: '0.75rem 1rem',
          marginBottom: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>
            <strong>{p.full_name}</strong><br />
            <small style={{ color: '#666' }}>{p.email}</small>
          </span>
          <Link to={`/clinician/patient/${p.id}`}>View →</Link>
        </li>
      ))}
    </ul>
  );
}