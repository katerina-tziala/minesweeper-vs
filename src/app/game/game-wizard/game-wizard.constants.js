"use strict";
import { CLOSE_BTN } from "~/_constants/btn-icon.constants";
import { RESET_BTN, PLAY_BTN } from "~/_constants/btn-text.constants";

export const BUTTONS = {
    close: CLOSE_BTN,
    reset: RESET_BTN,
    play: PLAY_BTN
};

export const DOM_ELEMENT_ID = {
    wizardContainer: "game-wizard-container",
    playButton: "play_game"
};

export const DOM_ELEMENT_CLASS = {
    wizardContainer: "game-wizard-container",
    wizardHeader: "game-wizard-header",
    actionsContainer: "game-wizard-actions-container",
};

export const CONTENT = {
    original: "set up minesweeper game",
    bot: "set up minesweeper game VS bot",
};