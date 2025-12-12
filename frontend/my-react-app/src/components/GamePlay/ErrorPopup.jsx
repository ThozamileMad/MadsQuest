import React from "react";

/**
 * ErrorPopup Component
 *
 * @param {string} className - Additional CSS classes for the overlay
 * @param {string} errorCode - The specific disturbance code (defaults to NX-4042)
 * @param {function} onAcknowledge - Function to call when button is clicked
 * @param {boolean} disabled - Controls the disabled state of the action button
 */
function ErrorPopup({
  className = "",
  errorCode = "",
  onAcknowledge = null,
  disabled = false,
}) {
  return (
    <div className={`popup-overlay ${className}`} id="errorOverlay">
      <div className="popup error">
        {/* Generates 5 particle elements */}
        {[...Array(5)].map((_, index) => (
          <div className="particle" key={index}></div>
        ))}

        <div className="popup-icon">⚠️</div>

        <h2 className="popup-title">System Anomaly</h2>

        <div className="popup-divider"></div>

        <p className="popup-message">
          The fabric of reality has encountered an unexpected disturbance. The
          chronicles cannot proceed with this action. Please verify your path
          and attempt again.
        </p>

        <div className="error-code">ERROR CODE: NX-{errorCode}</div>

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

export default ErrorPopup;
