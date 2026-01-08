import React from "react";

/**
 * @param {string} label - The text label (e.g., "Theme")
 * @param {string} icon - The FontAwesome icon class (e.g., "fa-palette")
 * @param {string} type - The unique identifier for the setting (e.g., "theme")
 * @param {Array} options - Array of objects { label: 'Dark', value: 'black' }
 * @param {any} currentValue - The currently selected state value
 * @param {function} onChange - Function to update the parent state
 */
const SettingGroup = ({
  themeClassName,
  label,
  icon,
  type,
  options,
  currentValue,
  onClick,
}) => {
  return (
    <div className="setting-group">
      <div className={`setting-label ${themeClassName}`}>
        <i className={`fas ${icon}`}></i> {label}
      </div>
      <div className={`${type}-options`}>
        {options.map((option, index) => (
          <button
            key={index}
            className={`${type}-btn ${
              currentValue === option.value ? "active" : ""
            }`}
            onClick={() => onClick(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingGroup;
