// src/components/header/DashboardHeader.js
import React from "react";
import { useNavigate } from "react-router-dom";
// import "./DashboardHeader.css"; 

function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add actual logout logic when backend is ready
    console.log("Logging out...");
    navigate("/login-dashboard"); // Redirect to login after logout
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <h2>Admin Dashboard</h2>
        <button 
          className="dashboard-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;