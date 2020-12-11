"use strict";
import { RESTART_BTN, QUIT_BTN, RESET_BTN } from "~/_constants/btn-text.constants";

export const DOM_ELEMENT_ID = {
  window: "modal-window",
  modalDialog: "modal-dialog",
  modalTimer: "modal-timer",
  modalDialogTitle: "modal-dialog-title",
};

export const DOM_ELEMENT_CLASS = {
  display: "modal-window--display",
  shakeDialog: "modal-dialog--shake",
  dialogContent: "modal-dialog-content-container",
  title: "title",
  content: "content",
  actions: "actions",
  actionButton: "actionButton"
};

export const MOVEMENT_DURATION = {
  shake: 500,
  slideIn: 300
};

export const CONFIRMATION = {
  quitGame: {
    title: "Quit Game",
    content: "Quiting game in...",
    timer: 3,
    confirmButton: QUIT_BTN
  },
  restartGame: {
    title: "Restart Game",
    content: "Restarting game in...",
    timer: 3,
    confirmButton: RESTART_BTN
  },
  resetGame: {
    title: "Reset Game",
    content: "Reseting game in...",
    timer: 3,
    confirmButton: RESET_BTN
  },
};
