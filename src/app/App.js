'use strict';
import { OnlineConnection, MessageErrorType } from 'ONLINE_CONNECTION';
import PageLoaderService from './pages/page-loader.service';
import { PageType } from './pages/page-type.enum';
import { LocalStorageHelper } from 'UTILS';
import AppUserService from './state-controllers/app-user.service';

export class App {
  #onlineConnection;

  #pageController;


  #appUserService;
  #pageloaderService;


  constructor() {
    this.#appUserService = AppUserService.getInstance();
    this.#pageloaderService = PageLoaderService.getInstance();
    this.#onlineConnection = OnlineConnection.getInstance();

    this.#pageloaderService.onPageChanged = (Page) => {
      this.#pageController = Page;
    };

    this.#init();

    // this.#pageloaderService.nextPage(PageType.JoinPage);
    // this.#pageloaderService.nextPage(PageType.HomePage);
    // this.#pageloaderService.nextPage(PageType.GamePage);
  }

  // window.onhashchange = this.locationHashChanged.bind(this);
  // locationHashChanged(event) {
  //   console.log(event);
  //   if (location.hash === '#cool-feature') {
  //     console.log("You're visiting a cool feature!");
  //   }
  // }

  #init() {
    const username = this.#appUserService.username;
    username ? this.#connect(username) : this.#navigateToJoinPage();
  }

  #connect(username) {
    this.#onlineConnection.establishConnection(username).then(() => {
      this.#pageloaderService.nextPage(PageType.HomePage);
    }).catch(() => this.#navigateToJoinPage());
  }

  #navigateToJoinPage() {
    this.#pageloaderService.nextPage(PageType.JoinPage);
  }

}
