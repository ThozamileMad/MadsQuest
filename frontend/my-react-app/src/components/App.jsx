import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeApp from "./Home/HomeApp";
import GamePlayApp from "./GamePlay/GamePlayApp";
import CheckpointApp from "./Checkpoint/CheckpointApp";
import GameOverApp from "./GameOver/GameOverApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeApp />} />
        <Route path="/game" element={<GamePlayApp />} />
        <Route path="/checkpoint" element={<CheckpointApp />} />
        <Route path="/gameover" element={<GameOverApp />} />
      </Routes>
    </Router>
  );
}

export default App;
