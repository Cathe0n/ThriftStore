import React, { useState } from "react";
import "./PopLogin.css";
import { useNavigate } from "react-router-dom";

function PopLogin({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "admin" && password === "admin") {
      setError("");
      onClose();
      navigate("/loggedin");
    } else {
      setError("Invalid email or password.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="poplogin-overlay">
      <div className="poplogin-modal">
        <button className="close-button" onClick={onClose}>×</button>

        <h1>LOGIN</h1>
        <p>Login with your email address</p>

        <label>Email</label>
        <input
          type="text"
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

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Remember me
          </label>

          <span className="forgot" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="login-button" onClick={handleLogin}>LOGIN</button>

        <div className="register-link" onClick={() => navigate("/register")}>
          Make an account
        </div>
      </div>
    </div>
  );
}

export default PopLogin;
