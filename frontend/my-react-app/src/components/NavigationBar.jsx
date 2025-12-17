import React from "react";
import { NavLink } from "react-router-dom";

function NavigationBar() {
  return (
    <header>
      <div className="logo">Nexus Chronicles</div>
      <nav>
        <NavLink to="/about" className="nav-link">
          ABOUT
        </NavLink>
        <NavLink to="/features" className="nav-link">
          FEATURES
        </NavLink>
        <NavLink to="/contact" className="nav-link">
          CONTACT
        </NavLink>
      </nav>
    </header>
  );
}

export default NavigationBar;
