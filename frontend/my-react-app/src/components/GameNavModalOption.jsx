import React from "react";

function GameNavModalOption({ onClick, disabled, icon, title, description }) {
  return (
    <button className="modal-option" onClick={onClick} disabled={disabled}>
      <i className={"fas " + icon}></i>
      <div className="modal-option-content">
        <div className="modal-option-title">{title}</div>
        <div className="modal-option-desc">{description}</div>
      </div>
    </button>
  );
}

export default GameNavModalOption;
