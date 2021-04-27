'use strict';
import OnlineConnection from './state-controllers/online-connection/online-connection';
import { MessageInType } from './state-controllers/online-connection/connection.message-in';
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
    //this.#init();
    this.#pageloaderService.nextPage(PageType.JoinPage);
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
      this.#navigateToJoinPage();
    }
  }

  #navigateToJoinPage() {
    this.#pageloaderService.nextPage(PageType.JoinPage);
  }

  #onConnectionError() {
    if (this.#pageController) {
      this.#pageController.onConnectionError();
    } else {
      this.#navigateToJoinPage();
    }
  }

  #onMessage(message) {
    if (this.#pageController) {
      this.#pageController.onMessage(message);
    } else {
      this.#onMessageBeforePageInitialized(message);
    }
  }

  #onErrorMessage(data) {
    if (this.#pageController) {
      this.#pageController.onErrorMessage(data);
    } else {
      this.#navigateToJoinPage();
    }
  }

  #onMessageBeforePageInitialized(message) {
    const { type, data } = message;
    if (type === MessageInType.Joined) {
      LocalStorageHelper.saveUser(data.user);
      LocalStorageHelper.savePeers(data.peers);
      this.#pageloaderService.nextPage(PageType.HomePage);
    }
  }
}
