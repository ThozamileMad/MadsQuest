import React, { useState } from "react";
import ModalHeader from "./ModalHeader";
import SettingGroup from "./SettingGroup";

const SettingsModal = ({
  themeClassName,
  modalClassName,
  closeModal,
  theme,
  onThemeClick,
  sound,
  onSoundClick,
  textSize,
  onTextSizeClick,
}) => {
  return (
    <div id="settingsModal" className={"modal " + modalClassName}>
      <div className={`modal-content ${themeClassName}`}>
        <ModalHeader
          themeClassName={themeClassName}
          text="Settings"
          icon="fa-gear"
          closeModal={closeModal}
          modalName="settingsModal"
        />

        {/* Theme Settings */}
        <SettingGroup
          themeClassName={themeClassName}
          label="Theme"
          icon="fa-palette"
          type="theme"
          currentValue={theme}
          onClick={onThemeClick}
          options={[
            { label: "Dark", value: "theme-black" },
            { label: "Light", value: "theme-white" },
            { label: "Parchment", value: "theme-parchment" },
          ]}
        />

        {/* Sound Settings */}
        <SettingGroup
          themeClassName={themeClassName}
          label="Sound"
          icon="fa-volume-up"
          type="sound"
          currentValue={sound}
          onClick={onSoundClick}
          options={[
            { label: "On", value: "sound-on" },
            { label: "Off", value: "sound-off" },
          ]}
        />

        {/* Font Size Settings */}
        <SettingGroup
          themeClassName={themeClassName}
          label="Text Size"
          icon="fa-text-height"
          type="text-size"
          currentValue={textSize}
          onClick={onTextSizeClick}
          options={[
            { label: "Small", value: "text-small" },
            { label: "Medium", value: "text-medium" },
            { label: "Large", value: "text-large" },
          ]}
        />
      </div>
    </div>
  );
};

export default SettingsModal;
