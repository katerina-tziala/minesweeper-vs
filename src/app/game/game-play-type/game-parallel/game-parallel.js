"use strict";
import { valueDefined } from "~/_utils/validator";
import {
  VSDashboardController,
  SneakPeekCompetitionController,
  GameMessageParallelController as MessageController
} from "GamePlayControllers";

import { Game } from "../_game";
import { GameParallelViewHelper as ViewHelper } from "./_game-parallel-view-helper";
import { SneakPeekSettings } from "GameModels";
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
    const sneakPeekAllowed = !this.optionsSettings.openCompetition && this.optionsSettings.sneakPeek;
    const sneakPeekSettings = new SneakPeekSettings(sneakPeekAllowed, this.optionsSettings.sneakPeekDuration, this.optionsSettings.sneakPeeksLimit);
    this.#SneakPeekController = new SneakPeekCompetitionController(sneakPeekSettings, this.#onSneakPeek.bind(this), this.#onSneakPeekEnd.bind(this));
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
      onMoveSubmission: this.onOpponentGameMove.bind(this),
      onGameOverSubmission: this.onOpponentGameOver.bind(this)
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

  get gamePlayersResults() {
    return [this.#player.reportData, this.#opponent.reportData];
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
    this.#SneakPeekController.initPeekToggle();
  }

  #initGames() {
    const viewUpdates = [];
    viewUpdates.push(this.#initIndividualGame(this.#PlayerGame, true));
    viewUpdates.push(this.#initIndividualGame(this.#OpponentGame));
    return Promise.all(viewUpdates);
  }

  #initIndividualGame(game, playerOnTurn = false) {
    game.init(playerOnTurn);
    game.setGameStart();
    return game.onAfterViewInit;
  }

  #startGames() {
    this.#individualGames.forEach((game) => game.startParallelGamePlay());
  }

  // HANDLE PLAYER ACTIONS
  #onPlayerGameMove(playerCardUpdate, gameData) {
    if (playerCardUpdate) {
      this.#updatePlayerCard(this.#player);
    }
    if (this.isOnline) {
      console.log("send data online");
      console.log(gameData);
    }
  }

  #onPlayerGameOver(gameData) {
    this.#onGameOver(gameData, this.#player, this.#opponent);
  }

  // HANDLE OPPONENT ACTIONS
  onOpponentGameMove(gameData, playerCardUpdate) {
    if (playerCardUpdate) {
      this.#updatePlayerCard(this.#opponent);
    }
    this.#SneakPeekController.updateToggleState();
    //this.#updatePlayerCard(this.#opponent);
  }

  onOpponentGameOver(gameData, playerCardUpdate) {
    this.#onGameOver(gameData, this.#opponent, this.#player);
  }

  #updatePlayerCard(player) {
    return this.#VSDashboard.updatePlayerGameGoalStatistics(player);
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
    if (!this.isOver) {
      this.#displayOpponentBoard().then(() => {
        return this.#SneakPeekController.playerPeeking();
      }).catch((err) => {
        console.log(err);
        console.log("error on onSneakPeek");
      });
    }
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

    this.initState();
    this.#initMinesPositions();
    this.setGameStart();

    this.onAfterViewInit.then(() => {
      return this.#initGames();
    })
      .then(() => {
        return this.#VSDashboard.setCardOnTurn(this.players);
      })
      .then(() => {
        this.#initSneakPeekController();

        if (!this.bothPlayersEntered) {
          this.#displayReadyMessageAndWait();
          return;
        }
        this.#displayStartMessageAndPlay();
      });
  }

  #displayReadyMessageAndWait() {
    const updates = [
      this.#MessageController.displayReadyMessage(this.#opponent)
    ];
    this.#individualGames.forEach((game) => {
      updates.push(game.displayMinefieldLoader());
    });
    return Promise.all(updates);
  }

  #displayStartMessageAndPlay() {
    this.#MessageController.displayStartMessage(this.#player, this.#opponent).then(() => {
      this.#startGames();
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

  #setResultsForPlayers(player) {
    if (this.gameOverClearedMinefield) {
      player.lostGame = true;
    }
  }

  #completeGames() {
    this.#individualGames.forEach((game) => {
      game.setCompleted();
      game.pause();
    });
  }

  #onGameOver(gameData, initiator, opponent) {
    this.setGameEnd(gameData.gameOverType);
    this.#completeGames();
    this.#setResultsForPlayers(opponent);

    if (this.isOnline) {
      console.log("send data online");
      console.log(gameData);
    }

    this.#setGameViewOnGameOver(initiator);
  }

  #setGameViewOnGameOver(player) {
    const viewUpdates = [
      this.#displayOpponentBoard()
    ];

    if (this.#SneakPeekController.isRunning) {
      viewUpdates.push(this.#SneakPeekController.stopPeeking());
    }

    this.#individualGames.forEach((game) => {
      viewUpdates.push(game.setGameBoardOnGameOver(this.isDraw))
    });

    viewUpdates.push(this.#updatePlayerCard(player));

    viewUpdates.push(this.#MessageController.displayGameOverMessage(this.gameResults));
    return Promise.all(viewUpdates);
  }

}
