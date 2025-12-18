import React from "react";
import GameNavModalHeader from "./GameNavModalHeader";
import GameNavModalOption from "./GameNavModalOption";

function GameNavModal({
  closeModal,
  redoLastChoice,
  goToCheckpoint,
  restartChapter,
}) {
  return (
    <div id="navigationModal" className="modal">
      <div className="modal-content">
        <GameNavModalHeader
          text="Navigation"
          icon="fa-arrow-left"
          closeModal={closeModal}
          modalName="navigationModal"
        />

        <GameNavModalOption
          onClick={redoLastChoice}
          icon="fa-redo-alt"
          title="Redo Last Choice"
          description="Go back and make a different decision"
        />

        <GameNavModalOption
          onClick={goToCheckpoint}
          icon="fa-save"
          title="Last Checkpoint"
          description="Return to the last saved checkpoint"
        />

        <GameNavModalOption
          onClick={restartChapter}
          icon="fa-book-open"
          title="Start Chapter Over"
          description="Begin this chapter from the start"
        />

        <GameNavModalOption
          onClick={() => closeModal("navigationModal")}
          icon="fa-times-circle"
          title="Cancel"
          description="Return to the game"
        />
      </div>
    </div>
  );
}

export default GameNavModal;
