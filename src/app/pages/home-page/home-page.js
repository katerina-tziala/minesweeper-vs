"use strict";

import "../../../styles/pages/_home.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import { Page } from "../page";
import { DOM_ELEMENT_CLASS, MENU_CONTENT } from "./home-page.constants";
import { GameType } from "GameEnums";
import { HeaderActionsControllerUser } from "../../controllers/header-actions-controller/header-actions-controller-user";
import {
  Menu
} from "../../components/menu/menu";

export class HomePage extends Page {
  #Menu;

  constructor(selectGameType) {
    super();
    self.onlineConnection.onUserUpdate = this.#onUserUpdate.bind(this);
    self.onlineConnection.onError = this.#onConnectionError.bind(this);
    this.actionControlller = new HeaderActionsControllerUser(true, {
      "onLogout": this.onLogout.bind(this)
    });
    this.#Menu = new Menu(this.#gameMenuOptions, this.#onMenuOptionSelected.bind(this));

    this.selectGameType = selectGameType;
    this.init();
  }

  get #gameMenuOptions() {
    return Object.values(GameType).map(type => {
      return {
        name: type,
        disabled: false
      };
    });
  }

  #onMenuOptionSelected(type) {
    console.log("#onMenuOptionSelected");
    console.log(type);
  }

  #updateOnlineOptionState() {
    this.#Menu.toggleOptionState(GameType.Online, !self.onlineConnection.live);
  }



  renderPage(mainContainer) {
    mainContainer.append(this.#Menu.generateView());
    this.#updateOnlineOptionState();
    this.hideLoader();
  }


  #onConnectionError(errorType) {
    console.log(errorType);
    this.#updateOnlineOptionState();
  }

  #onUserUpdate() {

    console.log("#onUserUpdate");
  }
}
