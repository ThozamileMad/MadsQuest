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

  {
    /**
     * Generate new page info
     * @param {Object} data - Scene data { id, title, content, image_url, created_at, is_checkpoint }
     */
  }
  const showPageInfo = (data) => {
    const content = data.scene[0].content
      .split("\\n\\n")
      .map((item) => item.replace(/\\/g, ""));
    setParagraphs(content);
  };

  {
    /**
     * Generate new page info
     * @param {Object} data - Choice effect data { id, scene_id, life_change, mana_change, morale_change, coin_change }
     */
  }
  const applyStatChanges = (data) => {
    const { life_change, mana_change, morale_change, coin_change } =
      data.choiceEffects;
    const statChanges = Object.values({
      life_change,
      mana_change,
      morale_change,
      coin_change,
    });
    setChoiceEffects(statChanges);
  };

  const fetchData = async (sceneId, userId) => {
    statsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const response = await get(`/api/scene/${sceneId}/${userId}}`);
    if (!response || !response.data) return;

    const data = response.data;

    showPageInfo(data);
    const content = data.scene[0].content
      .split("\\n\\n")
      .map((item) => item.replace(/\\/g, ""));
    setParagraphs(content);

    const { life_change, mana_change, morale_change, coin_change } =
      data.choiceEffects;
    const statChanges = Object.values({
      life_change,
      mana_change,
      morale_change,
      coin_change,
    });
    setChoiceEffects(statChanges);

    setPlayerStats(data.playerStats);

    const isGameOver = data.game_over;
    if (isGameOver) {
      setChoiceData([
        {
          styles: { display: "flex" },
          icon: "💀",
          text: "Continue",
          nextSceneID: "dead",
        },
        ...Array(3).fill({
          styles: { display: "none" },
          icon: "",
          text: "",
          nextSceneID: null,
        }),
      ]);

      return;
    }

    const choices = data.choices;
    setChoiceData(() => {
      let newState = Array(4).fill({
        styles: { display: "none" },
        icon: "",
        text: "",
        nextSceneID: null,
      });

      for (let i = 0; i < choices.length; i++) {
        const icon = choices[i].icon;
        const text = choices[i].choice_text;
        const nextSceneID = choices[i].next_scene_id;

        newState[i] = {
          styles: { display: "flex" },
          icon: icon,
          text: text,
          nextSceneID: nextSceneID,
        };
      }

      return newState;
    });

    choices.forEach((item, index) => {
      showCheckpointOnClick(item.next_scene_id, userId, index);
    });
  };

  const showCheckpointOnClick = async (sceneId, userId, index) => {
    const response = await get(`/api/checkpoint/${sceneId}/${userId}}`);
    if (!response) {
      return;
    }

    const data = response.data;
    if (!data) {
      return;
    }

    const isCheckpoint =
      data.success &&
      (data.result === "Checkpoint inserted" ||
        data.result === "Checkpoint updated");

    if (!isCheckpoint) {
      return;
    }

    setChoiceData((prev) => {
      let newState = [...prev];
      let newStateItem = newState[index];
      newStateItem.nextSceneID = "checkpoint";
      newState[index] = newStateItem;
      return newState;
    });

    localStorage.setItem("checkpointSceneID", sceneId);
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
                onClick={() => {
                  const state = {
                    life: playerStats[0],
                    mana: playerStats[1],
                    morale: playerStats[2],
                    coin: playerStats[3],
                    sceneId: localStorage.getItem("checkpointSceneID"),
                  };

                  if (item.nextSceneId === "dead") {
                    navigate("/gameover", { state: state });
                  } else if (item.nextSceneId === "checkpoint") {
                    navigate("/checkpoint", { state: state });
                  } else if (item.nextSceneId) {
                    fetchData(item.nextSceneId, 1);
                  }
                }}
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
