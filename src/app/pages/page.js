"use strict";

import { DOM_ELEMENT_ID } from "../_utils/constants/ui.constants";
import { ElementHandler } from "../_utils/element-handler";

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
