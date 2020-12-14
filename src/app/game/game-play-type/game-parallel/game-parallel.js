"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { AppModel } from "~/_models/app-model";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./_game-parralel.constants";
export class GameParallel extends AppModel {
  constructor(id, playerGame, opponentGame) {
    super();
    this.id = id ? id : this.type;
    this.playerGame = playerGame;
    this.opponentGame = opponentGame;
    this.games = [this.playerGame, this.opponentGame];
  }

  generateView() {
    const gameContainer = document.createDocumentFragment();
    this.games.forEach((game) => {
      gameContainer.append(this.#generateGameView(game));
    });
    return gameContainer;
  }

  #gameContainerID(gameID) {
    return DOM_ELEMENT_CLASS.container + TYPOGRAPHY.doubleUnderscore + gameID;
  }

  #generateGameView(game) {
    const gameContainer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.container],
      this.#gameContainerID(game.id),
    );
    gameContainer.append(game.generateView());
    return gameContainer;
  }

  start() {
    console.log("start parallel");
    // this.onAfterViewInit.then(() => {
    //   this.initDashBoard();
    this.games.forEach((game) => {
      game.start();
    });
  }
}
