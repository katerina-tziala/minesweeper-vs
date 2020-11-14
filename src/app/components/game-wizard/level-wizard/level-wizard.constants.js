"use strict";

export const DOM_ELEMENT_ID = {
	//loginContainer: "login-container"
};

export const DOM_ELEMENT_CLASS = {
    wizardContainer: "level-wizard-container",
    propertyTag: "level-property-tag",
    propertyContainer: "level-property-container"
};


export const LEVEL_SETTINGS_PROPERTIES = {
    level: "level",
    rows: "rows",
    columns: "columns",
    numberOfMines: "numberOfMines"
};

export const CONTENT = {
    level: "level",
    rows: "minefield rows",
    columns: "minefield columns",
    numberOfMines: "number of mines"
};

export const LIMITS = {
    customLevelBoard: {
        max: 30,
        min: 9
    },
    mines: {
        max: 0,
        min: 16
    },
    minMinesPercentage: 0.1,
    maxMinesPercentage: 0.9,
};