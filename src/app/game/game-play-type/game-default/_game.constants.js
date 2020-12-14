"use strict";

import {
  EXIT_GAME_BTN,
  RESTART_GAME_BTN,
  RESET_GAME_BTN,
  SNEAK_PEEK_GAME_BTN,
} from "~/_constants/btn-icon.constants";

export const ACTION_BUTTONS = {
  exit: EXIT_GAME_BTN,
  restart: RESTART_GAME_BTN,
  reset: RESET_GAME_BTN,
  sneakPeek: SNEAK_PEEK_GAME_BTN,
};

export const DOM_ELEMENT_CLASS = {
  board: "game-board",
  actionButton: "board-action-btn",
};

export const BOARD_SECTION = {
  boardActions: "board-actions",
  dashBoard: "dashboard",
  mineField: "mine-field",
};

export const DASHBOARD_SECTION = {
  mineCounter: "dashboard__mine-counter",
  actionStateIcon: "dashboard__face-icon",
  timeCounter: "dashboard__time-counter",
};
