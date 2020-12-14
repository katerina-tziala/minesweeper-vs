"use strict";

export const DOM_ELEMENT_ID = {
  container: "settings",
  settingsPanel: "settings-panel",
  settingsBtn: "settings-toggle-btn",
};

export const DOM_ELEMENT_CLASS = {
  settingsPanel: "settings-panel",
  settingsSection: "settings-section",
  settingsTag: "settings-tag",
  gameSettings: "game-settings",
};

export const CONTENT = {
  theme: "dark mode",
  mineType: "mine type",
  playerColorType: "my color",
  opponentColorType: "opponent's color",
};

export const DROPDOWNS = ["mineType", "playerColorType", "opponentColorType"];

export const SETTINGS_BTN = {
  className: "btn-icon header-btn header-btn--settings",
  attributes: {
    "aria-label": "display settings",
    "aria-expanded": false,
    id: "settings-toggle-btn",
  },
  actionType: "click",
};
