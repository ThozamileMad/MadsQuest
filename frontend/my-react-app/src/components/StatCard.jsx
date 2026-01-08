import React from "react";

function StatCard({
  themeClassName,
  icon,
  label,
  value,
  changeClassname = "",
  change = 0,
}) {
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
    <div className={`stat-item ${themeClassName} ${renderChangeEffect()}`}>
      <div className={`stat-icon ${themeClassName}`}>{icon}</div>
      <div className="stat-content">
        <div className={`stat-label ${themeClassName}`}>{label}</div>
        <div className={`stat-value ${themeClassName}`}>
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
