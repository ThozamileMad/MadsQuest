import StatusCard from "../common/StatusCard";
import ProgressCard from "../common/ProgressCard";
import { useNavigate, useLocation } from "react-router-dom";

function GameOverApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { life = 0, mana = 0, morale = 0, coin = 0 } = location.state || {};

  return (
    <div className="game-over-container">
      <h1 className="game-over-title">GAME OVER</h1>

      <StatusCard
        containerClassName="death-message"
        thirdDescriptionClassname="death-cause"
        firstDescription="Well… that didn’t go as planned, did it?"
        secondDescription="Your grand adventure ends here — not with glory, but with a spectacular display of questionable decision-making."
        thirdDescription="Maybe next time, try not doing whatever that was."
      />

      <div className="final-stats">
        <ProgressCard
          containerClassName="final-stat"
          labelClassName="final-stat-label"
          valueClassName="final-stat-value"
          label="Final Life"
          value={life}
        />
        <ProgressCard
          containerClassName="final-stat"
          labelClassName="final-stat-label"
          valueClassName="final-stat-value"
          label="Mana Used"
          value={mana}
        />
        <ProgressCard
          containerClassName="final-stat"
          labelClassName="final-stat-label"
          valueClassName="final-stat-value"
          label="Final Morale"
          value={morale}
        />
        <ProgressCard
          containerClassName="final-stat"
          labelClassName="final-stat-label"
          valueClassName="final-stat-value"
          label="Coin Earned"
          value={coin}
        />
      </div>

      <div className="action-buttons">
        <a href="#" className="action-button btn-checkpoint">
          ↻ Restart from Checkpoint
        </a>
        <button
          type="button"
          className="action-button btn-restart"
          onClick={() =>
            navigate("/play", { state: { sceneID: 1, userID: 1 } })
          }
        >
          ⟲ Restart
        </button>
      </div>
    </div>
  );
}

export default GameOverApp;
