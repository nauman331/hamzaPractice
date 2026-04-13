import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import useSubmit from "../hooks/useSubmit";
import { clearSession, isAuthenticated } from "../utils/auth";

const Navbar = () => {
  const { submit } = useSubmit({ isAuth: true });
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleLogout = async () => {
    await submit("/logout", {}, { method: "POST" });
    clearSession();
    navigate("/login");
  };

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <NavLink className="brand" to="/home">
          Northstar
        </NavLink>

        <div className="nav-links">
          {loggedIn ? (
            <>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                Profile
              </NavLink>
              <button className="nav-link nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
