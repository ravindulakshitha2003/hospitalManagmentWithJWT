import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const UserDashboard = () => {
  const { user, selectedRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Hospital Management System</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <h2>User Dashboard</h2>

        <div className="dashboard-card">
          <h3>Welcome, {user?.username}!</h3>

          <div className="info-section">
            <h4>Your Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Username:</label>
                <p>{user?.username}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{user?.email || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Mobile:</label>
                <p>{user?.mobile || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Current Role:</label>
                <p className="role-badge">{selectedRole?.replace('ROLE_', '')}</p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Available Roles</h4>
            <div className="roles-list">
              {user?.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <span key={role} className="role-tag">
                    {role.replace('ROLE_', '')}
                  </span>
                ))
              ) : (
                <p>No roles assigned</p>
              )}
            </div>
          </div>

          <div className="info-section">
            <h4>Quick Stats</h4>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">0</div>
                <div className="stat-label">Appointments</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">0</div>
                <div className="stat-label">Prescriptions</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">0</div>
                <div className="stat-label">Medical Records</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
