import { StrictMode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import HomeApp from "./components/Home/HomeApp";
import GamePlayApp from "./components/GamePlay/GamePlayApp";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/play" element={<GamePlayApp />} />
      <Route path="/" element={<HomeApp />} />
    </Routes>
  </Router>
);
