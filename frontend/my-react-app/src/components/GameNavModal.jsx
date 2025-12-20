import React from "react";
import GameNavModalHeader from "./GameNavModalHeader";
import GameNavModalOption from "./GameNavModalOption";

function GameNavModal({
  modalClassName,
  closeModal,
  redoLastChoice,
  goToCheckpoint,
  restartChapter,
  lastChoiceDisabled,
  returnToCheckpointDisabled,
  restartGameDisabled,
}) {
  return (
    <div id="navigationModal" className={"modal " + modalClassName}>
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
          disabled={lastChoiceDisabled}
        />

        <GameNavModalOption
          onClick={goToCheckpoint}
          icon="fa-save"
          title="Last Checkpoint"
          description="Return to the last saved checkpoint"
          disabled={returnToCheckpointDisabled}
        />

        <GameNavModalOption
          onClick={restartChapter}
          icon="fa-book-open"
          title="Start Chapter Over"
          description="Begin this chapter from the start"
          disabled={restartGameDisabled}
        />
      </div>
    </div>
  );
}

export default GameNavModal;
