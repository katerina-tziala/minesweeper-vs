"use strict";

import { ElementHandler } from "../../utilities/element-handler";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./loader.constants";

export class Loader {

	static get loader() {
		return ElementHandler.getByID(DOM_ELEMENT_ID.loader);
	}
	static get spinner() {
		return ElementHandler.getByID(DOM_ELEMENT_ID.spinner);
	}

	static display() {
		Loader.startSpinner();
		Loader.displayLoader();
	}

	static hide() {
		Loader.hideLoader();
		Loader.stopSpinner();
	}

	static hideLoader() {
		Loader.loader.then(loader => ElementHandler.hide(loader));
	}

	static displayLoader() {
		Loader.loader.then(loader => ElementHandler.display(loader));
	}

	static stopSpinner() {
		Loader.spinner.then(spinner => ElementHandler.removeStyleClass(spinner, DOM_ELEMENT_CLASS.spin));
	}

	static startSpinner() {
		Loader.spinner.then(spinner => ElementHandler.addStyleClass(spinner, DOM_ELEMENT_CLASS.spin));
	}

}
