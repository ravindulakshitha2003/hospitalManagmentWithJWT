import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelect from './pages/RoleSelect';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import CreateAppointment from './pages/CreateAppointment';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from './pages/NotFound';
import MedicalReport from './pages/MedicalReport';
import DoctorDashboard from './pages/DoctorDashboard';

// Dashboard router component to handle role-based routing
const Dashboard = () => {
  const { selectedRole } = useAuth();

  if (selectedRole === 'ROLE_ADMIN') {
    return <Navigate to="/admin-dashboard" replace />;
  } else {
    return <Navigate to="/user-dashboard" replace />;
  }
};

function AppRoutes() {
  return (
    <Routes>
       
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Role selection */}
      <Route
        path="/role-select"
        element={
          <ProtectedRoute>
            <RoleSelect />
          </ProtectedRoute>
        }
      />
      <Route path="/CreateAppointment" element={
        
        <ProtectedRoute>
           <CreateAppointment />
          </ProtectedRoute>
        } />
        
        
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <UserDashboard/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_STAFF">
            <DoctorDashboard/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MedicalReport"
        element={
          <ProtectedRoute >
            <MedicalReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/NotFound"
        element={
          <NotFound></NotFound>
        }
      />
      

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/NotFound" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="bottom-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
