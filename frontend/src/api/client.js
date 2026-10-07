const API_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  signup: (body) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login:  (body) => request('/api/auth/login',  { method: 'POST', body: JSON.stringify(body) }),
  me:     ()     => request('/api/me'),

  // records
  listRecords:   (patientId) => request(`/api/records${patientId ? `?patient_id=${patientId}` : ''}`),
  createRecord:  (body)      => request('/api/records',     { method: 'POST',   body: JSON.stringify(body) }),
  updateRecord:  (id, body)  => request(`/api/records/${id}`,   { method: 'PUT',    body: JSON.stringify(body) }),
  deleteRecord:  (id)        => request(`/api/records/${id}`,   { method: 'DELETE' }),

  // appointments
  listAppointments:   ()     => request('/api/appointments'),
  createAppointment:  (body) => request('/api/appointments',           { method: 'POST', body: JSON.stringify(body) }),
  confirmAppointment: (id)   => request(`/api/appointments/${id}/confirm`, { method: 'PUT' }),
  cancelAppointment:  (id)   => request(`/api/appointments/${id}/cancel`,  { method: 'PUT' }),
  completeAppointment:(id)   => request(`/api/appointments/${id}/complete`,{ method: 'PUT' }),

  // patients / clinicians
  listPatients:    ()   => request('/api/patients'),
  getPatient:      (id) => request(`/api/patients/${id}`),
  listClinicians:  ()   => request('/api/patients/clinicians'),
};