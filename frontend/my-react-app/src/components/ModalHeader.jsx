import React from "react";

function ModalHeader({ icon, text, closeModal, modalName }) {
  return (
    <div className="modal-header">
      <div className="modal-title">
        <i className={"fas " + icon}></i>
        <span>{text}</span>
      </div>

      <button
        className="close-btn"
        onClick={() => closeModal(modalName)}
        aria-label={"Close " + modalName}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}

export default ModalHeader;
