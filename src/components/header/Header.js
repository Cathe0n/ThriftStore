import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Vero.png";
import PopLogin from "../popups/poplogin/PopLogin";
import PopRegister from "../popups/popregister/PopRegister"; 

function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

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
            to="/wishlist"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            WISHLIST
          </NavLink>
          <NavLink
            to="/bag"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            SHOPPING BAG
          </NavLink>
          <button className="nav-link login-button" onClick={() => setLoginOpen(true)}>
            LOG IN
          </button>
        </div>
      </header>

      {/* PopLogin Modal Component */}
      <PopLogin 
        isOpen={isLoginOpen} 
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />
      
      {/* PopRegister Modal Component */}
      <PopRegister
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}

export default Header;