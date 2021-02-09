"use strict";
import "../../../styles/pages/_home.scss";
import { Page } from "../page";
import { GameType } from "GameEnums";
import { HeaderActionsControllerUser } from "~/controllers/header-actions-controller/header-actions-controller-user";
import { Menu } from "~/components/menu/menu";

export class HomePage extends Page {
  #Menu;
  constructor(onPageChange, onMenuOptionSelected) {
    super(onPageChange);
    this.#Menu = new Menu(this.#gameMenuOptions, onMenuOptionSelected);
    this.ActionsControlller = new HeaderActionsControllerUser(true, {
      "onLogout": this.onLogout.bind(this)
    });
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

  #updateOnlineOptionState() {
    this.#Menu.toggleOptionState(GameType.Online, !self.onlineConnection.live);
  }

  renderPage(mainContainer) {
    mainContainer.append(this.#Menu.generateView());
    this.#updateOnlineOptionState();
    this.hideLoader();
  }

  onConnectionError(errorType) {
    super.onConnectionError(errorType);
    this.#updateOnlineOptionState();
  }

  onUserUpdate() {
    console.log("onUserUpdate in home page");
    this.#updateOnlineOptionState();
    this.ActionsControlller.setOnlineIndicatorState();
  }
}
