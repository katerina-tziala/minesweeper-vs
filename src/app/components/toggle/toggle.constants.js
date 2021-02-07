"use strict";

export const DOM_ELEMENT_ID = {
  container: "toggle__",
  toggleButton: "toggle-btn__",
  togglePanel: "toggle-panel__",
  toggleContent: "toggle-content__"
};

export const DOM_ELEMENT_CLASS = {
  container: "toggle",
  toggleButton: "toggle-btn",
  toggleButtonExpanded: "toggle-btn--expanded",
  togglePanel: "toggle-panel",
  toggleContent: "toggle-content"
};

export const BUTTON = {
  className: "toggle-btn toggle-btn--",
  attributes: {
    "aria-label": "display ###",
    "aria-expanded": false,
  },
  actionType: "click",
};