"use strict";

import "../../../styles/pages/_game-setup.scss";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { Page } from "../page";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

import { GameType } from "Game";

export class GameSetupPage extends Page {
  #_gameType;

  constructor(gameType, navigateToHome, onPlayGame) {
    super();
    this.#gameType = gameType;
    this.navigateToHome = navigateToHome;
    this.onPlayGame = onPlayGame;
    self.settingsController.gameSettingsHidden = false;
    this.init();
  }

  set #gameType(type) {
    this.#_gameType = type;
  }

  get #gameType() {
    return this.#_gameType;
  }

  #loadWizard(wizardName) {
    return import(`~/game/game-wizard/@game-wizard.module`).then(module => {
      return new module[wizardName](this.navigateToHome, this.onPlayGame.bind(this));
    });
  }

  #initializeWizard() {
    switch (this.#gameType) {
      case GameType.Original:
        return this.#loadWizard("GameWizardOriginal");
      case GameType.Bot:
        return this.#loadWizard("GameWizardVSBot");
      case GameType.Friend:
        return this.#loadWizard("GameWizardVSFriend");
    }
  }

  renderPage(mainContainer) {
    this.#initializeWizard().then(gameWizard => {
      this.gameWizard = gameWizard;
      mainContainer.append(this.gameWizard.generateWizard());
    });
  }

  // Overridden functions
  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);

    console.log("onConnectionError");
  }

}
