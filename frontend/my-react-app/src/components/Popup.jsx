import React from "react";

/**
 * Generic Popup Component
 *
 * @param {string} overlayClass - Extra classes for the overlay
 * @param {string} variant - popup type (death | info | checkpoint | error | etc.)
 * @param {string} icon - Emoji or icon string
 * @param {string} title - Popup title
 * @param {string} message - Main message text
 * @param {Array} buttons - Array of button configs
 * @param {ReactNode} extraContent - Optional extra JSX (error code, etc.)
 */
function Popup({
  overlayClass = "",
  variant = "",
  icon = "",
  title = "",
  message = "",
  buttons = [],
  extraContent = null,
}) {
  return (
    <div className={`popup-overlay ${overlayClass}`}>
      <div className={`popup ${variant}`}>
        {/* particles */}
        {[...Array(5)].map((_, i) => (
          <div className="particle" key={i} />
        ))}

        {icon && <div className="popup-icon">{icon}</div>}
        {title && <h2 className="popup-title">{title}</h2>}

        <div className="popup-divider" />

        {message && <p className="popup-message">{message}</p>}

        {extraContent}

        {buttons.map(({ label, onClick, disabled = false }, index) => (
          <button
            key={index}
            className="popup-button"
            onClick={onClick}
            disabled={disabled}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Popup;
