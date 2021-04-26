'use strict';
import { AppLoaderHandler } from '../app-loader-handler';
import { ElementHandler } from '../../ui-elements/element-handler';



export class Page {

  constructor() {
   // console.log('Page');
  }

  get mainContainer() {
    return document.getElementById('main-content');
  }

  // get gameSettingsAllowed() {
  //   return true;
  // }

  init() {
    AppLoaderHandler.display();
    //console.log("init page");
    const mainContainer = this.mainContainer;
    if (mainContainer) {
      ElementHandler.clearContent(mainContainer);
      this.renderPage(mainContainer);
      AppLoaderHandler.hide();
    }
  }

  renderPage(mainContainer) {
    const fragment = document.createDocumentFragment();
    mainContainer.append(fragment);
  }

}
