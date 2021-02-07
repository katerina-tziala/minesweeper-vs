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

  constructor() {
    this.#initAppSettings();

    this.interfaceController = undefined;
    
    self.modal = new Modal();
    //document event listeners
    
    
    self.onlineConnection = new OnlineConnection();


    self.headerActionsController = new HeaderActionsController();
    self.headerActionsController.generateView();

    // self.onlineConnection = new OnlineConnection({
    //   onError: this.onConnectionError.bind(this),
    //   onClose: this.onConnectionClose.bind(this),
    //   onMessage: this.onConnectionMessage.bind(this),
    // });
    // self.user = undefined;
    // self.peers = [];
    // self.user = new User("kateID", "kate", null);
    // // this.setInterface(PageType.Home);
    //  //this.setInterface();
    // this.onHomeNavigation();
    //this.onLobbyNavigation();
    //
    //this.onGameSetUpNavigation(GameType.Original);
    // this.onGameSetUpNavigation(GameType.Friend);
    // this.onGameSetUpNavigation(GameType.Bot);
    //this.onPlayGame(undefined);
 
    
    this.#onJoinNavigation();
  }

  #initAppSettings() {
    const settings = new AppSettingsModel();
    settings.saveLocally();
    setAppTheme();
  }



  #onLogout() {

    if (this.page === PageType.Game) {
      console.log("loggout in game?");
      return;
    }

    console.log(this.page);
    console.log("om connection loggout");
    console.log("#onLogout");

    LocalStorageHelper.remove("username");
    self.user = undefined;


    this.#onJoinNavigation();
  }





  #loadPage(interfaceName) {
    this.page = interfaceName;
    return import(`./pages/${interfaceName}-page/${interfaceName}-page`);
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


  #onJoinNavigation() {
    this.#loadPage(PageType.Join).then(({ JoinPage }) => {
      this.interfaceController = new JoinPage(this.#onPageChange.bind(this));
    });
  }

  #onHomeNavigation() {
    this.#loadPage(PageType.Home).then(({ HomePage }) => {
      this.interfaceController = new HomePage(
        this.#onGameTypeSelected.bind(this),
      );
    });
  }

  #onGameTypeSelected(gameType) {
    if (gameType === GameType.Online) {
      console.log("lobby");
      // this.onLobbyNavigation();
      return;
    }
    console.log("onGameSetUpNavigation");
    // this.onGameSetUpNavigation(gameType);
  }


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

  // onGameSetUpNavigation(gameType) {
  //   this.loadInterfaceController(PageType.GameSetup).then(
  //     ({ GameSetupPage }) => {
  //       this.interfaceController = new GameSetupPage(
  //         gameType,
  //         this.onHomeNavigation.bind(this),
  //         this.onPlayGame.bind(this),
  //       );
  //     },
  //   );
  // }



  // onPlayGame(game) {
  //   this.loadInterfaceController(PageType.Game).then(({ GamePage }) => {
  //     this.interfaceController = new GamePage(
  //       game,
  //       this.onHomeNavigation.bind(this),
  //       this.onGameSetUpNavigation.bind(this),
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
