'use strict';

import { DOM_ELEMENT_ID } from '../utilities/constants/ui.constants';

import { ElementHandler } from '../utilities/element-handler';
import { Loader } from '../components/loader/loader';

export class Interface {

    constructor() {}

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
        Loader.display();
    }

    hideLoader() {
        Loader.hide();
    }

}
