"use strict";

import { COLOR_TYPES, DOM_ELEMENT_CLASS } from "../../utilities/constants/ui.constants";


export class SettingsOptionsHelper {
	



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
