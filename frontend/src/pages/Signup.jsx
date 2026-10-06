import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await signup({ email, password, full_name: fullName, role });
      navigate(user.role === 'clinician' ? '/clinician' : '/patient');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem' }}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 8)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="clinician">Clinician</option>
        </select>
        <button type="submit">Create account</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>Have an account? <a href="/login">Log in</a></p>
    </main>
  );
}