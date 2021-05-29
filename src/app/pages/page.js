'use strict';
import { ElementHandler } from 'UI_ELEMENTS';
import PageLoaderService from './page-loader.service';
import { PageType } from './page-type.enum';
import { OnlineConnection } from 'ONLINE_CONNECTION';
import AppUserService from '../state-controllers/app-user.service';
export class Page {
  #pageloaderService;
  appUserService;

  constructor() {
    this.appUserService = AppUserService.getInstance();
    this.#pageloaderService = PageLoaderService.getInstance();
    this.onlineConnection = OnlineConnection.getInstance();
    this.#setConnectionListeners();
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
    this.#pageloaderService.displayLoader();
  }

  hideLoader() {
    this.#pageloaderService.hideLoader();
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

  onChangePage(nextPage = PageType.HomePage, params) {
    this.#pageloaderService.nextPage(nextPage, params);
  }

  #setConnectionListeners() {
    this.onlineConnection.onConnectionError = this.onConnectionError.bind(this);
    this.onlineConnection.onMessage = this.onMessage.bind(this);
    this.onlineConnection.onErrorMessage = this.onErrorMessage.bind(this);
  }

  onConnectionError() {
    console.log("on onConnectionError from Page");
  }

  onMessage(message) {
    console.log("on connection message from Page");
    console.log(message);
  }

  onErrorMessage(data) {
    console.log("on connection onErrorMessage from Page");
    console.log(data);
  }
}
