// src/pages/dashboard/LoginDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginDashboard = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate login success (replace with real auth logic later)
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Login to Access Dashboard</h2>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default LoginDashboard;
