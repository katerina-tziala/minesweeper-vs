'use strict';
import { OnlineConnection, MessageErrorType } from 'ONLINE_CONNECTION';
import PageLoaderService from './pages/page-loader.service';
import { PageType } from './pages/page-type.enum';
import { LocalStorageHelper } from 'UTILS';

export class App {
  #onlineConnection;
  #pageloaderService;
  #pageController;

  constructor() {
    this.#onlineConnection = OnlineConnection.getInstance();

    this.#initPageController();
    //  this.#init();
    // this.#pageloaderService.nextPage(PageType.JoinPage);

    // this.#pageloaderService.nextPage(PageType.HomePage);
  }

  #initPageController() {
    this.#pageloaderService = PageLoaderService.getInstance();
    this.#pageloaderService.onPageChanged = (Page) => {
      // console.log('page changed');
      this.#pageController = new Page();
    };
  }

  #setConnectionListeners() {
    this.#onlineConnection.onConnectionError = this.#onConnectionError.bind(this);
    this.#onlineConnection.onMessage = this.#onMessage.bind(this);
    this.#onlineConnection.onErrorMessage = this.#onErrorMessage.bind(this);
  }

  #init() {
    const user = LocalStorageHelper.user;
    user ? this.#connect(user.username) : this.#navigateToJoinPage();
  }



  #connect(username) {
    this.#onlineConnection.establishConnection(username).then(() => {
      this.#setConnectionListeners();
      this.#pageloaderService.nextPage(PageType.HomePage);
    }).catch(() => this.#navigateToJoinPage());
  }

  #navigateToJoinPage() {
    this.#pageloaderService.nextPage(PageType.JoinPage);
  }

  #onConnectionError() {
    if (this.#pageController) {
      this.#pageController.onConnectionError();
    } else {
      console.log("on connection error no page handler");
    }
  }

  #onMessage(message) {
    if (this.#pageController) {
      this.#pageController.onMessage(message);
    } else {
      console.log("on connection message no page handler");
    }
  }

  #onErrorMessage(data) {
    if (this.#pageController) {
      this.#pageController.onErrorMessage(data);
    } else {
      console.log("on connection error message no page handler");
    }
  }

}
