"use strict";
import "../../../styles/pages/_home.scss";
import { Page } from "../page";
import { GameType } from "GameEnums";
import { Menu } from "./menu/menu";

export class HomePage extends Page {
  #Menu;
  #onSelectOption;
  
  constructor(onPageChange) {
    super(onPageChange);
    this.#Menu = new Menu(this.#gameMenuOptions, this.#onMenuOptionSelection.bind(this));
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

  #onMenuOptionSelection(selectedOption) {
    if (this.#onSelectOption) {
      this.#onSelectOption(selectedOption);
    }
  }

  init(onSelectOption) {
    this.#onSelectOption = onSelectOption;
    super.init();
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
    //this.ActionsControlller.setOnlineIndicatorState();
  }
}
