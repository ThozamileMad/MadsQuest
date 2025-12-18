import React from "react";

function StatCard({ icon, label, value, changeClassname = "", change = 0 }) {
  const renderStatChangeClassname = () => {
    if (change < 0) {
      return "negative";
    }

    if (change > 0) {
      return "positive";
    }

    return "hide";
  };

  const renderChangeEffect = () => {
    if (change < 0) {
      return "decreased change";
    }

    if (change > 0) {
      return "increased change";
    }

    return "";
  };

  return (
    <div className={"stat-item " + renderChangeEffect()}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">
          {value}
          <span className={"stat-change " + renderStatChangeClassname()}>
            {change > 0 ? `+${change}` : change}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
