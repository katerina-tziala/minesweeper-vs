"use strict";

export const DOM_ELEMENT_CLASS = {
  inputContainer: "number-input-container",
  inputField: "number-input",
  inputControls: "number-input-controls",
  inputControlBtn: "number-input-control-btn",
};

export const FIELD_PARAMS = {
  type: "text",
  name: undefined,
  actionType: "keyup",
  attributes: {
    "aria-label": "enter ###",
  },
};

export const FIELD_ERROR = {
  invalidNumber: "Value must be a number!",
  outOfLimits: "Value must be between min and max!",
};

export const CONTROLL_BUTTONS = {
  up: {
    className:
      "btn-icon btn-primary number-input-control-btn number-input-control-btn--up",
    attributes: {
      "aria-label": "increase value",
    },
    actionType: "click",
  },
  down: {
    className:
      "btn-icon btn-primary number-input-control-btn number-input-control-btn--down",
    attributes: {
      "aria-label": "decrease value",
    },
    actionType: "click",
  },
};
