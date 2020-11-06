"use strict";

import { TYPOGRAPHY } from "./constants/typography.constants";
import { ElementHandler } from "./element-handler";

export class ElementGenerator {

	static generateContainer(styleClasses, elementId) {
        const container = document.createElement("div");
        if (styleClasses && styleClasses.length) {
            container.className = styleClasses.join(TYPOGRAPHY.space);
        }
        if (elementId) {
            ElementHandler.setID(container, elementId);
        }
		return container;
	}

	static generateButton(params, action) {
		params = { ...params };

		const button = document.createElement("button");
		button.type = "button";

		button.addEventListener(params.actionType, action);
		delete params.actionType;

		ElementHandler.setParams(button, params);
		return button;
	}

}
