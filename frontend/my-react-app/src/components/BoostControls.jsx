import React from "react";

const BoostControls = ({
  label,
  icon,
  currentValue,
  boostAmount,
  setBoostAmount,
  availableLuck,
  onConfirm,
}) => {
  return (
    <div className="boost-item">
      <div className="boost-header">
        <div className="boost-name">
          <i className={`fas ${icon}`}></i>
          <span>{label}</span>
        </div>
      </div>

      <div className="boost-current">
        Current {label}: <strong>{currentValue}</strong>
      </div>

      <div className="boost-controls">
        <button
          className="boost-btn"
          onClick={() => setBoostAmount((prev) => Math.max(0, prev - 1))}
          disabled={boostAmount <= 0}
        >
          <i className="fas fa-minus"></i>
        </button>

        <div className="boost-value">{boostAmount}</div>

        <button
          className="boost-btn"
          onClick={() => setBoostAmount((prev) => prev + 1)}
          disabled={boostAmount >= availableLuck}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <button
        className="confirm-btn"
        onClick={onConfirm}
        disabled={boostAmount === 0}
      >
        Apply Boost (Cost: {boostAmount} Luck)
      </button>
    </div>
  );
};

export default BoostControls;
