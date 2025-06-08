// src/components/popups/poplogin/PopLogin.js
import React, { useState, useEffect } from "react";
import "./PopLogin.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../graphql/mutations";
import { useAuth } from "../../../context/AuthContext";

function PopLogin({ isOpen, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");

  useEffect(() => {
    if (isOpen) {
      setRedirectAfterLogin(location.pathname + location.search);
    }
  }, [isOpen, location]);

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const token = data?.login?.token;
      if (token) {
        login(token);
        onClose();
        navigate(redirectAfterLogin);
      } else {
        setError("Login failed. No token received.");
      }
    },
    onError: (err) => {
      setError(err.message || "Login failed.");
    }
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    loginMutation({ variables: { email, password } });
  };

  if (!isOpen) return null;

  return (
    <div className="poplogin-overlay">
      <div className="poplogin-modal">
        <button className="close-button" onClick={onClose}>x</button>

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

        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "LOGIN"}
        </button>

        <div className="register-link" onClick={onSwitchToRegister}>
          Make an account
        </div>
      </div>
    </div>
  );
}

export default PopLogin;
