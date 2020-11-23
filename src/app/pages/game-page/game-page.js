"use strict";

import "../../../styles/pages/_game.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";

import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, FORM_PARAMS } from "./game-page.constants";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

import { User } from "~/_models/user";


import { GameType } from "Game";

export class GamePage extends Page {
  #_gameType;
  #_game;

  constructor(gameType, navigateToHome) {
    super();
    this.#gameType = gameType;
    this.navigateToHome = navigateToHome;
    this.game = undefined;
    self.settingsController.gameSettingsHidden = false;
    this.init();
  }

  set #gameType(type) {
    this.#_gameType = type;
  }

  get #gameType() {
    return this.#_gameType;
  }

  set game(game) {
    this.#_game = game;
  }

  get game() {
    return this.#_game;
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

  onPlayGame(game) {
    this.displayLoader();
    this.getClearedMainContainer().then(mainContainer => {
      console.log(mainContainer);
      console.log("game ooon");
      this.game = game;
      this.hideLoader();
    });
  }

  // Overridden functions
  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);

  }





}
