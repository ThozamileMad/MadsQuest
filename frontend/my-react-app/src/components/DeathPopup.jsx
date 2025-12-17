import React from "react";

/**
 * DeathPopup Component
 *
 * @param {string} className - Additional CSS classes for the overlay
 * @param {function} onReturnToCheckpoint - Function to call when Return to Last Checkpoint button is clicked
 * @param {function} onRestartGame - Function to call when Restart button is clicked
 * @param {boolean} returnToCheckpointDisabled - Controls the disabled state of the Return to Last Checkpoint button
 * @param {boolean} restartGameDisabled - Controls the disabled state of the Restart button
 */
function DeathPopup({
  className = "",
  onReturnToCheckpoint = null,
  onRestartGame = null,
  returnToCheckpointDisabled = false,
  restartGameDisabled = false,
}) {
  return (
    <div className={`popup-overlay ${className}`} id="deathOverlay">
      <div className="popup death">
        {/* Generates 5 particle elements */}
        {[...Array(5)].map((_, index) => (
          <div className="particle" key={index}></div>
        ))}

        <div className="popup-icon">💀</div>
        <h2 className="popup-title">You Have Fallen</h2>
        <div className="popup-divider"></div>
        <p className="popup-message">
          Darkness consumes your vision as life slips away. Your tale ends
          here... but the chronicles remember. The threads of fate offer you
          another chance to reshape your destiny.
        </p>
        <button
          className="popup-button"
          onClick={onReturnToCheckpoint}
          disabled={returnToCheckpointDisabled}
        >
          Return to Last Checkpoint
        </button>
        <br />
        <button
          className="popup-button"
          onClick={onRestartGame}
          disabled={restartGameDisabled}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default DeathPopup;
