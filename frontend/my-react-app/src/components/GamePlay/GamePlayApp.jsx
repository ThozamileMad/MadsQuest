import { useState, useEffect, useRef } from "react";
import StatCard from "./StatCard";
import StoryText from "./StoryText";
import ChoiceButton from "./ChoiceButton";
import { get, post } from "../../scripts/api";
import { useNavigate, useLocation } from "react-router-dom";

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

  const statsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { sceneId = 1, userId = 1 } = location.state || {};

  /**
   * Renders the available choices when the game is active.
   *
   * @param {boolean} isGameOver - Indicates if the player reached a terminal state.
   * @param {Array} choices - List of choices for the current scene.
   */
  const renderActiveChoices = (isGameOver, choices) => {
    if (isGameOver) return;

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
          text: choice.choice_text,
          nextSceneId: choice.next_scene_id,
        };
      });

      return baseChoices;
    });
  };

  /**
   * When the game is over, show a single "Continue" button
   * and hide all other choice slots.
   *
   * @param {boolean} isGameOver
   */
  const renderGameOverChoice = (isGameOver) => {
    if (!isGameOver) return;

    setChoiceData([
      {
        styles: { display: "flex" },
        icon: "💀",
        text: "Continue",
        nextSceneId: "dead",
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
   * Updates a specific choice slot to route the player to the checkpoint
   * if the current scene is flagged as a checkpoint.
   *
   * @param {number} sceneId
   * @param {number} userId
   * @param {number} index - Choice button index
   */
  const showCheckpointOnClick = async (sceneId, userId, index) => {
    const response = await get(`/api/checkpoint/${sceneId}/${userId}`);
    if (!response || !response.data) return;

    const { success, result } = response.data;
    const isCheckpoint = success && result.includes("Checkpoint");

    if (!isCheckpoint) return;

    setChoiceData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        nextSceneId: "checkpoint",
      };
      return updated;
    });
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

  const updateSceneUI = (info, effects, stats, choices, isGameOver) => {
    const formattedParagraphs = info
      .split("\\n\\n")
      .map((paragraph) => paragraph.replace(/\\/g, ""));

    setParagraphs(formattedParagraphs);
    setChoiceEffects(effects);
    setPlayerStats(stats);

    renderActiveChoices(isGameOver, choices);
    renderGameOverChoice(isGameOver);

    // Apply checkpoint logic to each choice
    choices.forEach((choice, index) => {
      showCheckpointOnClick(choice.next_scene_id, userId, index);
    });
  };

  /**
   * Fetches scene details and updates UI state.
   *
   * @param {number} sceneId
   * @param {number} userId
   */
  const fetchData = async (sceneId, userId) => {
    statsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const response = await get(`/api/scene/${sceneId}/${userId}`);
    if (!response || !response.data) return;

    console.log(response.data);

    const {
      sceneData,
      choiceEffectsData,
      playerStatsData,
      choiceData,
      isGameOver,
    } = response.data;

    updateSceneUI(
      sceneData,
      choiceEffectsData,
      playerStatsData,
      choiceData,
      isGameOver
    );
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
    // Build navigation state object (sent across routes)
    const state = {
      life: playerStats[0],
      mana: playerStats[1],
      morale: playerStats[2],
      coin: playerStats[3],
      sceneId: localStorage.getItem("checkpointSceneID"),
    };

    // No valid next scene — do nothing
    if (!item?.nextSceneId) return;

    // Route handling based on nextSceneId keyword
    switch (item.nextSceneId) {
      case "dead":
        navigate("/gameover", { state });
        break;

      case "checkpoint":
        navigate("/checkpoint", { state });
        break;

      default:
        // Normal scene transition
        fetchData(item.nextSceneId, userId);
        break;
    }
  };

  useEffect(() => {
    fetchData(sceneId, userId);
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
    </div>
  );
}

export default GamePlayApp;
