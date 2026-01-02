import React from "react";

/**
 * InfoPopup Component
 *
 * @param {string} className - Additional CSS classes for the overlay
 * @param {string} title - The title of the info popup (defaults to "Chronicle Entry")
 * @param {string} message - The message content to display
 * @param {function} onAcknowledge - Function to call when button is clicked
 * @param {boolean} disabled - Controls the disabled state of the action button
 */
function InfoPopup({
  className = "",
  title = "Chronicle Entry",
  message = "The ancient texts whisper secrets of forgotten realms. Knowledge flows through the nexus like rivers of light, waiting to illuminate the path of those who seek understanding. Listen carefully, for these words may guide your journey.",
  onAcknowledge = null,
  disabled = false,
}) {
  return (
    <div className={`popup-overlay ${className}`} id="infoOverlay">
      <div className="popup info">
        {/* Generates 5 particle elements */}
        {[...Array(5)].map((_, index) => (
          <div className="particle" key={index}></div>
        ))}

        <div className="popup-icon">📜</div>

        <h2 className="popup-title">{title}</h2>

        <div className="popup-divider"></div>

        <p className="popup-message">{message}</p>

        <button
          className="popup-button"
          onClick={onAcknowledge}
          disabled={disabled}
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}

export default InfoPopup;
