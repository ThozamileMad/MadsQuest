import React from "react";

function AchievementPopup({
  className,
  icon,
  title,
  description,
  luckAmount,
  onClose,
}) {
  return (
    <div className={`achievement-popup ${className}`}>
      <div className="achievement-content">
        {/* Sparkles */}
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>

        {/* Close Button */}
        <div className="achievement-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </div>

        <div className="achievement-inner">
          <div className="achievement-icon-container">
            <i className={`fas ${icon}`}></i>
          </div>

          <div className="achievement-text">
            <div className="achievement-header">🎉 Achievement Unlocked!</div>

            <div className="achievement-title">{title}</div>

            <div className="achievement-description">{description}</div>

            <div className="luck-reward">
              <i className="fas fa-clover luck-icon"></i>
              <span className="luck-text">Luck Gained</span>
              <span className="luck-amount">+{luckAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AchievementPopup;
