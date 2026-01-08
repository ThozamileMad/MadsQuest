import React from "react";

function ChoiceButton({
  themeClassName,
  onClick,
  styles,
  icon,
  text,
  disabled,
}) {
  return (
    <button
      type="button"
      className={`choice-button ${themeClassName}`}
      onClick={onClick}
      style={styles}
      disabled={disabled}
    >
      {icon ? <div className="choice-icon">{icon}</div> : null}
      <div className="choice-text">{text}</div>
    </button>
  );
}

export default ChoiceButton;
