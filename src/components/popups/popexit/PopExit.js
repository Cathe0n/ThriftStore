// src/components/popups/popexit/PopExit.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./PopExit.css";

const PopExit = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleConfirmExit = () => {
    logout();
    navigate("/women");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popexit-overlay">
      <div className="popexit-modal">
        <button className="close-button" onClick={onClose}>×</button>

        <h1>EXIT</h1>
        <p>Are you sure you want to sign out?</p>

        <div className="exit-buttons">
          <button 
            className="exit-cancel-button" 
            onClick={onClose}
          >
            CANCEL
          </button>
          <button 
            className="exit-confirm-button" 
            onClick={handleConfirmExit}
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopExit;