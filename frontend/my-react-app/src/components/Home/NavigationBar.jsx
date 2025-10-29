import React from "react";
import { NavLink } from "react-router-dom";

function NavigationBar() {
  return (
    <header>
      <div className="logo">Nexus Chronicles</div>
      <nav>
        <a href="/about" className="nav-link">
          ABOUT
        </a>
        <a href="/features" className="nav-link">
          FEATURES
        </a>
        <a href="/contact" className="nav-link">
          CONTACT
        </a>
      </nav>
    </header>
  );
}

export default NavigationBar;
