"use strict";
import "../../../styles/pages/_lobby.scss";
import { valueDefined } from "~/_utils/validator";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { Page } from "../page";
import { HeaderActionsControllerUser } from "~/controllers/header-actions-controller/header-actions-controller-user";


import {
  DOM_ELEMENT_CLASS
} from "./lobby-page.constants";


import { User } from "../../_models/user";

import { LinkInvitationButton } from "./link-invitation-button/link-invitation-button";
import { OnlineUsersController } from "./online-users-controller/online-users-controller";


export class LobbyPage extends Page {
  #GameWizard;
  #OnlineUsersController;

  constructor(onPageChange) {
    super(onPageChange);
  }

  init() {
    this.#GameWizard = undefined;
    this.#OnlineUsersController = new OnlineUsersController(this.#renderWizard.bind(this));
    this.#OnlineUsersController.users = self.onlineConnection.peers;
    super.init();
  }

  get #pageContent() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#renderLinkInvitationSection());
    fragment.append(this.#OnlineUsersController.generateView());
    return fragment;
  }

  #renderLinkInvitationSection() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.linkInvitationContainer]);
    const button = LinkInvitationButton.generate(this.#renderWizard.bind(this));
    container.append(button);
    return container;
  }

  #renderWizard(user) {
    this.#OnlineUsersController = undefined;
    this.displayLoader();
    return Promise.all([
      this.getClearedMainContainer(),
      this.#loadWizard(user)
    ]).then(([mainContainer, wizard]) => {
      mainContainer.append(wizard);
      this.hideLoader();
      this.#GameWizard.expandWizard();
    }).catch(() => {
      console.log("error on loading wizard");
    });
  }

  #loadWizard(user) {
    return import("GameWizard").then((module) => {
      this.#GameWizard = new module.GameWizardOnline(this.init.bind(this), this.#onGameConfiguration.bind(this), user);
      return this.#GameWizard.generateView();
    });
  }

  #onGameConfiguration(gameParams) {
    if (gameParams.players.length === 2) {
      this.#sendInvitation(gameParams);
      return;
    }
    this.#generateGameLink(gameParams);
  }

  #sendInvitation(gameParams) {
    const recipientId = gameParams.players[1].id;
    const gameProperties = gameParams;
    if (self.onlineConnection) {
      self.onlineConnection.sendInvitation({ recipientId, gameProperties });
    }
  }

  #generateGameLink(gameParams) {
    console.log("#generateGameLink");
    console.log(gameParams);
  }

  renderPage(mainContainer) {
    mainContainer.append(this.#pageContent);
    this.hideLoader();
  }

  onConnectionError(errorType) {
    console.log("onConnectionError in lobby page");
    super.onConnectionError(errorType);

  }

  onUserUpdate() {
    console.log("onUserUpdate in lobby page");
  }

}
