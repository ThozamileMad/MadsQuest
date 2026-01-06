import React from "react";
import GameNavButton from "./GameNavButton";

function GameNavBar({ openNavigation, openBoostStats, openAchievements }) {
  return (
    <div className="top-nav">
      <div className="nav-buttons">
        <GameNavButton
          wrapperClassName="nav-btn-wrapper"
          btnClassName="nav-btn navigate"
          onClick={() => openNavigation()}
          icon="fa-arrow-left"
          text="Navigate"
          toolTip="Go back or restart"
        />

        <GameNavButton
          wrapperClassName="nav-btn-wrapper"
          btnClassName="nav-btn boost"
          onClick={() => openBoostStats()}
          icon="fa-bolt"
          text="Boost Stats"
          toolTip="Enhance your character"
        />

        <GameNavButton
          wrapperClassName="nav-btn-wrapper"
          btnClassName="nav-btn achievements"
          onClick={() => openAchievements()}
          icon="fa-trophy"
          text="Achievements"
          toolTip="View your progress"
        />
      </div>

      <GameNavButton
        wrapperClassName="settings-btn-wrapper"
        btnClassName="settings-btn"
        onClick={() => alert("Settings opened!")}
        icon="fa-cog"
        text="Settings"
      />
    </div>
  );
}

export default GameNavBar;
