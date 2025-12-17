import React from "react";

/**
 * CheckpointPopup Component
 *
 * @param {string} className - Additional CSS classes for the overlay
 * @param {function} onContinueAdventure - Function to call when button is clicked
 * @param {boolean} disabled - Controls the disabled state of the action button
 */
function CheckpointPopup({ className, onContinueAdventure, disabled }) {
  return (
    <div className={`popup-overlay ${className}`} id="checkpointOverlay">
      <div className="popup checkpoint">
        {/* Generates 5 particle elements */}
        {[...Array(5)].map((_, index) => (
          <div className="particle" key={index}></div>
        ))}

        <div className="popup-icon">💎</div>
        <h2 className="popup-title">Progress Saved</h2>
        <div className="popup-divider"></div>
        <p className="popup-message">
          Your journey has been preserved. The threads of fate have woven your
          accomplishments into the tapestry of time. Should darkness claim you,
          you may return to this moment.
        </p>
        <button
          className="popup-button"
          onClick={onContinueAdventure}
          disabled={disabled}
        >
          Continue Your Quest
        </button>
      </div>
    </div>
  );
}

export default CheckpointPopup;
