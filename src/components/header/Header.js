// src/components/header/Header.js
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PopLogin from "../popups/poplogin/PopLogin";
import PopRegister from "../popups/popregister/PopRegister";
import PopExit from "../popups/popexit/PopExit";
import "./Header.css";
import logo from "../../assets/Vero.png";
import { FaUserCircle } from "react-icons/fa";

function Header() {
  const { user, logout } = useAuth();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isExitOpen, setExitOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/women");
    setExitOpen(false);
    setDropdownOpen(false);
  };

  const isActiveLink = (path) => location.pathname === path && user;

  return (
    <>
      <header className="vero-header">
        <div className="header-left">
          <NavLink to="/women" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>WOMEN</NavLink>
          <NavLink to="/men" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>MEN</NavLink>
          <NavLink to="/kids" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>KIDS</NavLink>
        </div>

        <div className="header-center">
          <img src={logo} alt="VERO Logo" className="logo" />
        </div>

        <div className="header-right">
          <NavLink to="/wishlist" className={() => isActiveLink("/wishlist") ? "nav-link active-link" : "nav-link"}>WISHLIST</NavLink>
          <NavLink to="/bag" className={() => isActiveLink("/bag") ? "nav-link active-link" : "nav-link"}>SHOPPING BAG</NavLink>

          <div className="user-menu-container">
            <button className="user-icon-button" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              <FaUserCircle className={`user-icon ${user ? "user-logged-in" : "user-logged-out"}`} />
            </button>
            {isDropdownOpen && (
              <div className="user-dropdown">
                <button className="dropdown-item" onClick={() => { navigate("/userTransaction"); setDropdownOpen(false); }}>
                  History
                </button>
                {user ? (
                  <button className="dropdown-item" onClick={() => setExitOpen(true)}>Log Out</button>
                ) : (
                  <button className="dropdown-item" onClick={openLogin}>Log In</button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <PopLogin
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />

      <PopRegister
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />

      <PopExit
        isOpen={isExitOpen}
        onClose={() => setExitOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default Header;
