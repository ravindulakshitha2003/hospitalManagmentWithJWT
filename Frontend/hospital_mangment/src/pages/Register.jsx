import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    mobile: '',
    role: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      const response = await api.post('/api/v1/auth/register', form);
      if (response.status === 200 || response.status === 201) {
        setMessage('Registration successful. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 800);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(serverMessage || 'Unable to register.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <h2>Register</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Mobile
          <input name="mobile" value={form.mobile} onChange={handleChange} required />
        </label>
        <label>
          Role
          <input name="role" value={form.role} onChange={handleChange} required placeholder="doctor, nurse, admin" />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Registering…' : 'Register'}
        </button>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
      <p className="page-footer">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}

export default Register;
