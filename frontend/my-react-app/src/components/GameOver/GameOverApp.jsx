import StatusCard from "../common/StatusCard";
import ProgressCard from "../common/ProgressCard";

function GameOverApp() {
  return (
    <div className="game-over-container">
      <h1 className="game-over-title">GAME OVER</h1>

      <StatusCard
        containerClassName="death-message"
        thirdDescriptionClassname="death-cause"
        firstDescription="Your journey has come to an abrupt end in the depths of the Obsidian Canyon."
        secondDescription="The darkness consumed you, and your story ends here... for now."
        thirdDescription="Cause of Death: Overwhelmed by Shadow Creatures"
      />

      <div className="final-stats">
        <ProgressCard
          containerClassName="final-stat"
          labelClassName="final-stat-label"
          valueClassName="final-stat-value"
          label="Final Life"
          value="0"
        />
        <ProgressCard
          containerClassName="final-stat"
          labelClassName="final-stat-label"
          valueClassName="final-stat-value"
          label="Mana Used"
          value="120"
        />
        <ProgressCard
          containerClassName="final-stat"
          labelClassName="final-stat-label"
          valueClassName="final-stat-value"
          label="Enemies Slain"
          value="23"
        />
        <ProgressCard
          containerClassName="final-stat"
          labelClassName="final-stat-label"
          valueClassName="final-stat-value"
          label="Time Survived"
          value="47m"
        />
      </div>

      <div className="action-buttons">
        <a href="#" className="action-button btn-checkpoint">
          ↻ Restart from Checkpoint
        </a>
        <a href="#" className="action-button btn-restart">
          ⟲ Restart
        </a>
      </div>
    </div>
  );
}

export default GameOverApp;
