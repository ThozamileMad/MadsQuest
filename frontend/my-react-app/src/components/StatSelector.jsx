import React from "react";

const StatSelector = ({ selectedStat, onStatChange, options }) => {
  return (
    <div className="stat-selector">
      <label htmlFor="stat-select">
        <i className="fas fa-list"></i> Select Stat to Boost:
      </label>
      <select
        id="stat-select"
        className="stat-dropdown"
        value={selectedStat}
        onChange={(e) => onStatChange(e.target.value)}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatSelector;
