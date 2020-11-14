"use strict";

import { AppModel } from "./_app-model";

import { Theme, MineType } from "../_enums/app-settings.enums";
import { getRandomValueFromArray } from "../utils/utils";
import { COLOR_TYPES } from "../utils/constants/ui.constants";
export class AppSettingsModel extends AppModel {

	constructor() {
		super();
		this.theme = Theme.Default;
		this.mineType = getRandomValueFromArray(Object.values(MineType));
		this.playerColorType = this.generateColorType(this.opponentColorType);
		this.opponentColorType = this.generateColorType(this.playerColorType);
	}

	generateColorType(typeToExclude) {
		let types = COLOR_TYPES.filter(type => type !== typeToExclude);
		return getRandomValueFromArray(types);
	}

}
