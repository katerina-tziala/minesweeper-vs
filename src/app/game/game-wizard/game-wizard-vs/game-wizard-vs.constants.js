"use strict";
import { CLOSE_BTN } from "~/_constants/btn-icon.constants";
import { ADD_PLAYER_BTN, PLAY_BTN } from "~/_constants/btn-text.constants";

export const BUTTONS = {
    close: CLOSE_BTN,
    // reset: RESET_BTN,
    play: PLAY_BTN
};

export const DOM_ELEMENT_ID = {
    wizardContent: "game-wizard-content",
    playButton: "play_game"
};

export const DOM_ELEMENT_CLASS = {
    wizardContainer: "game-wizard-container",
    wizardHeader: "game-wizard-header",
    actionsContainer: "game-wizard-actions-container",
    wizardContent: "game-wizard-content"
};

export const CONTENT = {
    addPlayer: "Add Opponent:",
    vs: "Set Up Minesweeper Game VS ###",
};

export const FORM_PARAMS = {
	submitBtn: ADD_PLAYER_BTN
};
export const WIZARDS_ORDER = ["vsTypeMode", "levelSettings", "turnSettings", "optionsSettings"];