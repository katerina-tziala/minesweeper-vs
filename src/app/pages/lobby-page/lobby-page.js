"use strict";

import "../../../styles/pages/_lobby.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { Page } from "../page";
import {
  DOM_ELEMENT_CLASS,
  LINK_INVITATION_BUTTON,
  CONTENT
} from "./lobby-page.constants";


import { OnlineUsers } from "../../components/online-users/online-users";

import { User } from "../../_models/user";
import { LinkInvitationButton } from "../../components/link-invitation-button/link-invitation-button";



// import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";

export class LobbyPage extends Page {
  #GameWizard;

  constructor(navigateToHome) {
    super();
    this.navigateToHome = navigateToHome;
    self.settingsController.gameSettingsHidden = false;



    this.onlineUsers = new OnlineUsers(self.onlineConnection.peers, this.#onUserSelected.bind(this));

    this.init();
  }








  #onSendInvitation(game) {
    console.log("#onSendInvitation");
    console.log(game);


  }

  renderPage(mainContainer) {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#renderLinkInvitationSection(), this.onlineUsers.generateView());
    mainContainer.append(fragment);
    this.hideLoader();
  }



  #generateLink() {
    console.log("generateLink");

    Promise.all([self.modal.displayModal(), this.#loadWizard()])
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
      this.#onWizardClosed();
    });

  }









  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);
    console.log("onConnectionError");
  }

  #onWizardClosed() {
    this.#GameWizard = undefined;
    self.modal.close();
  }

  #renderLinkInvitationSection() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.linkInvitationContainer]);
    const button = LinkInvitationButton.generate(this.#generateLink.bind(this))
    container.append(button);
    return container;
  }

  #loadWizard(user) {
    return import("GameWizard").then((module) => {
      this.#GameWizard = new module.GameWizardOnline(this.#onWizardClosed.bind(this), this.#onSendInvitation.bind(this), user);
      return this.#GameWizard.generateView();
    });
  }

  #onUserSelected(user) {
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
      this.#onWizardClosed();
    });
  }
}
