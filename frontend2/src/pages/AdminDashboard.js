import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const { user, selectedRole, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newRoleUsername, setNewRoleUsername] = useState('');
  const [newRole, setNewRole] = useState('ROLE_USER');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.getAllUsers();
      setUsers(response.users || response || []);
    } catch (err) {
      setError(err.error || err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!newRoleUsername || !newRole) {
      setError('Please enter username and select a role');
      return;
    }

    try {
      await authService.addRoleToUser(newRoleUsername, newRole);
      setSuccessMessage(`Role ${newRole} added to user ${newRoleUsername}`);
      setNewRoleUsername('');
      setNewRole('ROLE_USER');
      fetchAllUsers(); // Refresh user list
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.error || err.message || 'Failed to add role');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Hospital Management System - Admin</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>

        <div className="admin-section">
          <h3>Welcome, {user?.username}!</h3>
          <p className="role-badge">Role: {selectedRole?.replace('ROLE_', '')}</p>
        </div>

        {/* Add Role Section */}
        <div className="dashboard-card">
          <h3>Add Role to User</h3>
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <form onSubmit={handleAddRole} className="add-role-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={newRoleUsername}
                onChange={(e) => setNewRoleUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Select Role</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="ROLE_USER">User</option>
                <option value="ROLE_STAFF">Staff</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">
              Add Role
            </button>
          </form>
        </div>

        {/* Users List Section */}
        <div className="dashboard-card">
          <h3>All Users</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : users.length > 0 ? (
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.username || u.id}>
                      <td>{u.username}</td>
                      <td>{u.email || 'N/A'}</td>
                      <td>{u.mobile || 'N/A'}</td>
                      <td>
                        <div className="roles-list">
                          {u.roles && Array.isArray(u.roles) ? (
                            u.roles.map((role) => (
                              <span key={role} className="role-tag">
                                {role.replace('ROLE_', '')}
                              </span>
                            ))
                          ) : (
                            <span>No roles</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
