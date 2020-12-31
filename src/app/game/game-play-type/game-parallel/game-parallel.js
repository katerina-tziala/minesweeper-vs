"use strict";

import { valueDefined } from "~/_utils/validator";

import { GameOverType } from "GameEnums";

import {
  VSDashboardController,
  SneakPeekCompetitionController,
  GameMessageParallelController as MessageController
} from "GamePlayControllers";

import { Game } from "../_game";
import { GameParallelViewHelper as ViewHelper } from "./_game-parallel-view-helper";
export class GameParallel extends Game {
  #_individualGames = [];
  #PlayerGame;
  #OpponentGame;
  #VSDashboard;
  #SneakPeekController;
  #MessageController;

  constructor(id, params, playerGame, opponentGame) {
    super(id, params);
    this.initState();
    this.#setIndividualGames(playerGame, opponentGame);
    this.#setPlayers();
    this.#setVSDashboardHandler();
    this.#setSneakPeekController();
    this.#MessageController = new MessageController();
  }

  #setVSDashboardHandler() {
    this.#VSDashboard = new VSDashboardController(this.wrongFlagHint);
  }

  #setSneakPeekController() {
    this.#SneakPeekController = new SneakPeekCompetitionController(this.#onSneakPeek.bind(this),
      this.#onSneakPeekEnd.bind(this),
      !this.optionsSettings.openCompetition);
  }

  get #openCompetition() {
    if (valueDefined(this.optionsSettings.openCompetition)) {
      return this.optionsSettings.openCompetition;
    }
    return true;
  }

  get #identicalMinefields() {
    if (valueDefined(this.optionsSettings.identicalMines)) {
      return this.optionsSettings.identicalMines;
    }
    return true;
  }

  #setIndividualGames(playerGame, opponentGame) {
    this.#PlayerGame = playerGame;
    this.#setUpPlayerGame();

    this.#OpponentGame = opponentGame;
    this.#setUpOpponentGame();

    this.#_individualGames = [this.#PlayerGame, this.#OpponentGame];
  }

  #setUpPlayerGame() {
    this.#PlayerGame.externalActions = {
      onMoveSubmission: this.#onPlayerGameMove.bind(this),
      onGameOverSubmission: this.#onPlayerGameOver.bind(this)
    };
  }

  #setUpOpponentGame() {
    this.#OpponentGame.externalActions = {
      onMoveSubmission: this.#onOpponentGameMove.bind(this),
      onGameOverSubmission: this.#onOpponentGameOver.bind(this)
    };
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

  get boardActions() {
    const boardActions = super.boardActions;
    if (this.#SneakPeekController.allowed) {
      boardActions.append(this.#SneakPeekController.toggleButton);
    }
    return boardActions;
  }

  get onAfterViewInit() {
    const viewUpdates = [this.#hideOpponentBoard()];
    viewUpdates.push(this.#MessageController.hide());
    return Promise.all(viewUpdates);
  }

  generateView() {
    const gameContainer = document.createDocumentFragment();
    const vsDashboard = this.#VSDashboard.generateView(
      this.#player,
      this.#opponent,
      this.boardActions);
    gameContainer.append(vsDashboard);
    gameContainer.append(ViewHelper.generateGamingArea(this.#_individualGames));
    gameContainer.append(this.#MessageController.generateView());
    return gameContainer;
  }

  #initMinesPositions() {
    if (!this.#identicalMinefields) {
      this.#individualGames.forEach((game) => game.setMinesPositions());
    } else {
      this.#PlayerGame.setMinesPositions();
      this.#OpponentGame.levelSettings.minesPositions = this.#PlayerGame.levelSettings.minesPositions;
    }
  }

  #initSneakPeekController() {
    this.#SneakPeekController.parentElementID = this.#OpponentGame.freezerId;
    this.#SneakPeekController.setControllerPlayer(this.#player);
  }

  #initGames() {
    const viewUpdates = [];
    this.#individualGames.forEach((game) => {
      game.init();
      game.setGameStart();
      viewUpdates.push(game.onAfterViewInit);
    });
    return Promise.all(viewUpdates);
  }

  #startGames() {
    this.#PlayerGame.player.turn = true;
    this.#OpponentGame.player.turn = false;
    this.#individualGames.forEach((game) => game.startParallelGamePlay());
  }

  #setGameViewsOnGameOver() {
    this.#individualGames.forEach((game) => game.setGameBoardOnGameOver());
  }

  // HANDLE PLAYER ACTIONS
  #onPlayerGameMove(playerCardUpdate, gameData) {
    if (playerCardUpdate) {
      this.#updatePlayerCard(this.#PlayerGame);
    }
    if (this.isOnline) {
      console.log("send data online");
      console.log(gameData);
    }
  }

  #onPlayerGameOver(gameData) {
    this.#onGameOver(gameData);
    this.#updatePlayerCard(this.#PlayerGame);
    this.#setResultsForPlayers(this.#opponent);
  }

  // HANDLE OPPONENT ACTIONS
  #onOpponentGameMove() {
    this.#updatePlayerCard(this.#OpponentGame);
  }

  #onOpponentGameOver(gameData) {
    this.#onGameOver(gameData);
    this.#updatePlayerCard(this.#OpponentGame);
    this.#setResultsForPlayers(this.#player);
  }


  #setResultsForPlayers(player) {
    if (this.gameOverClearedMinefield) {
      player.lostGame = true;
    }
  }

  #updatePlayerCard(game) {
    this.#VSDashboard.updatePlayerGameGoalStatistics(game.player);
  }

  #hideOpponentBoard() {
    if (!this.#openCompetition) {
      return ViewHelper.hideGameContainer(this.#OpponentGame);
    }

    return Promise.resolve();
  }

  #displayOpponentBoard() {
    if (!this.#openCompetition) {
      return ViewHelper.displayGameContainer(this.#OpponentGame);
    }
    return Promise.resolve();
  }

  // SNEAK PEEK
  #onSneakPeek() {
    this.#displayOpponentBoard().then(() => {
      return this.#SneakPeekController.playerPeeking();
    }).catch((err) => {
      console.log(err);
      console.log("error on onSneakPeek");
    });
  }

  #onSneakPeekEnd() {
    this.#SneakPeekController.stopPeeking().then(() => {
      return this.#hideOpponentBoard();
    }).catch((err) => {
      console.log(err);
      console.log("error on onSneakPeekEnd");
    });
  }

  // GAME STATE
  start() {
    if (this.isOnline) {
      console.log("online gaming");
      //TODO: identical mines on online
      return;
    }

    this.#initMinesPositions();
    this.setGameStart();

    this.onAfterViewInit.then(() => {
      return this.#initGames();
    }).then(() => {
      this.#initSneakPeekController();
      this.#MessageController.displayStartMessage(this.#player, this.#opponent).then(() => {
        this.#startGames();
      });
    });
  }

  pause() {
    if (this.#SneakPeekController.isRunning) {
      this.#SneakPeekController.stop();
    }
    this.#pauseGames();
  }

  #pauseGames() {
    this.#individualGames.forEach((game) => game.pause());
  }

  restart() {
    this.initState();
    this.start();
  }

  continue() {
    if (this.#SneakPeekController.isPaused) {
      this.#SneakPeekController.continue();
    }
    this.#individualGames.forEach((game) => game.continue());
  }

  #onGameOver(gameData) {
    this.setGameEnd(gameData.gameOverType);

    this.#setGameViewsOnGameOver();

    this.#displayOpponentBoard().then(() => {
      if (this.#SneakPeekController.isRunning) {
        this.#SneakPeekController.stopPeeking();
      }

      if (this.isOnline) {
        console.log("online gaming");
        console.log(gameData);
      }

      this.#MessageController.displayEndMessage(this.#player, this.#opponent, this.gameOverClearedMinefield).then(() => {
        //TODO: ON PLAYER WIN SHOW CONFETTI
      });
    }).catch((err) => {
      console.log(err);
      console.log("error on onGameOver");
    });
  }

}
