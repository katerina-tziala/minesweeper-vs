"use strict";

export const DOM_ELEMENT_ID = {
  container: "game-wizard-navigation-step__",
  button: "game-wizard-navigation-step-button__",
  label: "game-wizard__navigation-step-label__",
};

export const DOM_ELEMENT_CLASS = {
  container: "game-wizard-navigation-step",
  button: "game-wizard-navigation-step-button",
  buttonModifier: "game-wizard-navigation-step-button--",
  selected: "selected",
  completed: "completed"
};

export const BUTTONS = {
  icon: {
    attributes: {
      "aria-label": "go to ### settings",
    },
    actionType: "click",
  },
  label: {
    className: "game-wizard__navigation-step-label",
    attributes: {
      "aria-label": "go to ### settings",
    },
    actionType: "click",
  }
};

export const CONTENT = {
  botMode: "bot",
  vsModeSettings: "vs mode",
  levelSettings: "level",
  turnSettings: "turns",
  optionsSettings: "options",
};