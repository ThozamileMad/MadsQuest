import { useState, useEffect, useRef } from "react";
import StatCard from "./StatCard";
import StoryText from "./StoryText";
import ChoiceButton from "./ChoiceButton";
import { get, post } from "../../scripts/api";

function GamePlayApp() {
  const [paragraphs, setParagraphs] = useState([]);
  const [choiceData, setChoiceData] = useState(
    Array(4).fill({
      styles: { display: "none" },
      icon: "",
      text: "",
      nextSceneID: null,
    })
  );
  const [playerStats, setPlayerStats] = useState(Array(4).fill(0));
  const [choiceEffects, setChoiceEffects] = useState(Array(4).fill(0));
  const statsRef = useRef(null);

  const fetchData = async (sceneID, userID) => {
    statsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const response = await get(`/get_scene/${sceneID}/${userID}`);
    if (!response) {
      return;
    }

    const data = response.data;
    if (!data) {
      return;
    }

    const isGameOver = data.game_over;
    if (isGameOver) {
      return;
    }

    const content = data.scene[0].content
      .split("\\n\\n")
      .map((item) => item.replace(/\\/g, ""));
    const options = data.choices;
    const newChoiceEffects = Object.values(data.choiceEffects[0]);
    const newPlayerStats = Object.values(data.playerStats[0]).map(
      (item, index) => item + newChoiceEffects[index]
    );

    setParagraphs(content);
    setChoiceData(
      Array(4).fill({
        styles: { display: "none" },
        icon: "",
        text: "",
        nextSceneID: null,
      })
    );
    setChoiceData((prev) => {
      let newState = [...prev];
      for (let i = 0; i < options.length; i++) {
        const icon = options[i].icon;
        const text = options[i].choice_text;
        const nextSceneID = options[i].next_scene_id;
        newState[i] = {
          styles: { display: "flex" },
          icon: icon,
          text: text,
          nextSceneID: nextSceneID,
        };
      }
      return newState;
    });
    setPlayerStats(newPlayerStats);
    setChoiceEffects(newChoiceEffects);
  };

  useEffect(() => {
    fetchData(1, 1);
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
                  if (item.nextSceneID) {
                    fetchData(item.nextSceneID, 1);
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
