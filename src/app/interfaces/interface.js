'use strict';
import { ElementHandler } from '../ui-utils/element-handler';
import { MainContainerID } from '../ui-utils/ui.constants';
import { Loader } from '../components/loader/loader';

export class Interface {

    constructor() {
      
    }

    get mainContainer() {
        return ElementHandler.getElementByID(MainContainerID);
    }

    getClearedMainContainer() {
        return this.mainContainer.then(mainContainer => {
            ElementHandler.clearElementContent(mainContainer);
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
