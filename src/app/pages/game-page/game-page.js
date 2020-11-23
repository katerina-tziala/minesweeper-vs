"use strict";

import "../../../styles/pages/_game.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";

import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, FORM_PARAMS } from "./game-page.constants";

import { FormUsername } from "../../components/form/form-username/form-username";
import { StateLoader } from "../../components/loaders/state-loader/state-loader";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

// import { GameWizardOriginal, GameWizardVSBot, GameWizardVSFriend, GameWizardVSOnline } from "~/game/game-wizard/@game-wizard.module";


import { User } from "~/_models/user";


import { GameType } from "Game";


export class GamePage extends Page {
  #gameType;





  constructor(gameType, navigateToHome) {
    super();
    this.gameType = gameType;
    this.navigateToHome = navigateToHome;
    this.game = undefined;
    self.settingsController.gameSettingsHidden = false;
    this.init();
  }

  loadWizardClass(wizardPath) {
    return import(`~/game/game-wizard/${wizardPath}`);
  }

  loadOriginalWizard() {
    return this.loadWizardClass("game-wizard-original").then(({ GameWizardOriginal }) => {
      return new GameWizardOriginal(this.navigateToHome, this.onPlayGame.bind(this));
    });
  }

  loadVSBotWizard() {
    return this.loadWizardClass("game-wizard-vs/game-wizard-vs-bot").then(({ GameWizardVSBot }) => {
      return new GameWizardVSBot(this.navigateToHome, this.onPlayGame.bind(this));
    });
  }

  loadVSFriendWizard() {
    return this.loadWizardClass("game-wizard-vs/game-wizard-vs-friend").then(({ GameWizardVSFriend }) => {
      return new GameWizardVSFriend(this.navigateToHome, this.onPlayGame.bind(this));
    });
  }

  loadWizard() {
    switch (this.gameType) {
      case GameType.Original:
        return this.loadOriginalWizard();
      case GameType.Bot:
        return this.loadVSBotWizard();
      case GameType.Friend:
        return this.loadVSFriendWizard();
    }
  }

  set gameType(type) {
    this.#gameType = type;
  }

  get gameType() {
    return this.#gameType;
  }

  renderPage(mainContainer) {
    this.loadWizard().then(gameWizard => {
      this.gameWizard = gameWizard;
      mainContainer.append(this.gameWizard.generateWizard());
    });
  }

  onPlayGame(game) {
    //super.onConnectionError(errorMessage);
    console.log(game);
    this.displayLoader();
    this.getClearedMainContainer().then(mainContainer => {
      console.log(mainContainer);
      console.log("game ooon");
      this.hideLoader();
    });
  }

  // Overridden functions
  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);

  }





}
