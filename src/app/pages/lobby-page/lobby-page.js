"use strict";

import "../../../styles/pages/_lobby.scss";
import { valueDefined } from "~/_utils/validator";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { Page } from "../page";
import {
  DOM_ELEMENT_CLASS
} from "./lobby-page.constants";

import { OnlineUsers } from "../../components/online-users/online-users";

import { User } from "../../_models/user";
import { LinkInvitationButton } from "../../components/link-invitation-button/link-invitation-button";

// import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";

export class LobbyPage extends Page {
  #GameWizard;
  #OnlineUsers;

  constructor(onPlayGame) {
    super();
    this.onPlayGame = onPlayGame;
    self.settingsController.gameSettingsHidden = false;

    this.#OnlineUsers = new OnlineUsers(self.onlineConnection.peers, this.#onUserSelected.bind(this));
    this.init();
  }

  renderPage(mainContainer) {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#renderLinkInvitationSection(), this.#OnlineUsers.generateView());
    mainContainer.append(fragment);
    this.hideLoader();
  }



  #onSendInvitation(game) {
    console.log("#onSendInvitation");
    console.log(game);
    
    if (game.players.length === 2) {
      console.log("online user");
      console.log("send invitation");
      //this.onPlayGame(game);
      //close wizard join game
    } else {
      console.log("generate link");
      //do not close modal
    }

    this.#wizardClosed();
  }


  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);
    console.log("onConnectionError");
  }



  #wizardClosed() {
    this.#GameWizard = undefined;
    self.modal.close();
  }

  #renderLinkInvitationSection() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.linkInvitationContainer]);
    const button = LinkInvitationButton.generate(this.#onGenerateLink.bind(this));
    container.append(button);
    return container;
  }

  #loadWizard(user) {
    return import("GameWizard").then((module) => {
      this.#GameWizard = new module.GameWizardOnline(this.#wizardClosed.bind(this), this.#onSendInvitation.bind(this), user);
      return this.#GameWizard.generateView();
    });
  }

  #onGenerateLink() {
    this.#displayWizard();
  }

  #onUserSelected(user) {
    this.#displayWizard(user);
  }

  #displayWizard(user) {
    Promise.all([self.modal.displayModal(), this.#loadWizard(user)])
      .then(([modalBox, wizard]) => {
        modalBox.append(wizard);
        return;
      })
      .then(() => {
        this.#GameWizard.expandWizard();
      })
      .catch(err => {
        console.log(err);
        console.log("modal err");
        this.#wizardClosed();
      });
  }

}
