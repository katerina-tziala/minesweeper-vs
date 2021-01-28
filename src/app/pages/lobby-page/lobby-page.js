"use strict";

import "../../../styles/pages/_lobby.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { Page } from "../page";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  FORM_PARAMS,
} from "./lobby-page.constants";


import { OnlineUsers } from "../../components/online-users/online-users";

import { User } from "../../_models/user";

// import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";

export class LobbyPage extends Page {

  constructor(navigateToHome) {
    super();
    this.navigateToHome = navigateToHome;
    self.settingsController.gameSettingsHidden = false;
    this.init();
    console.log("LobbyPage");
    this.peers = [];
    this.peers.push(new User("kate1", "kate", "asdf"));

    console.log(self.onlineConnection.peers);

    for (let index = 0; index < 10; index++) {
      const stringNumber = index.toString();
      const roomId = index % 2 === 0 ? "room" + stringNumber : undefined;
      let name = "kate" + stringNumber;
      for (let i = 0; i < index; i++) {
        name += "kate";
      }
      this.peers.push(new User(stringNumber, name, roomId));

    }

    // console.log(peers);

    this.onlineUsers = new OnlineUsers(this.peers, this.#onUserSelected.bind(this));
  }

  #onUserSelected(user) {
    console.log(user);


  }



  renderPage(mainContainer) {
    mainContainer.append(this.onlineUsers.generateView());
    this.hideLoader();
  }



  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);
    console.log("onConnectionError");
  }
}
