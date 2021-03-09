"use strict";
import { OnlineConnection } from "./online-connection/online-connection";
import { replaceStringParameter } from "~/_utils/utils";

import { Modal } from "./components/modal/modal";
import { LocalStorageHelper } from "./_utils/local-storage-helper";
import { User } from "./_models/user";
import { PageType } from "./_enums/page-type.enum";
import { GameType } from "GameEnums";

import { NOTIFICATION_MESSAGE } from "./components/toast-notification/toast-notification.constants";

// import { CONFIRMATION } from "./components/modal/modal.constants";
import { CONNECTION_CONFIG, TESTGAME, INVITATIONSTEST } from "./online-connection/connection-config.constants";
import { PageLoader } from "./pages/page-loader";
import { HeaderController } from "./controllers/header-controller/header-controller";
import { AppHelper } from "./app-helper";
export class App {
  #page;
  #PageController;
  #HeaderController;
  #onlineConnectionUpdate;

  constructor() {
    self.modal = new Modal();




    this.#onlineConnectionUpdate = {
      "user-joined": this.#onUserJoined.bind(this),
      "user-update": this.#onUserUpdate.bind(this),
      "peers-update": this.#onPeersUpdate.bind(this),
      "game-room-opened": this.#onRoomOpened.bind(this),
      "game-invitation": this.#onInvitationReceived.bind(this),
      "invitation-denied": this.#onInvitationDenied.bind(this),
    }

    self.user = undefined;

    // self.user = new User("kate", "katerina");
    // self.user.invitations = [INVITATIONSTEST[0]];

    self.onlineConnection = new OnlineConnection(this.#onlineConnectionUpdate);
    // self.onlineConnection.onUserJoined = this.#onUserJoined.bind(this);
    // self.onlineConnection.onUserUpdate = this.#onUserUpdate.bind(this);
    self.onlineConnection.onError = this.#onConnectionError.bind(this);
    // self.onlineConnection.onRoomOpened = this.#onPlayGame.bind(this);
    this.#HeaderController = new HeaderController(this.#onLoggout.bind(this), this.#onHomeNavigation.bind(this));
    //document event listeners



    this.#onPageInit();
  }

  #onUserJoined(data) {
    AppHelper.updateUser(data);
    AppHelper.updateUserPeers(data.peers);

    if (this.#page === PageType.JoinPage) {
      this.#onPageInit();
      return;
    }

    console.log("onUserJoined from page:");
    // console.log(self.user);
    // console.log(this.#page);
  }

  #onUserUpdate(data) {
    AppHelper.updateUser(data);
    console.log("onUserUpdate");
    // console.log(self.user);
    // console.log(this.#page);
    this.#onPeersUpdate(data);
  }

  #onPeersUpdate(data) {
    if (!data.peers) {
      return;
    }
    AppHelper.updateUserPeers(data.peers);
    this.#HeaderController.onPeersUpdate();
    if (this.#PageController && this.#page === PageType.LobbyPage) {
      this.#PageController.onPeersUpdate();
    }
  }

  #onRoomOpened(data) {
    AppHelper.updateUser(data);
    this.#onPlayGame(data.game);
  }

  #onInvitationReceived(data) {
    const invitation = data.invitation;
    self.user.addInvitation(invitation);
    this.#HeaderController.onInvitationReceived(invitation);
  }

  #onInvitationDenied(data) {
    const invitation = data.invitation;
    const notificationMessage = NOTIFICATION_MESSAGE.invitationDenied;
    notificationMessage.content = [replaceStringParameter(notificationMessage.content[0], invitation.recipient.username)]
    self.toastNotifications.show(NOTIFICATION_MESSAGE.invitationDenied);
    this.#destroyGame(invitation.game.id);
  }


  #onConnectionError(errorType) {
    console.log("onConnectionError from app");
    if (this.#PageController) {
      this.#PageController.onConnectionError();

    }
  }

  #destroyPageController() {
    if (this.#PageController) {
      this.#PageController.onDestroy();
      this.#PageController = undefined;
    }
  }

  #onLoggout() {
    self.onlineConnection.disconnect();
    this.#destroyPageController();
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

  #setGameSettingsDisplay() {
    const gameSettingsDisplayed = this.#PageController ? this.#PageController.gameSettingsAllowed : false;
    this.#HeaderController.setGameSettingsDisplay(gameSettingsDisplayed);
  }

  #loadPageController(pageType, onPageChange = this.#onHomeNavigation.bind(this)) {
    this.#destroyPageController();
    this.#HeaderController.setNavigation();
    this.#page = pageType;
    return PageLoader.load(this.#page, onPageChange).then(pageController => {
      this.#PageController = pageController;
      this.#setGameSettingsDisplay();
      return;
    });
  }

  #onPageInit() {
    this.#HeaderController.init();
    if (!self.user) {
      this.#onJoinNavigation();
      return;
    }
    this.#onHomeNavigation();
  }

  #onJoinNavigation() {
    this.#loadPageController(PageType.JoinPage).then(() => {
      return this.#previouslyUsedUsername();
    }).then(username => this.#PageController.init(username));
  }

  #onHomeNavigation() {
    this.#loadPageController(PageType.HomePage, this.#onGameTypeSelected.bind(this)).then(() => {
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
    this.#HeaderController.setHomeNavigation();
    this.#loadPageController(PageType.LobbyPage).then(() => {
      this.#PageController.init();
    });
  }

  #onGameSetUpNavigation(gameType) {
    this.#loadPageController(PageType.GameSetupPage).then(() => {
      this.#PageController.init(gameType, this.#onPlayGame.bind(this));
    });
  }

  #onPlayGame(gameParams) {
    this.#HeaderController.setHomeNavigation();
   // console.log(JSON.stringify(gameParams));
    this.#loadPageController(PageType.GamePage).then(() => {
      this.#PageController.init(gameParams, this.#onGameSetUpNavigation.bind(this));
    });
  }

  #destroyGame(id) {
    if (this.#PageController && this.#page === PageType.GamePage) {
      const onlineGame = this.#PageController.exitGame(id);
      this.#setPageAfterGameExit(onlineGame);
    }
  }

  #setPageAfterGameExit(onlineGame) {
    if (onlineGame && self.onlineConnection.live) {
      this.#onLobbyNavigation();
      return;
    }
    this.#onHomeNavigation();
  }


}
