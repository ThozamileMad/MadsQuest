import HeaderDescription from "../common/HeaderDescription";
import StatusCard from "../common/StatusCard";
import ProgressCard from "../common/ProgressCard";
import { useNavigate, useLocation } from "react-router-dom";

function CheckpointApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    life = 0,
    mana = 0,
    morale = 0,
    coin = 0,
    sceneID = null,
  } = location.state || {};

  useEffect(() => {
    const handlePopState = (e) => {
      navigate("/play", { state: { sceneID: sceneID, userID: 1 } });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

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
        className={`continue-button ${!sceneID ? "btn-disabled" : ""}`}
        onClick={() => {
          navigate("/play", { state: { sceneID: sceneID, userID: 1 } });
        }}
        disabled={!sceneID ? true : false}
      >
        Continue Journey →
      </button>
    </div>
  );
}

export default CheckpointApp;
