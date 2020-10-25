"use strict";

import { AppModel } from "./app-model";

import { THEME, MINETYPE } from "../enums/app-settings.enums";
import { getRandomValueFromArray } from "../utils";
import { COLOR_TYPES } from "../constants/ui.constants";
export class AppSettingsModel extends AppModel {

	constructor() {
		super();
		this.theme = THEME.Default;
		this.mineType = getRandomValueFromArray(Object.values(MINETYPE));
		this.playerColorType = this.generateColorType(this.opponentColorType);
		this.opponentColorType = this.generateColorType(this.playerColorType);
	}

	generateColorType(typeToExclude) {
		let types = COLOR_TYPES.filter(type => type !== typeToExclude);
		return getRandomValueFromArray(types);
	}

}
