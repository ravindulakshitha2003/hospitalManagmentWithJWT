import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-box">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="actions">
          <button onClick={() => navigate("/")} className="btn-primary">
            Go Home
          </button>

          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
        </div>

        <p className="note">
          🏥 MediCare Hospital Management System
        </p>
      </div>
    </div>
  );
};

export default NotFound;