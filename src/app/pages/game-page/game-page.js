"use strict";

import "../../../styles/pages/_game.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";

import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./game-page.constants";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

import { User } from "~/_models/user";


import { GamePlay } from "../../game/game-play/game-play";

export class GamePage extends Page {
  #_game;

  constructor(game, navigateToHome) {
    super();
    this.navigateToHome = navigateToHome;
    this.game = new GamePlay(game);
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
    const gameContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
    gameContainer.append(this.game.generateGameBoard());
    mainContainer.append(gameContainer);
    this.game.startGame();
  }

  // Overridden functions
  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);

  }

}
