import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/api/v1/auth/login', credentials);
      const data = response.data;
      const token = data.token;
      if (token) {
        localStorage.setItem('token', token);
        setMessage('Login successful. Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(data.error || data.message || 'Login failed.');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(serverMessage || 'Unable to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <h2>Login</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Username
          <input name="username" value={credentials.username} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={credentials.password} onChange={handleChange} required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
      <p className="page-footer">
        New here? <Link to="/register">Create an account</Link>.
      </p>
    </div>
  );
}

export default Login;
