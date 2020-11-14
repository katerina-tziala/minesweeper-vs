"use strict";

import { DOM_ELEMENT_ID } from "~/_constants/ui.constants";
import { ElementHandler } from "HTML_DOM_Manager";

export class Page {

	constructor() { }

	get mainContainer() {
		return ElementHandler.getByID(DOM_ELEMENT_ID.main);
	}

	getClearedMainContainer() {
		return this.mainContainer.then(mainContainer => {
			ElementHandler.clearContent(mainContainer);
			return mainContainer;
		});
	}

	displayLoader() {
		self.appLoader.display();
	}

	hideLoader() {
		self.appLoader.hide();
	}

	onConnectionError(errorMessage) {
		self.toastNotifications.show(errorMessage);
	}

}
