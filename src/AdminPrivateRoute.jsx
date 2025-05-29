// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);
    const currentTime = Date.now() / 1000; // in seconds
    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}

function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/adminloginpage" replace />;
  }

  return children;
}

export default AdminPrivateRoute;
