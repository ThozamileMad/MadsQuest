import React from "react";

function GameNavModalOption({
  themeClassName,
  onClick,
  disabled,
  icon,
  title,
  description,
}) {
  return (
    <button
      className={`modal-option ${themeClassName}`}
      onClick={onClick}
      disabled={disabled}
    >
      <i className={"fas " + icon}></i>
      <div className={`modal-option-content ${themeClassName}`}>
        <div className={`modal-option-title ${themeClassName}`}>{title}</div>
        <div className={`modal-option-desc ${themeClassName}`}>
          {description}
        </div>
      </div>
    </button>
  );
}

export default GameNavModalOption;
