/* React Modules */
import { StrictMode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { createRoot } from "react-dom/client";

/* CSS Stylesheet */
import "./styles/index.css";

/* Component Modules */
import Home from "./pages/Home";
import GamePlay from "./pages/GamePlay";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/play" element={<GamePlay />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);
