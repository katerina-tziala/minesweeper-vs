"use strict";
import { CONFIRM_BTN, QUIT_NOW_BTN } from "~/_constants/btn-text.constants";


export const DOM_ELEMENT_ID = {
  window: "modal-window",
  modalBox: "modal-box",
  modalTimer: "modal-timer",
};

export const DOM_ELEMENT_CLASS = {
  display: "modal-window--display",
  shakeBox: "modal-box--shake",
  boxContent: "modal-box-content-container",
  title: "title",
  content: "content",
  actions: "actions"
};

export const CONFIRMATION = {
  quitGame: {
    title: "Quiting Game",
    content: "Quiting game in...",
    timer: 3,
    confirmButton: QUIT_NOW_BTN
  },


};
