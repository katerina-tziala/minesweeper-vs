"use strict";
import { DOM_ELEMENT_ID } from "~/_constants/ui.constants";
import { ElementHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";

export class Page {
  #onPageChange;

  constructor(onPageChange) {
    // self.onlineConnection.onUserUpdate = this.onUserUpdate.bind(this);
    // self.onlineConnection.onError = this.onConnectionError.bind(this);

    this.#onPageChange = onPageChange;
    this.displayLoader();
  }

  get gameSettingsAllowed() {
    return true;
  }

  get mainContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.main);
  }

  init() {
    this.displayLoader();
    this.getClearedMainContainer().then((mainContainer) => {
      this.renderPage(mainContainer);
    });
  }

  getClearedMainContainer() {
    return this.mainContainer.then((mainContainer) => {
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

  renderPage(mainContainer) {
    const fragment = document.createDocumentFragment();
    mainContainer.append(fragment);
  }

  // onLogout() {
  //   console.log("onLogout from page");
  //   console.log(self.user);
  //   console.log(self.onlineConnection.live);
  //   console.log("on connection loggout");
  //   //   if (this.page === PageType.Game) {
  //   //     console.log("loggout in game?");
  //   //     return;
  //   //   }
  //   LocalStorageHelper.remove("username");
  //   self.user = undefined;
  //   this.onPageChange();
  // }

  onConnectionError(errorType) {
    console.log("onConnectionError from page");
    console.log(errorType);

  }

  onUserUpdate() {
    console.log("onUserUpdate from page");
  }

  onPageChange(params) {
    if (this.#onPageChange) {
      this.#onPageChange(params);
    }
  }



}
