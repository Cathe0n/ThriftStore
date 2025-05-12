import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Vero.png";
import PopExit from "../popups/popexit/PopExit";

function HeaderLoggedIn() {
  const [isExitOpen, setExitOpen] = useState(false);

  const openExit = () => {
    setExitOpen(true);
  };

  const closeExit = () => {
    setExitOpen(false);
  };

  return (
    <>
      <header className="vero-header">
        <div className="header-left">
          <NavLink
            to="/loggedin/women"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            WOMEN
          </NavLink>
          <NavLink
            to="/loggedin/men"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            MEN
          </NavLink>
          <NavLink
            to="/loggedin/kids"
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
          <button 
            className="nav-link exit-button"
            onClick={openExit}
          >
            EXIT
          </button>
        </div>
      </header>

      <PopExit isOpen={isExitOpen} onClose={closeExit} />
    </>
  );
}

export default HeaderLoggedIn;