"use strict";
import { OnlineConnection } from "./online-connection/online-connection";

import { NOTIFICATION_MESSAGE } from "./components/toast-notification/toast-notification.constants";


import { HeaderActionsController } from "./controllers/header-actions-controller/header-actions-controller";
import { Modal } from "./components/modal/modal";

import { LocalStorageHelper } from "./_utils/local-storage-helper";

import { User } from "./_models/user";
import { PageType } from "./_enums/page-type.enum";
import { GameType } from "GameEnums";
import { CONFIRMATION } from "./components/modal/modal.constants";
import { Page } from "./pages/page";
// import { setAppTheme } from "~/_utils/theming";
import { PageLoader } from "./pages/page-loader"; ''
import { AppSettingsModel } from "~/_models/app-settings";
import { SettingsController } from "./controllers/settings-controller/settings-controller";

export class App {
  #page;
  #pageController;
  #settingsController;

  constructor() {

    this.#settingsController = new SettingsController();
    this.#pageController = undefined;
    // this.#initAppSettings();
    //document event listeners
    self.user = undefined;
    self.modal = new Modal();
    self.onlineConnection = new OnlineConnection();
    self.onlineConnection.onUserUpdate = this.#onUserUpdate.bind(this);
    self.onlineConnection.onError = this.#onConnectionError.bind(this);
    self.onlineConnection.onRoomOpened = this.#onPlayGame.bind(this);
    self.user = new User("kate", "katerina");
    this.#onPageInit();
    // 
    // this.#onJoinNavigation();
  }


  #onUserUpdate() {
    console.log("onUserUpdate");
  }

  #onConnectionError(errorType) {
    console.log("onConnectionError from app");
    if (this.#pageController) {
      this.#pageController.onConnectionError(errorType);
    }
  }

  #previouslyUsedUsername() {
    const username = LocalStorageHelper.retrieve("username");
    if (username) {
      self.onlineConnection.establishConnection(username);
    }
    return Promise.resolve(username);
  }

  #loadInterfaceController(pageType) {
    this.#page = pageType;
    return PageLoader.load(this.#page, this.#onPageInit.bind(this)).then(pageController => {
      this.#pageController = pageController;
      this.#settingsController.setGameSettingsDisplay(this.#pageController.gameSettingsAllowed);
      return;
    });
  }

  #onPageInit() {
    if (!self.user) {
      this.#onJoinNavigation();
      return;
    }
    this.#onHomeNavigation();
  }

  #onJoinNavigation() {
    this.#loadInterfaceController(PageType.JoinPage, this.#onPageInit.bind(this)).then(() => {
      return this.#previouslyUsedUsername();
    }).then(username => this.interfaceController.init(username));
  }

  #onHomeNavigation() {
    this.#loadInterfaceController(PageType.HomePage).then(() => {
      this.#pageController.init(this.#onGameTypeSelected.bind(this));
    });
  }

  #onGameTypeSelected(gameType) {
    if (gameType === GameType.Online) {
      this.#onLobbyNavigation();
      return;
    }
    this.#onGameSetUpNavigation(gameType);
  }

  #onLobbyNavigation() {
    this.#loadInterfaceController(PageType.LobbyPage).then(() => {
      this.#pageController.init();
    });
  }

  #onGameSetUpNavigation(gameType) {
    this.#loadInterfaceController(PageType.GameSetupPage).then(() => {
      this.#pageController.init(gameType, this.#onPlayGame.bind(this));
    });
  }

  #onPlayGame(gameParams) {
    console.log(JSON.stringify(gameParams));
    this.#loadInterfaceController(PageType.GamePage).then(() => {
      this.#pageController.init(gameParams, this.#onGameSetUpNavigation.bind(this));
    });
  }

}
