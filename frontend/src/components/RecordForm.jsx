import { useState } from 'react';
import { api } from '../api/client.js';

export default function RecordForm({ patientId, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.createRecord({
        patient_id: patientId,
        title,
        description,
        record_date: recordDate,
      });
      setTitle('');
      setDescription('');
      setRecordDate('');
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
      background: '#f0f9ff',
    }}>
      <h4 style={{ marginTop: 0 }}>Add record</h4>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <input
        type="date"
        value={recordDate}
        onChange={(e) => setRecordDate(e.target.value)}
        required
        style={{ display: 'block', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save record'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
}