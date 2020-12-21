"use strict";

export const DOM_ELEMENT_ID = {
  button: "sneak-peek-btn",
};

export const DOM_ELEMENT_CLASS = {
  button: "sneak-peek-btn",
  buttonState: "sneak-peek-btn-state",
  notPeeking: "sneak-peek-btn-state--not-peeking",
  peeking: "sneak-peek-btn-state--peeking",
  limit: "sneak-peek-limit",
};

export const BUTTON = {
  className: "sneak-peek-btn",
  attributes: {
    "aria-label": "sneak peek on opponent's game",
    "role":"switch"
  },
  actionType: "click",
};

export const ARIA = {
  default: {
    true: "sneak peek on opponent's strategy",
    false: "sneak peek on opponent's strategy",
  },
  parallel: {
    true: "sneak peek on opponent's game",
    false: "sneak peek on opponent's game",
  }
};
