import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setError('');
      try {
        const response = await api.get('/api/v1/data/all');
        setUsers(response.data || []);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="page-shell">
      <div className="header-row">
        <h2>Dashboard</h2>
        <button className="logout-button" onClick={logout}>Logout</button>
      </div>
      <p className="help-text">Protected data is loaded from the API using your saved JWT token.</p>

      {loading && <div className="info-message">Loading users...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username || '-'}</td>
                    <td>{user.email || '-'}</td>
                    <td>{user.role || '-'}</td>
                    <td>{user.password || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
