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
import { setAppTheme } from "~/_utils/theming";
import { AppSettingsModel } from "~/_models/app-settings";

export class App {
  #page;
  constructor() {
    this.interfaceController = undefined;
    this.#initAppSettings();
    //document event listeners
    self.user = new User("kateID", "kate", null);
    self.modal = new Modal();
    self.onlineConnection = new OnlineConnection();

    //this.onGameSetUpNavigation(GameType.Original);
    // this.onGameSetUpNavigation(GameType.Friend);
    // this.onGameSetUpNavigation(GameType.Bot);
    //this.onPlayGame(undefined);

    // this.#onHomeNavigation();
    this.#onJoinNavigation();
  }

  #initAppSettings() {
    const settings = new AppSettingsModel();
    settings.saveLocally();
    setAppTheme();
  }

  #onPageChange(interfaceName) {
    if (!self.user) {
      this.#onJoinNavigation();
      return;
    }
    switch (interfaceName) {
      case PageType.Home:
        this.#onHomeNavigation();
        break;
      default:
        this.#onHomeNavigation();
        break;
    }
  }



  #loadPage(interfaceName) {
    return import(`./pages/${interfaceName}-page/${interfaceName}-page`);
  }

  #onJoinNavigation() {
    this.#loadPage(PageType.Join).then(({ JoinPage }) => {
      this.interfaceController = new JoinPage(this.#onPageChange.bind(this));
      this.#page = PageType.Join;
    });
  }

  #onHomeNavigation() {
    this.#loadPage(PageType.Home).then(({ HomePage }) => {
      this.interfaceController = new HomePage(
        this.#onPageChange.bind(this),
        this.#onGameTypeSelected.bind(this),
      );
      this.#page = PageType.Home;
    });
  }

  #onGameTypeSelected(gameType) {
    if (gameType === GameType.Online) {
      console.log("lobby");
      // this.onLobbyNavigation();
      return;
    }
    this.#onGameSetUpNavigation(gameType);
  }

  #onGameSetUpNavigation(gameType) {
    console.log("to game set up from page:", this.#page);
    this.#loadPage(PageType.GameSetup).then(({ GameSetupPage }) => {
      this.interfaceController = new GameSetupPage(
        this.#onPageChange.bind(this),
        this.#onPlayGame.bind(this),
        this.#page,
        gameType);
      this.#page = PageType.GameSetup;
    });
  }

  #onPlayGame(gameParams) {


    console.log(JSON.stringify(gameParams));

    this.#loadPage(PageType.Game).then(({ GamePage }) => {
      this.interfaceController = new GamePage(this.#onPageChange.bind(this),
        gameParams,
        this.#onGameSetUpNavigation.bind(this));
      this.#page = PageType.Game;
    });
  }


  /////////////////////////////////////////
  // onConnectionError(event) {
  //   console.log("onConnectionError from app");
  //   console.log(event);

  //   this.interfaceController.onConnectionError(
  //     NOTIFICATION_MESSAGE.connectionError,
  //   );
  //   // if (this.user) {
  //   // 	console.log("onConnectionError");
  //   // } else {// login error
  //   // 	console.log("login error");
  //   // 	self.toastNotifications.show(NOTIFICATION_MESSAGE.connectionError);
  //   // 	self.appLoader.hide();
  //   // }
  // }


  // setInterface(interfaceName) {
  //   switch (interfaceName) {
  //     case PageType.Home:
  //       this.onHomeNavigation();
  //       break;
  //     default:
  //       this.loadInterfaceController(PageType.Join).then(({ JoinPage }) => {
  //         this.interfaceController = new JoinPage();
  //       });
  //       break;
  //   }
  // }


  // onConnectionClose(event) {
  //   console.log("onConnectionClose from app");
  //   console.log(event);
  // }

  // onConnectionMessage(message) {
  //   console.log("onConnectionMessage from app");
  //   switch (message.type) {
  //     case "username-in-use":
  //       this.interfaceController.onConnectionError(
  //         NOTIFICATION_MESSAGE.usernameInUse,
  //       );
  //       break;
  //     case "broadcast":
  //       this.handleConnectionBroadcast(message.data);
  //       break;
  //     default:
  //       console.log("onConnectionMessage");
  //       console.log(message);
  //       break;
  //   }
  // }

  // handleConnectionBroadcast(data) {
  //   if (self.user) {
  //     console.log("user is here");
  //     console.log("--- broadcast -----");
  //     console.log(data);
  //   } else {
  //     // user just joined
  //     self.user = this.generateUser(data.user);

  //     self.onlineConnection.peers = data.peers
  //     LocalStorageHelper.save("username", self.user.username);
  //     this.setInterface("home");
  //   }
  // }



  // generateUser(userData) {
  //   return new User(userData.id, userData.username, userData.gameRoomId);
  // }



  // onHomeNavigation() {
  //   this.loadInterfaceController(PageType.Home).then(({ HomePage }) => {
  //     this.interfaceController = new HomePage(
  //       this.onGameTypeSelected.bind(this),
  //     );
  //   });
  // }







  // onLobbyNavigation() {
  //   // console.log("onLobbyNavigation");
  //   this.loadInterfaceController(PageType.Lobby).then(({ LobbyPage }) => {
  //     this.interfaceController = new LobbyPage(this.onPlayGame.bind(this));
  //   });
  // }
}
