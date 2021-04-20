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
import { AppSettingsModel } from "~/_models/app-settings";
import { SettingsController } from "./controllers/settings-controller/settings-controller";

export class App {
  #page;
  constructor() {
    this.interfaceController = undefined;
   // this.#initAppSettings();
    //document event listeners
    self.user = undefined;
    self.modal = new Modal();
    self.onlineConnection = new OnlineConnection();


    this.settingsController = new SettingsController();
    //this.#onPageInit();
    self.user = new User("kate", "katerina");
    this.#onJoinNavigation();
  }


  



  #onPageInit() {
    if (!self.user) {
      this.#onJoinNavigation();
      return;
    }
    this.#onHomeNavigation();
  }

  #loadPage(interfaceName) {
    return import(`./pages/${interfaceName}-page/${interfaceName}-page`);
  }

  #onJoinNavigation() {
    this.#loadPage(PageType.Join).then(({ JoinPage }) => {
      this.interfaceController = new JoinPage(this.#onPageInit.bind(this));
      console.log(this.interfaceController.gameSettingsAllowed);
      this.#page = PageType.Join;
    });
  }

  #onHomeNavigation() {
    this.#loadPage(PageType.Home).then(({ HomePage }) => {
      this.interfaceController = new HomePage(
        this.#onPageInit.bind(this),
        this.#onGameTypeSelected.bind(this),
      );
      this.#page = PageType.Home;
    });
  }

  #onGameTypeSelected(gameType) {
    if (gameType === GameType.Online) {
      this.#onLobbyNavigation();
      return;
    }
    this.#onGameSetUpNavigation(gameType);
  }

  #onGameSetUpNavigation(gameType) {
    console.log("to game set up from page:", this.#page);
    this.#loadPage(PageType.GameSetup).then(({ GameSetupPage }) => {
      this.interfaceController = new GameSetupPage(
        this.#onPageInit.bind(this),
        this.#onPlayGame.bind(this),
        this.#page,
        gameType);
      this.#page = PageType.GameSetup;
    });
  }

  #onPlayGame(gameParams) {
    console.log(JSON.stringify(gameParams));
    this.#loadPage(PageType.Game).then(({ GamePage }) => {
      this.interfaceController = new GamePage(this.#onPageInit.bind(this),
        gameParams,
        this.#onGameSetUpNavigation.bind(this));
      this.#page = PageType.Game;
    });
  }


  #onLobbyNavigation() {
    this.#loadPage(PageType.Lobby).then(({ LobbyPage }) => {
      this.interfaceController = new LobbyPage(
        this.#onPageInit.bind(this),
        this.#onPlayGame.bind(this),
      );
      this.#page = PageType.Lobby;
    });
  }
}
