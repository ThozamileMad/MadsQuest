/* React modules */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* Component modules */
import StatCard from "./StatCard";
import StoryText from "./StoryText";
import ChoiceButton from "./ChoiceButton";
import CheckpointPopup from "./CheckpointPopup";
import DeathPopup from "./DeathPopup";

/* API modules */
import { get } from "../../scripts/api";

function GamePlayApp() {
  const [paragraphs, setParagraphs] = useState([]);
  const [choiceData, setChoiceData] = useState(
    Array(4).fill({
      styles: { display: "none" },
      icon: "",
      text: "",
      nextSceneId: null,
    })
  );
  const [playerStats, setPlayerStats] = useState(Array(4).fill(0));
  const [choiceEffects, setChoiceEffects] = useState(Array(4).fill(0));
  const [playerStatus, setPlayerStatus] = useState("");
  const [checkpointClassName, setCheckpointClassName] = useState("hidden");
  const [deathClassName, setDeathClassName] = useState("hidden");
  const [popUpNextSceneId, setPopUpNextSceneId] = useState(null);

  const statsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { sceneId = 1, userId = 1, updateStats = true } = location.state || {};

  /**
   * Renders the available choices when the game is active.
   *
   * @param {Array} choices - List of choices for the current scene.
   */
  const renderActiveChoices = (choices) => {
    if (playerStatus === "dead") return;

    setChoiceData(() => {
      const baseChoices = Array(4).fill({
        styles: { display: "none" },
        icon: "",
        text: "",
        nextSceneId: null,
      });

      choices.forEach((choice, index) => {
        baseChoices[index] = {
          styles: { display: "flex" },
          icon: choice.icon,
          text: choice.text,
          nextSceneId: choice.nextSceneId,
        };
      });

      return baseChoices;
    });
  };

  /**
   * When the game is over, show a single "Continue" button
   * and hide all other choice slots.
   */
  const renderGameOverChoice = () => {
    if (playerStatus !== "dead") return;

    setChoiceData([
      {
        styles: { display: "flex" },
        icon: "💀",
        text: "Continue",
        nextSceneId: null,
      },
      ...Array(3).fill({
        styles: { display: "none" },
        icon: "",
        text: "",
        nextSceneId: null,
      }),
    ]);
  };

  /**
   * Sends API to updates user checkpoint in database
   *
   * @param {number} sceneId
   * @param {number} userId
   * @param {number} index - Choice button index
   */
  const applyCheckpoint = async (sceneId) => {
    const response = await get(`/api/checkpoint/${sceneId}/${userId}`);

    // Network error could be the client's internet
    if (!response) {
      console.error("Network error!");
      return false;
    }

    // Connected to server but process failed due to an error
    if (!response.data) {
      console.error("Server Error!");
      return false;
    }

    // Checks if checkpoint was successfully applied and returns result
    let { data: checkpointApplied } = response;
    checkpointApplied = checkpointApplied.includes("Checkpoint");

    return checkpointApplied;
  };

  /**
   * Updates UI state based on the newly loaded scene.
   * - Formats scene text into paragraphs
   * - Updates stats and choice effects
   * - Renders active choices or game-over UI
   * - Applies checkpoint logic to each choice
   *
   * @param {string} info - Raw narrative/scene content.
   * @param {Array<number>} effects - Choice effect modifiers for the scene.
   * @param {Array<number>} stats - Player stats returned from the server.
   * @param {Array<Object>} choices - List of available choices for this scene.
   * @param {boolean} isGameOver - Indicates whether the scene represents a terminal state.
   */

  const updateSceneUI = (info, effects, stats, choices) => {
    const formattedParagraphs = info
      .split("\\n\\n")
      .map((paragraph) => paragraph.replace(/\\/g, ""));

    // Render the scene information (story, stat and stat changes)
    setParagraphs(formattedParagraphs);
    setChoiceEffects(effects);
    setPlayerStats(stats);

    // Render the players options
    renderActiveChoices(choices);
    renderGameOverChoice();
  };

  /**
   * Fetches scene details and updates UI state.
   *
   * @param {number} sceneId
   * @param {number} userId
   */
  const fetchData = async (sceneId, userId, updateStats) => {
    statsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const response = await get(
      `/api/scene/${sceneId}/${userId}/${updateStats}`
    );

    // Network error could be the clients internet
    if (!response) {
      console.error("Network error!");
      return;
    }

    // Connected to server but process failed due to an error
    if (!response.data) {
      console.error("Server Error!");
      return;
    }

    // Sets the players current status (dead|checkpoint|active) and renders new scene
    const {
      sceneData,
      choiceEffectsData,
      playerStatsData,
      choiceData,
      status,
    } = response.data;

    setPlayerStatus(status);
    updateSceneUI(sceneData, choiceEffectsData, playerStatsData, choiceData);
  };

  const getCheckpointId = async () => {
    const response = await get(`/api/get_checkpoint/${userId}`);

    // Network error could be the client's internet
    if (!response) {
      console.error("Network error!");
      return false;
    }

    // Connected to server but process failed due to an error
    if (!response.data) {
      console.error("Server Error!");
      return false;
    }

    // Checks if checkpoint data was successfully retreived and returns result
    const { scene_id: checkpointId } = response.data[0];

    return checkpointId;
  };

  const onContinueAdventure = async () => {
    const checkpointApplied = await applyCheckpoint(popUpNextSceneId);
    if (!checkpointApplied) return;

    setCheckpointClassName("hidden");
    setTimeout(() => fetchData(popUpNextSceneId, userId, true));
  };

  const onReturnToCheckpoint = async () => {
    const checkpointId = await getCheckpointId();
    if (!checkpointId) return;

    setDeathClassName("hidden");
    setTimeout(() => fetchData(checkpointId, userId, true));
  };

  const onRestartGame = () => {
    setDeathClassName("hidden");
    setTimeout(() => fetchData(1, userId, true));
  };

  /**
   * Handles user interaction with a choice button.
   * Navigates to the correct route or loads the next scene depending on
   * the assigned `nextSceneId` of the selected choice.
   *
   * @param {Object} item - The choice object for the clicked button.
   * @param {number} item.nextSceneId - The ID or keyword that determines navigation.
   */
  const handleChoiceClick = (item) => {
    const { nextSceneId } = item;
    if (!nextSceneId) return;

    // Popup handling based on playerStatus keyword
    switch (playerStatus) {
      case "dead":
        setDeathClassName("");
        setPopUpNextSceneId(nextSceneId);
        break;

      case "checkpoint":
        setCheckpointClassName("");
        setPopUpNextSceneId(nextSceneId);
        break;

      default:
        // Normal scene transition
        fetchData(nextSceneId, userId, true);
        break;
    }
  };

  useEffect(() => {
    fetchData(sceneId, userId, updateStats);
  }, []);

  return (
    <div className="game-container">
      <div ref={statsRef} className="stats-bar">
        <StatCard
          icon="❤️"
          label="Life"
          value={playerStats[0]}
          change={choiceEffects[0]}
        />
        <StatCard
          icon="⚡"
          label="Mana"
          value={playerStats[1]}
          change={choiceEffects[1]}
        />
        <StatCard
          icon="⚖️"
          label="Morality"
          value={playerStats[2]}
          change={choiceEffects[2]}
        />
        <StatCard
          icon="💰"
          label="Gold"
          value={playerStats[3]}
          change={choiceEffects[3]}
        />
      </div>

      <div className="story-section">
        <img
          src="https://wallpaperaccess.com/full/10761557.jpg"
          alt="Story scene"
          className="story-image"
        />

        <StoryText paragraphs={paragraphs} />
      </div>

      <div className="choices-section">
        <div className="choices-title">What do you do?</div>
        <div className="choices-grid">
          {choiceData.map((item, index) => {
            return (
              <ChoiceButton
                key={index}
                onClick={() => handleChoiceClick(item)}
                styles={item.styles}
                icon={item.icon}
                text={item.text}
              />
            );
          })}
        </div>
      </div>

      <CheckpointPopup
        className={checkpointClassName}
        onContinueAdventure={onContinueAdventure}
      />

      <DeathPopup
        className={deathClassName}
        onReturnToCheckpoint={onReturnToCheckpoint}
        onRestartGame={onRestartGame}
      />
    </div>
  );
}

export default GamePlayApp;
