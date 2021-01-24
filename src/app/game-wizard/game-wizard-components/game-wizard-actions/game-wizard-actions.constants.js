"use strict";
import {
  PLAY_BTN,
  RESET_BTN,
} from "~/_constants/btn-text.constants";

export const DOM_ELEMENT_ID = {
  submitButton: "game-wizard-action-button__submit",
  backButton: "game-wizard-action-button__back",
  resetButton: "game-wizard-action-button__reset",
};

export const DOM_ELEMENT_CLASS = {
  container: "game-wizard-actions-container",
};

export const BACK_BTN = {
  innerHTML: "back",
  className: "btn-text btn-primary game-wizard-action-back",
  attributes: {
    "aria-label": "go to previous settings",
    "id": DOM_ELEMENT_ID.backButton
  },
  actionType: "click",
};

export const NEXT_BTN = {
  innerHTML: "next",
  className: "btn-text btn-primary game-wizard-action-next",
  attributes: {
    "aria-label": "go to next settings"
  },
  actionType: "click",
};

export const INVITE_BTN = {
  innerHTML: "invite",
  className: "btn-text btn-primary game-wizard-action-invite",
  attributes: {
    "aria-label": "send invitation",
  },
  actionType: "click",
};

export const BUTTONS = {
  reset: RESET_BTN,
  play: PLAY_BTN,
  back: BACK_BTN,
  next: NEXT_BTN,
  invite: INVITE_BTN,
};
