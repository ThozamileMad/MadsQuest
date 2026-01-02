import React from "react";

const BoostInfoBox = ({ label, currentValue, boostAmount, availableLuck }) => {
  return (
    <div className="boost-info-box">
      <div>
        <strong>
          <i className="fas fa-clover"></i> Available Luck:
        </strong>
        <span> {availableLuck - boostAmount}</span>
        <br />
        <strong>
          <i className="fas fa-info-circle"></i> New {label} Total:
        </strong>
        <span> {currentValue + boostAmount}</span>
        <br />
        <strong>
          <i className="fas fa-chart-line"></i> Cost:
        </strong>
        1 luck point per stat point
      </div>
    </div>
  );
};

export default BoostInfoBox;
