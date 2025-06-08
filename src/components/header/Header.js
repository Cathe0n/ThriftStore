// src/components/header/Header.js
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PopLogin from "../popups/poplogin/PopLogin";
import PopRegister from "../popups/popregister/PopRegister";
import PopExit from "../popups/popexit/PopExit";
import "./Header.css";
import logo from "../../assets/Vero.png";

function Header() {
  const { user, logout } = useAuth();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isExitOpen, setExitOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/women");
    setExitOpen(false);
  };

  const isActiveLink = (path) => location.pathname === path && user;

  return (
    <>
      <header className="vero-header">
        <div className="header-left">
          <NavLink
            to="/women"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            WOMEN
          </NavLink>
          <NavLink
            to="/men"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            MEN
          </NavLink>
          <NavLink
            to="/kids"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            KIDS
          </NavLink>
        </div>

        <div className="header-center">
          <img src={logo} alt="VERO Logo" className="logo" />
        </div>

        <div className="header-right">
          <NavLink
            to="/userTransaction"
            className={() =>
              isActiveLink("/userTransaction") ? "nav-link active-link" : "nav-link"
            }
          >
            TRANSACTION
          </NavLink>
          <NavLink
            to="/wishlist"
            className={() =>
              isActiveLink("/wishlist") ? "nav-link active-link" : "nav-link"
            }
          >
            WISHLIST
          </NavLink>
          <NavLink
            to="/bag"
            className={() =>
              isActiveLink("/bag") ? "nav-link active-link" : "nav-link"
            }
          >
            SHOPPING BAG
          </NavLink>
          {user ? (
            <button className="nav-link exit-button" onClick={() => setExitOpen(true)}>
              EXIT
            </button>
          ) : (
            <button className="nav-link login-button" onClick={() => setLoginOpen(true)}>
              LOG IN
            </button>
          )}
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
