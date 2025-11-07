import HeaderDescription from "../common/HeaderDescription";
import StatusCard from "../common/StatusCard";
import ProgressCard from "../common/ProgressCard";

function CheckpointApp() {
  return (
    <div className="checkpoint-container">
      <div className="checkpoint-icon">💾</div>

      <HeaderDescription
        title="CHECKPOINT"
        description="Progress Saved"
        headerClassName="checkpoint-title"
        descriptionClassName="checkpoint-subtitle"
      />

      <StatusCard
        containerClassName="checkpoint-message"
        thirdDescriptionClassname="checkpoint-location"
        firstDescription="Your journey has been preserved in the fabric of time itself."
        secondDescription="Should darkness claim you, you may return to this moment and continue your quest."
        thirdDescription="📍 The Obsidian Canyon Waypoint"
      />

      <div className="progress-stats">
        <ProgressCard
          containerClassName="progress-stat"
          labelClassName="progress-stat-label"
          valueClassName="progress-stat-value"
          label="Current Life"
          value="85"
        />
        <ProgressCard
          containerClassName="progress-stat"
          labelClassName="progress-stat-label"
          valueClassName="progress-stat-value"
          label="Mana"
          value="120"
        />
        <ProgressCard
          containerClassName="progress-stat"
          labelClassName="progress-stat-label"
          valueClassName="progress-stat-value"
          label="Completed"
          value="35%"
        />
        <ProgressCard
          containerClassName="progress-stat"
          labelClassName="progress-stat-label"
          valueClassName="progress-stat-value"
          label="Achievements"
          value="12"
        />
      </div>

      <a href="#" className="continue-button">
        Continue Journey →
      </a>
    </div>
  );
}

export default CheckpointApp;
