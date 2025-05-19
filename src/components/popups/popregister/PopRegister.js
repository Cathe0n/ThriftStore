import React, { useState } from "react";
import axios from "axios";
import "../popups.css";
import { useNavigate } from "react-router-dom";

function PopRegister({ isOpen, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
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

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/public", {
        query: `
          mutation Register($email: String!, $password: String!) {
            register(email: $email, password: $password) {
              email
              password
            }
          }
        `,
        variables: {
          email,
          password,
        },
      });

      const data = response.data;
      if (data?.data?.register) {
        onClose();
        navigate("/loggedin");
      } else {
        const errorMsg = data.errors?.[0]?.message || "Registration failed.";
        setError(errorMsg);
      }
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "REGISTER"}
        </button>

        <div className="switch-action" onClick={onSwitchToLogin}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
}

export default PopRegister;
