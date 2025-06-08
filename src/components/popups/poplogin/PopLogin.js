import React, { useState, useEffect } from "react";
import "./PopLogin.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../graphql/mutations";
import { useAuth } from "../../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PopLogin({ isOpen, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

        {/* Autofill prevention */}
        <input type="text" name="fake-username" style={{ display: "none" }} />
        <input type="password" name="fake-password" style={{ display: "none" }} />

        <label>Email</label>
        <input
          type="text"
          name="login-email"
          placeholder="Enter your email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="login-password"
            placeholder="Enter your password"
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "LOGIN"}
        </button>

        <p className="register-info">
          Don’t have an account?{" "}
          <span className="register-link" onClick={onSwitchToRegister}>
            Make one here
          </span>
        </p>
      </div>
    </div>
  );
}

export default PopLogin;
