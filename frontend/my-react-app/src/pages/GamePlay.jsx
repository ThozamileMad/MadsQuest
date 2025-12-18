/* React modules */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/* Component modules */
import StatCard from "../components/StatCard";
import StoryText from "../components/StoryText";
import ChoiceButton from "../components/ChoiceButton";
import CheckpointPopup from "../components/CheckpointPopup";
import DeathPopup from "../components/DeathPopup";
import ErrorPopup from "../components/ErrorPopup";
import GameNavBar from "../components/GameNavBar";

/* API modules */
import { get } from "../scripts/api";

/* CSS Stylesheet */
import "../styles/gameplay.css";

/**
 * GamePlayApp
 *
 * Main gameplay container responsible for:
 * - Fetching and rendering scene content
 * - Displaying player stats, choices, and narrative text
 * - Handling gameplay transitions (death, checkpoints, restarts)
 * - Coordinating all interactive UI states related to scenes
 */
function GamePlay() {
  /* -----------------------------
   * Component State
   * ----------------------------- */

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
  const [errorClassName, setErrorClassName] = useState("hidden");

  const [popUpNextSceneId, setPopUpNextSceneId] = useState(null);

  // btnDisabled[] indexes map to various UI buttons; see handleChoiceClick()
  const [btnDisabled, setBtnDisabled] = useState([
    ...Array(4).fill(false), // Choice buttons
    ...Array(4).fill(true), // Popup/action buttons
  ]);

  const [errorCode, setErrorCode] = useState("???");

  const statsRef = useRef(null);
  const location = useLocation();

  // Defaulting for direct-page-access scenarios
  const { sceneId = 1, userId = 1, updateStats = true } = location.state || {};

  /* -----------------------------
   * UI Rendering Helpers
   * ----------------------------- */

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
   * Renders the available choices for the active scene.
   * Ensures unused choice slots remain hidden but structurally stable.
   */
  const renderActiveChoices = (choices) => {
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

  /* -----------------------------
   * Backend Actions
   * ----------------------------- */

  /**
   * Applies a checkpoint for the current user.
   * Called when the player reaches a checkpoint scene.
   */
  const applyCheckpoint = async (sceneId) => {
    const response = await get(`/api/checkpoint/${sceneId}/${userId}`);

    if (!response) {
      showError(400);
      return false;
    }

    if (!response.data) {
      showError(response.status);
      return false;
    }

    return response.data.includes("Checkpoint");
  };

  /**
   * Updates all major UI states for a loaded scene:
   * - Story paragraphs
   * - Player stats
   * - Choice effects
   * - Visible choices
   */
  const updateSceneUI = (info, effects, stats, choices) => {
    const formattedParagraphs = info
      .split("\\n\\n")
      .map((p) => p.replace(/\\/g, ""));

    setParagraphs(formattedParagraphs);
    setChoiceEffects(effects);
    setPlayerStats(stats);
    renderActiveChoices(choices);
  };

  /**
   * Fetches full scene data from the server and applies
   * all necessary UI updates.
   */
  const fetchData = async (sceneId, userId, updateStats) => {
    const response = await get(
      `/api/scene/${sceneId}/${userId}/${updateStats}`
    );

    if (!response) {
      showError(400);
      return false;
    }

    if (!response.data) {
      showError(response.status);
      return false;
    }

    const {
      sceneData,
      choiceEffectsData,
      playerStatsData,
      choiceData,
      status,
    } = response.data;

    setPlayerStatus(status);
    updateSceneUI(sceneData, choiceEffectsData, playerStatsData, choiceData);

    // Keep stats visible when transitioning scenes
    statsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /**
   * Retrieves the user’s last checkpoint.
   * Used when the player dies and chooses to continue.
   */
  const returnToCheckpoint = async () => {
    const response = await get(`/api/return_to_checkpoint/${userId}`);

    if (!response) {
      showError(400);
      return false;
    }

    if (!response.data) {
      showError(response.status);
      return false;
    }

    return response.data[0]?.scene_id;
  };

  /**
   * Resets the user’s stats and restarts the game from scene 1.
   */
  const restartGame = async () => {
    const response = await get(`/api/restart_game/${userId}`);

    if (!response) {
      showError(400);
      return false;
    }

    if (!response.data) {
      showError(response.status);
      return false;
    }

    return response.data.includes("updated");
  };

  /* -----------------------------
   * UI State Helpers
   * ----------------------------- */

  /**
   * Enables/disables UI button slots by index.
   * Maintains predictable control mapping for popups.
   */
  const toggleButtonDisabled = (index, isDisabled) => {
    setBtnDisabled((prev) => {
      const updated = [...prev];
      updated[index] = isDisabled;
      return updated;
    });
  };

  /* -----------------------------
   * Popup Handlers
   * ----------------------------- */

  /**
   * Hides the "Checkpoint Reached" popup.
   */
  const hideCheckpointPopup = () => {
    toggleButtonDisabled(4, true);
    setCheckpointClassName("hidden");
  };

  /**
   * Hides the "Game Over" popup.
   */
  const hideGameOverPopup = () => {
    toggleButtonDisabled(5, true);
    toggleButtonDisabled(6, true);
    setDeathClassName("hidden");
  };

  /**
   * Handler for continuing after a checkpoint popup.
   */
  const onContinueAdventure = async () => {
    const checkpointApplied = await applyCheckpoint(popUpNextSceneId);
    if (!checkpointApplied) return;

    hideCheckpointPopup();
    setTimeout(() => fetchData(popUpNextSceneId, userId, true));
  };

  /**
   * Handler for returning to the last checkpoint after death.
   */
  const onReturnToCheckpoint = async () => {
    const checkpointId = await returnToCheckpoint();
    if (!checkpointId) return;

    hideGameOverPopup();
    setTimeout(() => fetchData(checkpointId, userId, false));
  };

  /**
   * Handler for restarting the game after death.
   */
  const onRestartGame = async () => {
    const statsUpdated = await restartGame();
    if (!statsUpdated) return;

    hideGameOverPopup();
    setTimeout(() => fetchData(1, userId, true));
  };

  /* -----------------------------
   * Choice Handling
   * ----------------------------- */

  /**
   * Primary handler for user interactions with choice buttons.
   * Routing logic is based on the player's current status:
   * - Dead → show death popup
   * - Checkpoint → show checkpoint popup
   * - Active → load next scene normally
   */
  const handleChoiceClick = (item) => {
    const { nextSceneId } = item;
    if (!nextSceneId) return;

    switch (playerStatus) {
      case "dead":
        setBtnDisabled((prev) => {
          const updated = [...prev];
          updated[5] = false; // return to checkpoint
          updated[6] = false; // restart
          return updated;
        });

        setDeathClassName("");
        setPopUpNextSceneId(nextSceneId);
        break;

      case "checkpoint":
        setBtnDisabled((prev) => {
          const updated = [...prev];
          updated[4] = false;
          return updated;
        });

        setCheckpointClassName("");
        setPopUpNextSceneId(nextSceneId);
        break;

      default:
        fetchData(nextSceneId, userId, true);
        break;
    }
  };

  /* -----------------------------
   * Error Handling
   * ----------------------------- */

  const showError = (errorCode) => {
    setErrorClassName("");
    setErrorCode(errorCode);

    setBtnDisabled((prev) => {
      const updated = [...prev];
      updated[7] = false;
      return updated;
    });
  };

  const hideError = () => {
    hideCheckpointPopup();
    hideGameOverPopup();

    setErrorClassName("hidden");
    setErrorCode("???");

    setBtnDisabled((prev) => {
      const updated = [...prev];
      updated[7] = true;
      return updated;
    });
  };

  /* -----------------------------
   * Lifecycle
   * ----------------------------- */

  useEffect(() => {
    fetchData(sceneId, userId, updateStats);
    if (sceneId === 1) {
      onRestartGame();
    }
  }, []);

  /* -----------------------------
   * Render
   * ----------------------------- */

  return (
    <div className="game-container">
      {/* Navigation Bar */}
      <GameNavBar />

      {/* Player Stats Bar */}
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

      {/* Story Content */}
      <div className="story-section">
        <img
          src="https://wallpaperaccess.com/full/10761557.jpg"
          alt="Story scene"
          className="story-image"
        />
        <StoryText paragraphs={paragraphs} />
      </div>

      {/* Choices */}
      <div className="choices-section">
        <div className="choices-title">What do you do?</div>

        <div className="choices-grid">
          {choiceData.map((item, index) => (
            <ChoiceButton
              key={index}
              onClick={() => handleChoiceClick(item)}
              styles={item.styles}
              icon={item.icon}
              text={item.text}
              disabled={btnDisabled[index]}
            />
          ))}
        </div>
      </div>

      {/* Popups */}
      <CheckpointPopup
        className={checkpointClassName}
        onContinueAdventure={onContinueAdventure}
        disabled={btnDisabled[4]}
      />

      <DeathPopup
        className={deathClassName}
        onReturnToCheckpoint={onReturnToCheckpoint}
        onRestartGame={onRestartGame}
        returnToCheckpointDisabled={btnDisabled[5]}
        restartGameDisabled={btnDisabled[6]}
      />

      <ErrorPopup
        className={errorClassName}
        errorCode={errorCode}
        onAcknowledge={hideError}
        disabled={btnDisabled[7]}
      />
    </div>
  );
}

export default GamePlay;
