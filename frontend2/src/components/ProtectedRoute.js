import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, selectedRole, loading } = useAuth();
  console.log(isAuthenticated);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && selectedRole !== requiredRole) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Required role: {requiredRole}</p>
        <p>Your role: {selectedRole}</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
