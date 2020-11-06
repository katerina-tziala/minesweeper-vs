"use strict";

import { COLOR_TYPES, DOM_ELEMENT_CLASS } from "../../utils/constants/ui.constants";
import { MINE_TYPE} from "../../utils/enums/app-settings.enums";

export class SettingsOptionsHelper {

	static getMineTypeOptions() {
		const options = [];
		Object.values(MINE_TYPE).forEach(type => {
			options.push({
				value: type,
				innerHTML: `<div class="mine-type-option mine-type-option--${type}"></div>`
			});
		});
		return options;
	}

	static getAllowedColorOptions(colorToExclude) {
		const colors = COLOR_TYPES.filter(color => color !== colorToExclude);
		const options = [];
		colors.forEach(color => {
			options.push({
				value: color,
				innerHTML: `<div class="game-color-option ${DOM_ELEMENT_CLASS.colorType}${color}"></div>`
			});
		});
		return options;
	}

}
