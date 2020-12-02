"use strict";

import "../../../styles/pages/_game.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./game-page.constants";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

import { User } from "~/_models/user";


import { GamePlay } from "../../game/game-play/game-play";

export class GamePage extends Page {
  #_game;

  constructor(game, navigateToHome, onGameSetUpNavigation) {
    super();
    this.navigateToHome = navigateToHome;
    this.onGameSetUpNavigation = onGameSetUpNavigation;
    this.game = game;
    this.gamePlay = new GamePlay(game, {
      onExit: this.onGameExit.bind(this),
      onReset: this.onGameReset.bind(this),
    });
    self.settingsController.gameSettingsHidden = true;
    this.init();
  }

  set game(game) {
    this.#_game = game;
  }

  get game() {
    return this.#_game;
  }

  renderPage(mainContainer) {

    mainContainer.addEventListener("contextmenu", event => {
      event.preventDefault();
      //console.log(event);

    });


    const gameContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
    gameContainer.append(this.gamePlay.generateGameBoard());
    mainContainer.append(gameContainer);
    this.gamePlay.start();
  }

  // Overridden functions
  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);

  }


  onGameExit() {
    console.log("onGameExit");
    console.log("notify connection");
    this.navigateToHome();
  }





  onGameReset() {
    console.log("onGameReset");
    console.log("notify connection");

    this.#saveCurrentGameSetUp();
    this.onGameSetUpNavigation(this.game.type);
  }


  #saveCurrentGameSetUp() {
    const gameSetUp = { ...this.game };
    delete gameSetUp.id;
    delete gameSetUp.player;
    delete gameSetUp.opponent;

    LocalStorageHelper.save("gameSetup", gameSetUp);
  }

}
