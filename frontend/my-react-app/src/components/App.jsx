import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeApp from "./Home/HomeApp";
import GamePlayApp from "./GamePlay/GamePlayApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeApp />} />
        <Route path="/game" element={<GamePlayApp />} />
      </Routes>
    </Router>
  );
}

export default App;
