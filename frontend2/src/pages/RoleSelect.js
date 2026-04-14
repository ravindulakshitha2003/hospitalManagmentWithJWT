import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const RoleSelect = () => {
  const { selectRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const roles = location.state?.roles || [];

  const handleSelectRole = (role) => {
    selectRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Hospital Management System</h1>
        <h2>Select Your Role</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          You have multiple roles. Please select one to continue.
        </p>
        <div className="role-selection">
          {roles && roles.length > 0 ? (
            roles.map((role) => (
              <button
                key={role}
                onClick={() => handleSelectRole(role)}
                className="role-button"
              >
                {role.replace('ROLE_', '')}
              </button>
            ))
          ) : (
            <p>No roles available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
