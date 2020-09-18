'use strict';
import { ElementHandler } from '../shared/ui-utils/ElementHandler';
import { MainContainerID } from '../shared/ui-utils/ui.constants';
import { Loader } from '../shared/ui-utils/loader/Loader';

export class Interface {

   constructor(interfaceActionHandler) {
      this.interfaceActionHandler = interfaceActionHandler;
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
