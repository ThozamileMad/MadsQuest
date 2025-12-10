function CheckpointPopup({ className = "", onContinueAdventure = null }) {
  return (
    <div className={`popup-overlay ${className}`} id="checkpointOverlay">
      <div className="popup checkpoint">
        {[Array(5)].map((item, index) => (
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
        <button className="popup-button" onClick={onContinueAdventure}>
          Continue Your Quest
        </button>
      </div>
    </div>
  );
}

export default CheckpointPopup;
