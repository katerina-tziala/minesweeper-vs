"use strict";

import { ADD_PLAYER_BTN, PLAY_BTN, PREVIOUS_BTN, NEXT_BTN } from "~/_constants/btn-text.constants";

export const BUTTONS = {
    previous: PREVIOUS_BTN,
    next: NEXT_BTN,
    play: PLAY_BTN
};

export const DOM_ELEMENT_ID = {
    wizardContent: "game-wizard-content",
    playButton: "play_game",
    nextButton: "btn__next",
    previousButton: "btn__previous"
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

export const WIZARDS_ORDER = {
    clear: ["vsTypeMode", "levelSettings", "turnSettings", "optionsSettings"],
    detect: ["vsTypeMode", "levelSettings", "turnSettings", "optionsSettings"],
    parallel: ["vsTypeMode", "levelSettings"],
};
