import React, { useState } from "react";
import axios from "axios";
import "./PopLogin.css";
import { useNavigate } from "react-router-dom";

function PopLogin({ isOpen, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/public", {
        query: `
          mutation login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              token
            }
          }
        `,
        variables: {
          email,
          password,
        },
      });

      const data = response.data;

      if (data?.data?.login?.token) {
        localStorage.setItem("token", data.data.login.token); // Save the token
        onClose();
        navigate("/loggedin");
      } else {
        const errorMsg = data.errors?.[0]?.message || "Login failed.";
        setError(errorMsg);
      }
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
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

        <button className="login-button" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "LOGIN"}
        </button>

        <div className="register-link" onClick={onSwitchToRegister}>
          Make an account
        </div>
      </div>
    </div>
  );
}

export default PopLogin;
