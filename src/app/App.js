"use strict";
import { OnlineConnection } from "./online-connection/online-connection";

// import { NOTIFICATION_MESSAGE } from "./components/toast-notification/toast-notification.constants";


// import { HeaderActionsController } from "./controllers/header-actions-controller/header-actions-controller";
import { Modal } from "./components/modal/modal";

import { LocalStorageHelper } from "./_utils/local-storage-helper";
import { User } from "./_models/user";
import { PageType } from "./_enums/page-type.enum";
import { GameType } from "GameEnums";
// import { CONFIRMATION } from "./components/modal/modal.constants";
// import { Page } from "./pages/page";

import { PageLoader } from "./pages/page-loader";
import { SettingsController } from "./controllers/settings-controller/settings-controller";
import { LoggoutButton } from "./components/loggout-button/loggout-button";
import {
  InvitationsController
} from "./controllers/invitations-controller/invitations-controller";
import { OnlineIndicatorController } from "./controllers/online-indicator-controller/online-indicator-controller";

export class App {
  #page;
  #PageController;
  #SettingsController;
  #InvitationsController;
  #OnlineIndicator;

  constructor() {

    self.modal = new Modal();

    self.user = undefined;

    self.onlineConnection = new OnlineConnection();
    self.onlineConnection.onUserUpdate = this.#onUserUpdate.bind(this);
    self.onlineConnection.onError = this.#onConnectionError.bind(this);
    self.onlineConnection.onRoomOpened = this.#onPlayGame.bind(this);

    this.#SettingsController = new SettingsController();
    this.#PageController = undefined;

    this.#InvitationsController = undefined;
    this.#OnlineIndicator = undefined;

    //document event listeners
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
    if (this.#PageController) {
      this.#PageController.onConnectionError(errorType);
    }
  }

  #onLoggout() {
    console.log("onLoggout");
    if (this.#PageController) {
      this.#PageController.onDestroy();
      this.#PageController = undefined;
    }

    if (self.onlineConnection.live) {
      console.log("on connection loggout");
      return;
    }


    LocalStorageHelper.remove("username");
    self.user = undefined;
    this.#onPageInit();
  }


  #previouslyUsedUsername() {
    const username = LocalStorageHelper.retrieve("username");
    if (username) {
      self.onlineConnection.establishConnection(username);
    }
    return Promise.resolve(username);
  }

  #loadInterfaceController(pageType, onPageChange = this.#onHomeNavigation.bind(this)) {
    this.#page = pageType;
    return PageLoader.load(this.#page, onPageChange).then(pageController => {
      this.#PageController = pageController;
      this.#SettingsController.setGameSettingsDisplay(this.#PageController.gameSettingsAllowed);
      return;
    });
  }

  #setHeaderForUser() {
    if (!this.#OnlineIndicator) {
      this.#OnlineIndicator = new OnlineIndicatorController();
    }
    if (!this.#InvitationsController) {
      this.#InvitationsController = new InvitationsController();
    }
    LoggoutButton.generate(this.#onLoggout.bind(this));
  }

  #resetHeader() {
    LoggoutButton.remove();
    if (this.#InvitationsController) {
      this.#InvitationsController.onDestroy();
    }
    if (this.#OnlineIndicator) {
      this.#OnlineIndicator.onDestroy();
    }
  }

  #onPageInit() {
    if (!self.user) {
      this.#resetHeader();
      this.#onJoinNavigation();
      return;
    }
    this.#setHeaderForUser();
    this.#onHomeNavigation();
  }

  #onJoinNavigation() {
    this.#loadInterfaceController(PageType.JoinPage).then(() => {
      return this.#previouslyUsedUsername();
    }).then(username => this.#PageController.init(username));
  }

  #onHomeNavigation() {
    this.#loadInterfaceController(PageType.HomePage, this.#onGameTypeSelected.bind(this)).then(() => {
      this.#PageController.init();
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
      this.#PageController.init();
    });
  }

  #onGameSetUpNavigation(gameType) {
    this.#loadInterfaceController(PageType.GameSetupPage).then(() => {
      this.#PageController.init(gameType, this.#onPlayGame.bind(this));
    });
  }

  #onPlayGame(gameParams) {
    console.log(JSON.stringify(gameParams));
    this.#loadInterfaceController(PageType.GamePage).then(() => {
      this.#PageController.init(gameParams, this.#onGameSetUpNavigation.bind(this));
    });
  }

}
