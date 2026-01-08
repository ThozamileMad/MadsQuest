import React from "react";
import GameNavButton from "./GameNavButton";

function GameNavBar({
  topNavTheme,
  navBtnTheme,
  openNavigation,
  openBoostStats,
  openAchievements,
  openSettings,
}) {
  return (
    <div className={`top-nav ${topNavTheme}`}>
      <div className="nav-buttons">
        <GameNavButton
          wrapperClassName="nav-btn-wrapper"
          btnClassName={`nav-btn navigate ${navBtnTheme}`}
          onClick={openNavigation}
          icon="fa-arrow-left"
          text="Navigate"
          toolTip="Go back or restart"
        />

        <GameNavButton
          wrapperClassName="nav-btn-wrapper"
          btnClassName={`nav-btn boost ${navBtnTheme}`}
          onClick={openBoostStats}
          icon="fa-bolt"
          text="Boost Stats"
          toolTip="Enhance your character"
        />

        <GameNavButton
          wrapperClassName="nav-btn-wrapper"
          btnClassName={`nav-btn achievements ${navBtnTheme}`}
          onClick={openAchievements}
          icon="fa-trophy"
          text="Achievements"
          toolTip="View your progress"
        />
      </div>

      <GameNavButton
        wrapperClassName="settings-btn-wrapper"
        btnClassName={`settings-btn ${navBtnTheme}`}
        onClick={openSettings}
        icon="fa-cog"
        text="Settings"
      />
    </div>
  );
}

export default GameNavBar;
