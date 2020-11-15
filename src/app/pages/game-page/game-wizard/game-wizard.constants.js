"use strict";
import { CLOSE_BTN } from "~/_constants/btn-icon.constants";
import { CLEAR_BTN, PLAY_BTN } from "~/_constants/btn-text.constants";


export const BUTTONS = {
    close: CLOSE_BTN,
    clear: CLEAR_BTN,
    play: PLAY_BTN
};



export const DOM_ELEMENT_ID = {
	loginContainer: "login-container"
};

export const DOM_ELEMENT_CLASS = {
    wizardContainer: "game-wizard-container",
    wizardHeader: "game-wizard-header",
    propertyTag: "wizard-property-tag",
    propertyContainer: "wizard-property-container",
    wizardOptionsContainer: "options-wizard-container",
    optionsPropertyContainer: "options-property-container",
    actionsContainer: "game-wizard-actions-container",
};

export const CONTENT = {
    wizardTitle: "set up minesweeper game",
    level: "level",
    rows: "minefield rows",
    columns: "minefield columns",
    numberOfMines: "number of mines",
    marks: "marks",
    wrongFlagHint: "wrong flag hint"
};