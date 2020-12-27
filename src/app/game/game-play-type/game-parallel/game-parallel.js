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

    console.log(this.optionsSettings);
    this.#vsDashboard = new VSDashboardController(this.wrongFlagHint);
  }

  #setIndividualGames(playerGame, opponentGame) {
    this.#PlayerGame = playerGame;
    this.#PlayerGame.externalActions = {
      onMoveSubmission: this.#onPlayerGameMove.bind(this),
      onGameOverSubmission: this.#onPlayerGameOver.bind(this)
    };

    opponentGame.player.turn = false;
    this.#OpponentGame = opponentGame;
    this.#OpponentGame.externalActions = {
      onMoveSubmission: this.#onOpponentGameMove.bind(this),
      onGameOverSubmission: this.#onOpponentGameOver.bind(this)
    };

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
      game.setGameStart();
      //console.log(game);
    });
  }


  
  #onPlayerGameMove(playerCardUpdate, gameData) {
    if (playerCardUpdate) {
      this.#updatePlayerCard(this.#PlayerGame);
    }
    if (this.isOnline) {
      console.log("send data online");
      console.log(gameData);
    }
  }

  #onOpponentGameMove() {
    this.#updatePlayerCard(this.#OpponentGame);
  }

  #onPlayerGameOver(gameData) {
    this.#onGameOver(gameData);
    
    this.#updatePlayerCard(this.#PlayerGame);
   
    console.log("onPlayerGameOver");
    console.log(this);
   
    this.#revealGameMinefield(this.#OpponentGame);
  }

  #onOpponentGameOver(gameData) {
    this.#onGameOver(gameData);
    this.#updatePlayerCard(this.#OpponentGame);
   
    console.log("onOpponentGameOver");
    console.log(this);
    
    this.#revealGameMinefield(this.#PlayerGame);
  }

  #onGameOver(gameData) {
    this.setGameEnd(gameData.gameOverType);
    this.#pauseGames();

    console.log("onGameOver");
    console.log(gameData);

  }




  #updatePlayerCard(game) {
    this.#vsDashboard.updatePlayerGameGoalStatistics(game.player, game.playerTargetValue);
  }

  #revealGameMinefield(game) {
    game.revealMinefield();
  }













  #pauseGames() {
    this.#individualGames.forEach((game) => game.pause());
  }

  pause() {
    this.#pauseGames();
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
