"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { clone } from "~/_utils/utils.js";

import { AppModel } from "~/_models/app-model";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./_game-parralel.constants";

import {
  VSDashboardController,
  BoardActionsController,
} from "GamePlayControllers";

import { Game } from "../_game";

import { GameViewHelper } from "../game-default/_game-view-helper";
import { VSBoard } from "GamePlayComponents";

export class GameParallel extends Game {
  #_individualGames = [];
  #PlayerGame;
  #OpponentGame;
  #vsDashboard;
  


  constructor(id, params, playerGame, opponentGame) {
    super(id, params);

    this.#setIndividualGames(playerGame, opponentGame);
    this.#setPlayers();

    //console.log(this);
    this.#vsDashboard = new VSDashboardController(this.wrongFlagHint);
  }

  #setIndividualGames(playerGame, opponentGame) {
    this.#PlayerGame = playerGame;

    opponentGame.player.turn = false;
    this.#OpponentGame = opponentGame;

    this.#_individualGames = [this.#PlayerGame, this.#OpponentGame];
  }

  #setPlayers() {
    this.players = [this.#player, this.#opponent];
  }

  get #individualGames() {
    return this.#_individualGames;
  }

  get #player() {
    return this.#PlayerGame.player;
  }

  get #opponent() {
    return this.#OpponentGame.player;
  }

  generateView() {
    const gameContainer = document.createDocumentFragment();
    gameContainer.append(this.#generateDashboardView());
    gameContainer.append(this.#generateGamingArea());
    return gameContainer;
  }

  #generateDashboardView() {
    const vsDashboard = this.#vsDashboard.generateView(
      this.#player,
      this.#opponent,
    );
    const vsBoard = this.#generateVSBoardView();
    this.#vsDashboard.addElementInDashboard(vsDashboard, vsBoard);
    return vsDashboard;
  }

  #generateVSBoardView() {
    const vsBoard = VSBoard.generateView(this.#player.colorType, this.#opponent.colorType);
    vsBoard.append(this.boardActions);
    return vsBoard;
  }

  #generateGamingArea() {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gamingArea,
    ]);
    this.#individualGames.forEach((game) => {
      container.append(this.#generateGameView(game));
    });
    return container;
  }

  #gameContainerID(gameID) {
    return (
      DOM_ELEMENT_CLASS.gameContainer + TYPOGRAPHY.doubleUnderscore + gameID
    );
  }

  #generateGameView(game) {
    const gameContainer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.gameContainer],
      this.#gameContainerID(game.id),
    );
    gameContainer.append(game.generateView());
    return gameContainer;
  }

  start() {
    console.log("start parallel");

    this.#individualGames.forEach((game) => {
      game.start();

      //console.log(game);
    });
  }

  #pauseGames() {
    this.#individualGames.forEach((game) => game.pause());
  }

  

  pause() {
    console.log("pause parallel");
    this.#pauseGames();
    return;
  }

  restart() {
    console.log("restart parallel");

    return;
  }

  continue() {
    console.log("continue parallel");

    return;
  }
}
