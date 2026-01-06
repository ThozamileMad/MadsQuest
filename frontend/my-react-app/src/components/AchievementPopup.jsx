import React, { useEffect } from "react";

function AchievementPopup({
  className,
  achievement,
  onClose,
  duration = 5000,
}) {
  return (
    <div className={`achievement-popup ${className}`} id="achievementPopup">
      <div className="achievement-content">
        {/* Animated Sparkles */}
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>

        <div className="achievement-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </div>

        <div className="achievement-inner">
          <div className="achievement-icon-container">
            <i
              className={`fas ${achievement.icon || "fa-trophy"}`}
              id="achievementIcon"
            ></i>
          </div>
          <div className="achievement-text">
            <div className="achievement-header">🎉 Achievement Unlocked!</div>
            <div className="achievement-title" id="achievementTitle">
              {achievement.title}
            </div>
            <div className="achievement-description" id="achievementDesc">
              {achievement.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AchievementPopup;
