'use strict';
import { AppLoaderHandler } from '../app-loader-handler';
import { ElementHandler } from 'UI_ELEMENTS';
import PageLoaderService from './page-loader.service';
import { PageType } from './page-type.enum';
import { OnlineConnection } from 'ONLINE_CONNECTION';

export class Page {
  #pageloaderService;

  constructor() {
    this.#pageloaderService = PageLoaderService.getInstance();
    this.onlineConnection = OnlineConnection.getInstance();
  }

  get mainContainer() {
    return document.getElementById('main-content');
  }

  init() {
    this.displayLoader();
    const mainContainer = this.mainContainer;
    if (mainContainer) {
      ElementHandler.clearContent(mainContainer);
      this.renderPage(mainContainer);
      this.hideLoader();
    }
  }

  renderPage(mainContainer) {
    const fragment = document.createDocumentFragment();
    mainContainer.append(fragment);
  }

  displayLoader() {
    AppLoaderHandler.display();
  }

  hideLoader() {
    AppLoaderHandler.hide();
  }

  onConnectionError() {
    console.log("onConnectionError page");
    return;
  }

  onMessage(data) {
    console.log("onMessage page");
    console.log(data);
    return;
  }

  onErrorMessage() {
    console.log("onErrorMessage page");
    console.log(data);
    return;
  }

  onChangePage(nextPage = PageType.HomePage) {
    this.#pageloaderService.nextPage(nextPage);
  }
}
