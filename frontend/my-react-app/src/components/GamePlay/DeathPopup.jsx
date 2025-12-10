function DeathPopup({
  className = "",
  onReturnToCheckpoint = null,
  onRestartGame = null,
}) {
  return (
    <div className={`popup-overlay ${className}`} id="deathOverlay">
      <div className="popup death">
        {[Array(5)].map((item, index) => (
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
        <button className="popup-button" onClick={onReturnToCheckpoint}>
          Return to Last Checkpoint
        </button>
        <br />
        <button className="popup-button" onClick={onRestartGame}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default DeathPopup;
