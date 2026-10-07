export default function RecordCard({ record }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 6,
      padding: '1rem',
      marginBottom: '1rem',
      background: '#fafafa',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{record.title}</h3>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>
          {new Date(record.record_date).toLocaleDateString()}
        </span>
      </div>
      {record.description && (
        <p style={{ marginTop: '0.5rem', color: '#444' }}>{record.description}</p>
      )}
      {record.clinician_name && (
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 0 }}>
          By Dr. {record.clinician_name}
        </p>
      )}
    </div>
  );
}