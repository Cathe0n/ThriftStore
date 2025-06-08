// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
