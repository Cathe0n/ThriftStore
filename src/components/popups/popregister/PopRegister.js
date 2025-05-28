import React, { useState, useContext } from "react";
import "../popups.css";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../../graphql/mutations";
import { useAuth } from '../../../context/AuthContext';

function PopRegister({ isOpen, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      const token = data?.register?.token; // Assuming your registration also returns a token
      if (token) {
        login(token); // Automatically log in after registration
        onClose();
        navigate("/women");
      } else {
        setError("Registration successful but login failed.");
      }
    },
    onError: (err) => {
      setError(err.message || "Registration failed.");
    }
  });

  const handleRegister = () => {
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    register({ variables: { email, password } });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h1>REGISTER</h1>
        <p>Create a new account</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
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

        <button
          className="action-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "REGISTER"}
        </button>

        <div className="switch-action" onClick={onSwitchToLogin}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
}

export default PopRegister;