import React from "react";

function GameNavModalOption({ onClick, icon, title, description }) {
  return (
    <div className="modal-option" onClick={onClick}>
      <i className={"fas " + icon}></i>
      <div className="modal-option-content">
        <div className="modal-option-title">{title}</div>
        <div className="modal-option-desc">{description}</div>
      </div>
    </div>
  );
}

export default GameNavModalOption;
