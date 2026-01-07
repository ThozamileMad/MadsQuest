/* React modules */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/* Component modules */
import StatCard from "../components/StatCard";
import StoryText from "../components/StoryText";
import ChoiceButton from "../components/ChoiceButton";
import Popup from "../components/Popup";
import GameNavBar from "../components/GameNavBar";
import GameNavModal from "../components/GameNavModal";
import BoostModal from "../components/BoostModal";
import AchievementsModal from "../components/AchievementsModal";
import AchievementPopup from "../components/AchievementPopup";

/* API modules */
import { post, get } from "../scripts/api";

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
      sceneId: null,
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
  const [navModalClassName, setNavModalClassName] = useState("hidden");
  const [boostModalClassName, setBoostModalClassName] = useState("hidden");
  const [achievementsModalClassName, setAchievementsModalClassName] =
    useState("hidden");
  const [infoClassName, setInfoClassName] = useState("hidden");
  const [achievementPopupClassName, setAchievementPopupClassName] =
    useState("hide");

  const [popUpNextSceneId, setPopUpNextSceneId] = useState(null);

  const [boostLabel, setBoostLabel] = useState("Life");
  const [boostIcon, setBoostIcon] = useState("fa-heart");
  const [boostValue, setBoostValue] = useState(0);
  const [boostAmount, setBoostAmount] = useState(0);

  const [achievementModalData, setAchievementModalData] = useState([]);

  const [achievementPopupClassname, setAchievementPopupClassname] =
    useState("");
  const [achievementPopupIcon, setAchievementPopupIcon] = useState("");
  const [achievementPopupTitle, setAchievementPopupTitle] = useState("");
  const [achievementPopupDescription, setAchievementPopupDescription] =
    useState("");
  const [achievementPopupLuck, setAchievementPopupLuck] = useState(0);

  const [luck, setLuck] = useState(12);

  // btnDisabled{} key/value map to various UI buttons; see handleChoiceClick()
  const [btnDisabled, setBtnDisabled] = useState({
    choice1: false,
    choice2: false,
    choice3: false,
    choice4: false,

    checkpointContinuePopup: true,
    returnToCheckpointPopup: true,
    restartPopup: true,
    errorPopup: false,
    infoPopup: false,

    lastChoiceModal: true,
    returnToCheckpointModal: true,
    restartModal: true,
  });

  const [infoTitle, setInfoTitle] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [errorCode, setErrorCode] = useState("???");

  const statsRef = useRef(null);
  const location = useLocation();

  // Defaulting for direct-page-access scenarios
  const { sceneId = 1, userId = 1, updateStats = true } = location.state || {};

  /* -----------------------------
   * UI Rendering Helpers
   * ----------------------------- */

  /**
   * Renders the available choices for the active scene.
   * Ensures unused choice slots remain hidden but structurally stable.
   */
  const renderActiveChoices = (choices) => {
    setChoiceData(() => {
      const baseChoices = Array(4).fill({
        sceneId: null,
        styles: { display: "none" },
        icon: "",
        text: "",
        nextSceneId: null,
      });

      choices.forEach((choice, index) => {
        baseChoices[index] = {
          sceneId: choice.sceneId,
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
    const response = await post(`/api/checkpoint/${sceneId}/${userId}`);

    if (!response) {
      showError(400);
      return false;
    }

    if (!response.data) {
      showError(response.status);
      return false;
    }
    const { data } = response;
    const recordHandled = data.includes("updated") || data.includes("inserted");

    return recordHandled;
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
    showAchievementPopup(sceneId);

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
  const getPreviousSceneId = async (table) => {
    const response = await get(`/api/return_to_previous/${table}/${userId}`);
    console.log("response: ", response);
    if (!response) {
      showInfo(
        "No previous saves",
        "You need to reach a save point in order to use this feature."
      );
      return false;
    }

    if (!response.data) {
      showInfo(
        "No previous saves",
        "You need to reach a save point in order to use this feature."
      );
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
   * Enables/disables UI button slots by key.
   * Maintains predictable control mapping for popups.
   */
  const toggleButtonDisabled = (key, isDisabled) => {
    setBtnDisabled((prev) => {
      const updated = { ...prev };
      updated[key] = isDisabled;
      return updated;
    });
  };

  /* -----------------------------
   * Popup/Modal Handlers
   * ----------------------------- */

  /**
   * Hides popups.
   */
  const hidePopup = (btnDisabledKey, stateFunc) => {
    toggleButtonDisabled(btnDisabledKey, true);
    stateFunc("hidden");
  };

  /**
   * Handler for continuing after a checkpoint popup.
   */
  const onContinueAdventure = async () => {
    const checkpointApplied = await applyCheckpoint(popUpNextSceneId);
    if (!checkpointApplied) return;

    hidePopup("checkpointContinuePopup", setCheckpointClassName);
    setTimeout(() => fetchData(popUpNextSceneId, userId, true));
  };

  /**
   * Handler for returning to the last checkpoint after death.
   */
  const onReturnToPreviousScene = async (table) => {
    const id = await getPreviousSceneId(table);
    if (!id) return;

    hidePopup("returnToCheckpointPopup", setDeathClassName);
    hidePopup("restartPopup", setDeathClassName);

    toggleNavModalPopup(true, "hidden");
    setTimeout(() => fetchData(id, userId, true));
  };

  /**
   * Handler for restarting the game after death.
   */
  const onRestartGame = async () => {
    const statsUpdated = await restartGame();
    if (!statsUpdated) return;

    hidePopup("returnToCheckpointPopup", setDeathClassName);
    hidePopup("restartPopup", setDeathClassName);

    toggleNavModalPopup(true, "hidden");
    setTimeout(() => fetchData(1, userId, true));
  };

  /**
   * Handler for opening checkpoint popup
   */
  const openDeathPopup = (nextSceneId) => {
    toggleButtonDisabled("returnToCheckpointPopup", false);
    toggleButtonDisabled("restartPopup", false);

    setDeathClassName("");
    setPopUpNextSceneId(nextSceneId);
  };

  /**
   * Handler for opening checkpoint popup
   */
  const openCheckpointPopup = (nextSceneId) => {
    toggleButtonDisabled("checkpointContinuePopup", false);

    setCheckpointClassName("");
    setPopUpNextSceneId(nextSceneId);
  };

  /**
   * Handler for opening/close game navigation modal
   */
  const toggleNavModalPopup = (btnState, modalClassName) => {
    toggleButtonDisabled("lastChoiceModal", btnState);
    toggleButtonDisabled("returnToCheckpointModal", btnState);
    toggleButtonDisabled("restartModal", btnState);

    setNavModalClassName(modalClassName);
  };

  /* -----------------------------
   * Choice Handling
   * ----------------------------- */

  /**
   * Loads the next scene
   */
  const renderNextScene = async (btnText, nextSceneId, currentScene) => {
    if (btnText === "Continue") {
      fetchData(nextSceneId, userId, true);
      return;
    }

    const response = await post(`/api/last_choice/${currentScene}/${userId}`);

    if (!response) {
      showError(400);
      return;
    }

    if (!response.data) {
      showError(response.status);
      return;
    }

    const { data } = response;
    const recordHandled = data.includes("updated") || data.includes("created");

    if (!recordHandled) {
      showError(response.status);
      return;
    }

    fetchData(nextSceneId, userId, true);
  };

  /**
   * Primary handler for user interactions with choice buttons.
   * Routing logic is based on the player's current status:
   * - Dead → show death popup
   * - Checkpoint → show checkpoint popup
   * - Active → load next scene normally
   */
  const handleChoiceClick = (item) => {
    const { sceneId, nextSceneId, text } = item;

    switch (playerStatus) {
      case "dead":
        openDeathPopup(nextSceneId);
        break;

      case "checkpoint":
        openCheckpointPopup(nextSceneId);
        break;

      default:
        renderNextScene(text, nextSceneId, sceneId);
        break;
    }
  };

  /* -----------------------------
   * Error Handling
   * ----------------------------- */

  const showError = (errorCode) => {
    setErrorClassName("");
    setErrorCode(errorCode);

    toggleButtonDisabled("errorPopup", false);
  };

  const hideError = () => {
    // Hide checkpoint popup
    hidePopup("checkpointContinuePopup", setCheckpointClassName);

    // Hide death popup
    hidePopup("returnToCheckpointPopup", setDeathClassName);
    hidePopup("restartPopup", setDeathClassName);

    setErrorClassName("hidden");
    setErrorCode("???");

    toggleButtonDisabled("errorPopup", true);
  };

  /* -----------------------------
   * Information Display Handling
   * ----------------------------- */

  const showInfo = (title, msg) => {
    setInfoClassName("");
    setInfoTitle(title);
    setInfoMessage(msg);

    toggleButtonDisabled("infoPopup", false);
  };

  const hideInfo = () => {
    hidePopup("infoPopup", setInfoClassName);
  };

  /* -----------------------------
   * Boost Stats Funcs
   * ----------------------------- */
  const getLuck = async () => {
    const response = await get(`/api/get_luck/${userId}`);

    if (response.status !== 200) {
      showError(response.status);
      return;
    }

    const luck = response.data[0].luck;
    setLuck(luck);
  };

  const openBoostModal = () => {
    setBoostModalClassName("active");
    setBoostAmount(0);
    setBoostIcon("fa-heart");
    setBoostValue(playerStats[0]);
    setBoostLabel("Life");
    getLuck();
  };

  const handleBoostSelectorChange = (stat) => {
    const config = {
      life: { label: "Life", icon: "fa-heart", value: playerStats[0] },
      mana: { label: "Mana", icon: "fa-magic", value: playerStats[1] },
    };

    setBoostLabel(config[stat].label);
    setBoostIcon(config[stat].icon);
    setBoostValue(config[stat].value);
    setBoostAmount(0);
  };

  const handleBoostOnConfirm = async () => {
    const stat = boostLabel.toLowerCase();

    const response = await post(
      `/api/boost_stats/${userId}/${boostAmount}/${stat}`
    );

    if (response.status !== 200) {
      showError(response.status);
      return;
    }

    const { luck, life, mana } = response.data[0];

    setLuck(luck);
    setPlayerStats((prev) => {
      let updatedStats = [...prev];
      updatedStats[0] = life;
      updatedStats[1] = mana;

      return updatedStats;
    });
    setChoiceEffects((prev) => {
      let updatedEffects = [...prev];
      updatedEffects[0] = stat === "life" ? boostAmount : updatedEffects[0];
      updatedEffects[1] = stat === "mana" ? boostAmount : updatedEffects[1];

      return updatedEffects;
    });
    setBoostValue((prev) => prev + boostAmount);
    setBoostAmount(0);
  };

  /* -----------------------------
   * Achievement Modal
   * ----------------------------- */

  const openAchievements = async () => {
    const response = await get(`/api/get_achievements/${userId}`);

    if (response.status !== 200) {
      showError(response.status);
      return;
    }

    setAchievementModalData(response.data);
    setAchievementsModalClassName("active");
  };

  /* -----------------------------
   * Achievement Popup
   * ----------------------------- */

  const showAchievementPopup = async (sceneId) => {
    const response = await post(`/api/unlock_achievement/${userId}/${sceneId}`);

    if (response.status !== 200) {
      return;
    }

    const { icon, title, subtitle, luck } = response.data[0];

    console.log(response.data[0]);
    setAchievementPopupClassname("show");
    setAchievementPopupIcon(icon);
    setAchievementPopupTitle(title);
    setAchievementPopupDescription(subtitle);
    setAchievementPopupLuck(luck);

    setTimeout(() => setAchievementPopupClassname("hide2"), 5000);
  };

  const achievementPopupOnClose = () => {
    setAchievementPopupClassname("hide2");
  };

  /* -----------------------------
   * Lifecycle
   * ----------------------------- */

  useEffect(() => {
    fetchData(sceneId, userId, updateStats);

    /*if (sceneId === 1) {
      onRestartGame();
    }*/
  }, []);

  /* -----------------------------
   * Render
   * ----------------------------- */

  return (
    <div className="game-container">
      {/* Navigation Bar */}
      <GameNavBar
        openNavigation={() => toggleNavModalPopup(false, "active")}
        openBoostStats={openBoostModal}
        openAchievements={openAchievements}
      />

      {/* Navigation Bar Modals */}
      <GameNavModal
        modalClassName={navModalClassName}
        closeModal={() => toggleNavModalPopup(true, "hidden")}
        redoLastChoice={() => onReturnToPreviousScene("last_choice")}
        goToCheckpoint={() => onReturnToPreviousScene("checkpoints")}
        restartChapter={onRestartGame}
        lastChoiceDisabled={btnDisabled.lastChoiceModal}
        returnToCheckpointDisabled={btnDisabled.returnToCheckpointModal}
        restartGameDisabled={btnDisabled.restartModal}
      />

      <BoostModal
        closeModal={() => {
          setBoostModalClassName("hidden");
        }}
        onStatChange={handleBoostSelectorChange}
        onConfirm={handleBoostOnConfirm}
        modalClassName={boostModalClassName}
        statOptions={["Life", "Mana"]}
        boostLabel={boostLabel}
        boostIcon={boostIcon}
        boostValue={boostValue}
        boostAmount={boostAmount}
        setBoostAmount={setBoostAmount}
        luck={luck}
      />

      <AchievementsModal
        closeModal={() => {
          setAchievementsModalClassName("hidden");
        }}
        modalClassName={achievementsModalClassName}
        achievementData={achievementModalData}
      />

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
              disabled={btnDisabled[`choice${index + 1}`]}
            />
          ))}
        </div>
      </div>

      {/* Checkpoint Popup */}
      <Popup
        overlayClass={checkpointClassName}
        variant="checkpoint"
        icon="💎"
        title="Progress Saved"
        message="Your journey has been preserved. The threads of fate have woven your accomplishments into the tapestry of time."
        buttons={[
          {
            label: "Continue Your Quest",
            onClick: onContinueAdventure,
            disabled: btnDisabled.checkpointContinuePopup,
          },
        ]}
      />

      {/* Death Popup */}
      <Popup
        overlayClass={deathClassName}
        variant="death"
        icon="💀"
        title="You Have Fallen"
        message="Darkness consumes your vision as life slips away. Your tale ends here... but the chronicles remember."
        buttons={[
          {
            label: "Return to Last Checkpoint",
            onClick: () => onReturnToPreviousScene("checkpoints"),
            disabled: btnDisabled.returnToCheckpointPopup,
          },
          {
            label: "Restart",
            onClick: onRestartGame,
            disabled: btnDisabled.returnToCheckpointPopup,
          },
        ]}
      />

      {/* Error Popup */}
      <Popup
        overlayClass={errorClassName}
        variant="error"
        icon="⚠️"
        title="System Anomaly"
        message="The fabric of reality has encountered an unexpected disturbance."
        extraContent={
          <div className="error-code">ERROR CODE: NX-{errorCode}</div>
        }
        buttons={[
          {
            label: "Acknowledge",
            onClick: hideError,
            disabled: btnDisabled.errorPopup,
          },
        ]}
      />

      {/* Info Popup */}
      <Popup
        overlayClass={infoClassName}
        variant="info"
        icon="📜"
        title={infoTitle}
        message={infoMessage}
        buttons={[
          {
            label: "Acknowledge",
            onClick: hideInfo,
            disabled: btnDisabled.infoPopup,
          },
        ]}
      />

      {/* AchievementPopup */}
      <AchievementPopup
        className={achievementPopupClassname}
        icon={achievementPopupIcon}
        title={achievementPopupTitle}
        description={achievementPopupDescription}
        luckAmount={achievementPopupLuck}
        onClose={achievementPopupOnClose}
      />
    </div>
  );
}

export default GamePlay;
