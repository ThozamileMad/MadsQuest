import React from "react";

function GameNavButton({
  wrapperClassName,
  btnClassName,
  onClick,
  icon,
  text,
  toolTip,
}) {
  return (
    <div className={wrapperClassName}>
      <button className={btnClassName} onClick={onClick}>
        <i className={"fas " + icon}></i>
        <span>{text}</span>
      </button>
      {toolTip ? <div className="tooltip">{toolTip}</div> : null}
    </div>
  );
}

export default GameNavButton;
