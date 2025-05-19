import React, { useState } from "react";
import "./Adminlogin-admin.css"; 

export const AdminLoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [employeeName, setEmployeeName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email && password) {
      setIsLoggedIn(true);
      setEmployeeName("Admin User");
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmployeeName("");
  };

  if (isLoggedIn) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Welcome to your Dashboard</h1>
          <p className="dashboard-subtitle">You are now logged in as {employeeName}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">LOGIN</h1>
          <p className="login-subtitle">
            Please input your credentials below, for further information you may contact the IT team.
          </p>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="remember-me-group">
            <input
              type="checkbox"
              id="remember"
              className="remember-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" className="remember-label">Remember me</label>
          </div>
          
          <button type="submit" className="Adminlogin-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};