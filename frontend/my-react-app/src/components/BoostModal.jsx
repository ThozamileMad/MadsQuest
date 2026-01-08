import React, { useState } from "react";
import StatSelector from "./StatSelector";
import BoostControls from "./BoostControls";
import BoostInfoBox from "./BoostInfoBox";
import ModalHeader from "./ModalHeader";

const BoostModal = ({
  themeClassName,
  modalClassName,
  onStatChange,
  statOptions,
  closeModal,
  boostLabel,
  boostIcon,
  boostValue,
  boostAmount,
  setBoostAmount,
  luck,
  onConfirm,
}) => {
  return (
    <div id="boostModal" className={"modal " + modalClassName}>
      <div className={`modal-content ${themeClassName}`}>
        <ModalHeader
          themeClassName={themeClassName}
          text="Boost Stats"
          icon="fa-bolt"
          closeModal={closeModal}
          modalName="boostModal"
        />

        <StatSelector onStatChange={onStatChange} options={statOptions} />

        <div className="boost-container">
          <BoostControls
            label={boostLabel}
            icon={boostIcon}
            currentValue={boostValue}
            boostAmount={boostAmount}
            setBoostAmount={setBoostAmount}
            availableLuck={luck}
            onConfirm={onConfirm}
          />

          <BoostInfoBox
            label={boostLabel}
            currentValue={boostValue}
            boostAmount={boostAmount}
            availableLuck={luck}
          />
        </div>
      </div>
    </div>
  );
};

export default BoostModal;
