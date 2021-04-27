'use strict';
import { AppLoaderHandler } from './app-loader-handler';
import OnlineConnection from './state-controllers/online-connection/online-connection';
import PageLoaderService from './pages/page-loader.service';
import { PageType } from './pages/page-type.enum';
import { LocalStorageHelper } from 'UTILS';

export class App {
  #onlineConnection;
  #pageloaderService;
  #pageController;

  constructor() {
    this.#initOnlineConnection();
    this.#initPageController();
    this.#init();
    //AppLoaderHandler.hide();
  }

  #initPageController() {
    this.#pageloaderService = PageLoaderService.getInstance();
    this.#pageloaderService.onPageChanged = (Page) => this.#pageController = new Page();
  }

  #initOnlineConnection() {
    this.#onlineConnection = OnlineConnection.getInstance();
    this.#onlineConnection.onConnectionError = this.#onConnectionError.bind(this);
    this.#onlineConnection.onMessage = this.#onMessage.bind(this);
    this.#onlineConnection.onErrorMessage = this.#onErrorMessage.bind(this);
  }

  #init() {
    const user = LocalStorageHelper.user;
    if (user) {
      this.#onlineConnection.establishConnection(user);
    } else {
      this.#pageloaderService.nextPage(PageType.JoinPage);
    }
  }


  #onConnectionError() {
    if (this.#pageController) {
      this.#pageController.onConnectionError();
    } else {
      console.log("onConnectionError not handled from page");
      this.#pageloaderService.nextPage(PageType.JoinPage);
    }
  }

  #onMessage(data) {
    if (this.#pageController) {
      this.#pageController.onMessage(data);
    } else {
      console.log("onMessage not handled from page");
      console.log(data);
    }
  }

  #onErrorMessage(data) {
    if (this.#pageController) {
      this.#pageController.onErrorMessage(data);
    } else {
      console.log("onErrorMessage not handled from page");
      console.log(data);
      this.#pageloaderService.nextPage(PageType.JoinPage);
    }
  }

}
