import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Vero.png";

function Header() {
  return (
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
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          LOG IN
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
