import HeaderDescription from "../common/HeaderDescription";
import StatusCard from "../common/StatusCard";
import ProgressCard from "../common/ProgressCard";
import { get, post } from "../../scripts/api";
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
   *
   * @returns
   */
  const continueBtnOnClick = async () => {
    const response = await post("/api/checkpoint/true");

    // Network error could be the clients internet
    if (!response) {
      console.error("Network error!");
      return;
    }

    navigate("/play", {
      state: { sceneId: sceneId, userId: 1, updateStats: true },
    });
  };

  /**
   * Redirect if the checkpoint has already been displayed
   *
   * @returns
   */
  const checkpointProtected = async () => {
    const response = await get("/api/checkpoint/protected");

    // Network error could be the clients internet
    if (!response) {
      console.error("Network error!");
      return;
    }

    // Verify if checkpoint was displayed, if true redirect to new scene otherwise render pages
    console.log(response.data !== undefined, response.data, response);
    if (response.data !== "") return;

    navigate("/play", {
      state: { sceneId: sceneId, userId: 1, updateStats: false },
    });
  };

  useEffect(() => {
    checkpointProtected();
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
        onClick={async () => await continueBtnOnClick()}
      >
        Continue Journey →
      </button>
    </div>
  );
}

export default CheckpointApp;
