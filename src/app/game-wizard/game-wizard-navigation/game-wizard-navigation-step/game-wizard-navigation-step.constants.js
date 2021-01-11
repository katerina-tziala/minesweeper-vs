"use strict";

export const DOM_ELEMENT_ID = {
  container: "game-wizard-navigation-step__",
  button: "game-wizard-navigation-step__button__",
  label: "game-wizard-navigation-step__label__",
};

export const DOM_ELEMENT_CLASS = {
  container: "game-wizard-navigation-step",
  button: "game-wizard-navigation-step__button",
  buttonModifier: "game-wizard-navigation-step__button--",
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
    className: "game-wizard-navigation-step__label",
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