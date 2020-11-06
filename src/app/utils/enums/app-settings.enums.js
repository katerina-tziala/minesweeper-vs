"use strict";

const THEME = {
	Default: "light",
	Dark: "dark"
};
Object.freeze(THEME);

const MINE_TYPE = {
	Bomb: "bomb",
	Bahai: "bahai",
	Virus: "virus"
};
Object.freeze(MINE_TYPE);

const SETTINGS_TYPE = {
	Theme: "theme",
    MineType: "mineType",
    PlayerColorType: "playerColorType",
	OpponentColorType: "opponentColorType"
};
Object.freeze(SETTINGS_TYPE);

export { THEME, MINE_TYPE, SETTINGS_TYPE };
