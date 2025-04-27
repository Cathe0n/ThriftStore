import React, { useState } from "react";
import "../popups.css";
import { useNavigate } from "react-router-dom";

function PopRegister({ isOpen, onClose, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    // Basic validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    // Here you would typically call your registration API
    // For demo purposes, we'll just navigate to loggedin
    setError("");
    onClose();
    navigate("/loggedin");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-modal">
        <button className="close-button" onClick={onClose}>
          x
        </button>

        <h1>REGISTER</h1>
        <p>Create a new account</p>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            Show Password
          </label>
        </div>
        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            By making an account you are agreeing with the terms and conditions*
          </label>
        </div>
        {error && <p className="error">{error}</p>}

        <button className="action-button" onClick={handleRegister}>
          REGISTER
        </button>

        <div className="switch-action" onClick={onSwitchToLogin}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
}

export default PopRegister;
