import HeaderDescription from "../common/HeaderDescription";
import StatusCard from "../common/StatusCard";
import ProgressCard from "../common/ProgressCard";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function CheckpointApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    life = 0,
    mana = 0,
    morale = 0,
    coin = 0,
    sceneId = null,
  } = location.state || {};

  /**
   * Redirect if the checkpoint has already been displayed
   */
  useEffect(() => {
    const checkpointDisplayed =
      localStorage.getItem("checkpointDisplayed") === "true";

    if (checkpointDisplayed) {
      navigate("/play", {
        state: { sceneId: sceneId, userId: 1, updateStats: false },
      });
    }
  }, []);

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
          value={life}
        />
        <ProgressCard
          containerClassName="progress-stat"
          labelClassName="progress-stat-label"
          valueClassName="progress-stat-value"
          label="Mana Used"
          value={mana}
        />
        <ProgressCard
          containerClassName="progress-stat"
          labelClassName="progress-stat-label"
          valueClassName="progress-stat-value"
          label="Current Morale"
          value={morale}
        />
        <ProgressCard
          containerClassName="progress-stat"
          labelClassName="progress-stat-label"
          valueClassName="progress-stat-value"
          label="Coin Earned"
          value={coin}
        />
      </div>

      <button
        type="type"
        className={`continue-button`}
        onClick={() => {
          localStorage.setItem("checkpointDisplayed", true);
          navigate("/play", {
            state: { sceneId: sceneId, userId: 1, updateStats: true },
          });
        }}
      >
        Continue Journey →
      </button>
    </div>
  );
}

export default CheckpointApp;
