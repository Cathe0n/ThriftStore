import React from "react";
import { useNavigate } from "react-router-dom";
import "./PopExit.css";

const PopExit = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleConfirmExit = () => {
    // Add your logout logic here
    console.log("User logged out");
    navigate("/women");
    onClose();
    // In a real app:
    // 1. Call logout API
    // 2. Clear auth tokens
    // 3. Update global state
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