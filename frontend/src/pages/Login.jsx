import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'clinician' ? '/clinician' : '/patient');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem' }}>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Log in</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>No account? <a href="/signup">Sign up</a></p>
    </main>
  );
}