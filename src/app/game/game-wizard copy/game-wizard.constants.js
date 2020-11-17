"use strict";
import { CLOSE_BTN } from "~/_constants/btn-icon.constants";
import { RESET_BTN, PLAY_BTN } from "~/_constants/btn-text.constants";

export const BUTTONS = {
    close: CLOSE_BTN,
    reset: RESET_BTN,
    play: PLAY_BTN
};

export const DOM_ELEMENT_ID = {
    wizardContent: "game-wizard-content",
    wizardTitle: "game-wizard-title",
    wizardActions: "game-wizard-actions",
    playButton: "play_game"
};

export const DOM_ELEMENT_CLASS = {
    wizardContainer: "game-wizard-container",
    wizardHeader: "game-wizard-header",
    actionsContainer: "game-wizard-actions-container",
    wizardContent: "game-wizard-content"
};

export const CONTENT = {
    original: "set up minesweeper game",
    bot: "set up minesweeper game VS bot",
};