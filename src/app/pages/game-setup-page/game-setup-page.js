"use strict";

import "../../../styles/pages/_game-setup.scss";
import { enumKey } from "~/_utils/utils";
import { Page } from "../page";
import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";
import { GameType } from "GameEnums";

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

  #loadWizard() {
    const wizardName = `GameSetup${enumKey(GameType, this.#_gameType)}`;
    return import(`GameSetUp`).then((module) => {
      return new module[wizardName](this.navigateToHome, this.onPlayGame.bind(this));
    });
  }

  renderPage(mainContainer) {
    this.#loadWizard().then((gameWizard) => {
      this.gameWizard = gameWizard;
      this.gameWizard.generateWizard().then(wizard => {
        this.hideLoader();
        mainContainer.append(wizard);

        console.log("now animate");
        console.log(wizard.getBoundingClientRect());


      });
     
    });
  }

  // Overridden functions
  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);

    console.log("onConnectionError");
  }
}
