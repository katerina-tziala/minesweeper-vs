"use strict";

import { ElementHandler } from "../../../utilities/element-handler";
import { ElementGenerator } from "../../../utilities/element-generator";

import { DOM_ELEMENT_CLASS } from "./state-loader.constants";

export class StateLoader {

    static renderStateLoader(iconSizeClass = DOM_ELEMENT_CLASS.loaderIconBasic) {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.stateLoader]);
        ElementHandler.hide(container);
        const loaderIcon = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.loaderIcon, iconSizeClass]);
        container.append(loaderIcon);
        return container;
    }

    static getLoaderContainer(parentContainer) {
        return parentContainer.querySelector(`.${DOM_ELEMENT_CLASS.stateLoader}`);
	}

	static display(parentContainer) {
        const loaderContainer = this.getLoaderContainer(parentContainer);
        if (loaderContainer && loaderContainer.childNodes.length) {
            this.startSpinner(loaderContainer.childNodes[0]);
            ElementHandler.display(loaderContainer);
        }
	}

	static hide(parentContainer) {
        const loaderContainer = this.getLoaderContainer(parentContainer);
        if (loaderContainer && loaderContainer.childNodes.length) {
            this.stopSpinner(loaderContainer.childNodes[0]);
            ElementHandler.hide(loaderContainer);
        }
	}

	static stopSpinner(spinner) {
		ElementHandler.removeStyleClass(spinner, DOM_ELEMENT_CLASS.spin);
	}

	static startSpinner(spinner) {
		ElementHandler.addStyleClass(spinner, DOM_ELEMENT_CLASS.spin);
	}

}
