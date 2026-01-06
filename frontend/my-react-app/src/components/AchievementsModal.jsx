import React, { useState } from "react";
import ModalHeader from "./ModalHeader";
import AchievementItem from "./AchievementItem";

const AchievementsModal = ({ modalClassName, closeModal }) => {
  const achievementsData = [
    {
      icon: "fa-gamepad",
      name: "First Steps",
      desc: "Begin your journey",
      unlocked: true,
    },
    {
      icon: "fa-sword",
      name: "Warrior's Path",
      desc: "Win 5 battles without magic",
      unlocked: false,
    },
    {
      icon: "fa-hat-wizard",
      name: "Master Sorcerer",
      desc: "Cast 50 spells",
      unlocked: false,
    },
    {
      icon: "fa-coins",
      name: "Treasure Hunter",
      desc: "Collect 500 gold",
      unlocked: true,
    },
    {
      icon: "fa-map-marked-alt",
      name: "Explorer",
      desc: "Discover all locations",
      unlocked: false,
    },
    {
      icon: "fa-star",
      name: "Legend",
      desc: "Complete the game",
      unlocked: false,
    },
  ];

  return (
    <div id="achievementsModal" className={"modal " + modalClassName}>
      <div className="modal-content">
        <ModalHeader
          text="Achievements"
          icon="fa-trophy"
          closeModal={closeModal}
          modalName="achievementsModal"
        />

        <div className="achievements-list">
          {achievementsData.map((achievement, index) => (
            <AchievementItem
              key={index}
              icon={achievement.icon}
              name={achievement.name}
              description={achievement.desc}
              isUnlocked={achievement.unlocked}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
