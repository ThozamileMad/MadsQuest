import React from "react";

function AchievementItem({ icon, name, description, isUnlocked }) {
  return (
    <div className={`achievement-item ${isUnlocked ? "unlocked" : ""}`}>
      <div className="achievement-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="achievement-info">
        <div className="achievement-name">{name}</div>
        <div className="achievement-desc">{description}</div>
      </div>
      <div className="achievement-status">
        {isUnlocked ? "Unlocked" : "Locked"}
      </div>
    </div>
  );
}

export default AchievementItem;
