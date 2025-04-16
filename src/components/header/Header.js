import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Vero.png";
import PopLogin from "../popups/poplogin/PopLogin"; // ⬅️ import your new PopLogin component

function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false);

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
          {/* Replaced the NavLink with a button to open login modal */}
          <button className="nav-link login-button" onClick={() => setLoginOpen(true)}>
            LOG IN
          </button>
        </div>
      </header>

      {/* PopLogin Modal Component */}
      <PopLogin isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default Header;
