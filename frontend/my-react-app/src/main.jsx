import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import HomeApp from "./components/Home/HomeApp";
import GamePlayApp from "./components/GamePlay/GamePlayApp";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GamePlayApp />
  </StrictMode>
);
