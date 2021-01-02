"use strict";
import { ElementHandler } from "HTML_DOM_Manager";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameOverType, GameSubmission } from "GameEnums";

import { GameDefault } from "../_game-default";

import {
  VSDashboardController,
  GameMessageVSController as MessageController
} from "GamePlayControllers";
export class GameVS extends GameDefault {
  #MessageController;

  constructor(id, params, player, opponent) {
    super(id, params, player);
    this.opponent = opponent;
    this.players = [this.player, this.opponent];
    this.init();
    this.#setDashBoard();
    this.#MessageController = new MessageController(this.optionsSettings.vsMode);
  }

  #setDashBoard() {
    this.vsDashboard = new VSDashboardController(
      this.wrongFlagHint,
      !this.isDetectMinesGoal,
    );
  }

  get messageController() {
    return this.#MessageController;
  }

  get playerOnTurn() {
    return this.players.find((player) => player.turn);
  }

  get playerWaiting() {
    return this.players.find((player) => !player.turn);
  }

  get isDetectMinesGoal() {
    return false;
  }

  get goalTargetNumber() {
    return null;
  }

  get isSharedDevice() {
    return !this.isOnline && !this.opponent.isBot;
  }

  get #maxAllowedFlags() {
    return !this.optionsSettings.unlimitedFlags
      ? this.levelSettings.numberOfMines
      : null;
  }

  get viewInitUpdates() {
    const viewUpdates = super.viewInitUpdates;
    viewUpdates.push(this.vsDashboard.initCardsState(this.players));
    viewUpdates.push(this.#MessageController.hide());
    return viewUpdates;
  }

  get roundViewUpdates() {
    const viewUpdates = [this.vsDashboard.setCardOnTurn(this.players)];
    viewUpdates.push(this.gameBoard.initBoardOnRound(this.playerOnTurn));
    return viewUpdates;
  }

  get onAfterRoundViewInit() {
    const viewUpdates = [this.vsDashboard.setCardOnTurn(this.players)];
    viewUpdates.push(this.gameBoard.initBoardOnRound(this.playerOnTurn));
    return Promise.all(viewUpdates);
  }

  init() {
    this.players.forEach((player) => {
      player.initState(
        this.goalTargetNumber,
        this.#turnsLimit,
        this.#maxAllowedFlags,
      );
      player.turn = player.id === this.playerStartID;
    });
    this.initState();
  }

  generateView() {
    const gameContainer = super.generateView();
    const vsDashboard = this.vsDashboard.generateView(
      this.player,
      this.opponent,
    );
    ElementHandler.addInChildNodes(gameContainer, vsDashboard, 0);
    gameContainer.append(this.#MessageController.generateView());
    return gameContainer;
  }

  flaggingAllowed(tile, player = this.playerOnTurn) {
    if (!tile.isFlagged && !tile.isMarkedBy(player.id) && player.hasFlags) {
      return true;
    }
    return false;
  }

  updateStateOnFlaggedTile(tile) {
    return;
  }

  updateStateOnMarkedTile(tile) {
    return;
  }

  updateStateOnResetedTile(tile) {
    return;
  }

  // FUNCTIONS TO HANDLE TURNS
  get roundTimer() {
    return this.gameBoard.roundTimer;
  }

  get #turnsLimit() {
    return this.turnSettings ? this.turnSettings.missedTurnsLimit : null;
  }

  switchTurns() {
    this.players.forEach((player) => player.toggleTurn());
  }

  playerMissedTurnsReseted(player = this.playerOnTurn) {
    if (
      this.turnSettings &&
      this.turnSettings.resetMissedTurns &&
      player.missedTurns
    ) {
      player.resetMissedTurns();
      return true;
    }
    return false;
  }

  onRoundTimerEnd() {
    this.playerOnTurn.increaseMissedTurns();

    if (this.playerOnTurn.exceededTurnsLimit) {
      this.setGameEnd(GameOverType.ExceededTurnsLimit);
    }
    this.updatedPlayerCard({ turnsUpdate: true }).then(() => {
      if (this.isOver) {
        this.onGameOver();
        return;
      }
      this.onRoundEnd();
    });
  }

  /* UPDATE PLAYER CARD */
  updatedPlayerCard(params, player = this.playerOnTurn) {
    return this.vsDashboard.updatedPlayerCard(player, params);
  }

  restart() {
    this.setMinesPositions();
    const playersIds = this.players.map((player) => player.id);
    this.playerStartID = randomValueFromArray(playersIds);
    this.init();
    this.start();
  }

  start() {
    this.onAfterViewInit.then(() => {
      return this.messageController.displayStartMessage(this.playerOnTurn)
    }).then(() => {
      this.onGamePlayStart();
    });
  }

  onGamePlayStart() {
    if (this.roundTimer) {
      this.setGameStart();
    }
    this.startRoundGamePlay();
  }

  startGameRound() {
    this.startRoundGamePlay();
  }

  startRoundGamePlay() {
    this.setUpNewRound().then(() => this.onRoundPlayStart());
  }

  setUpNewRound() {
    this.initRoundStatistics();
    return this.onAfterRoundViewInit;
  }

  onRoundPlayStart() {
    this.gameBoard.startRoundTimer();
    if (this.playerOnTurn.isBot) {
      this.startBotRound();
      return;
    }

    this.enableMinefield();
  }

  //TODO: COMPLETE THE CASES
  startBotRound() {
    //TODO:
    console.log("--  get Bot move -- ");
    console.log("GameVS");
    console.log("----------------------------");
    //this.disableMinefield();
    this.enableMinefield();
  }

  /* HANDLE GAME STATE AFTER PLAYER ACTION */
  onPlayerMoveEnd(boardTiles = []) {
    this.updateMinesCounter();
    this.roundTilesUpdate = boardTiles;

    if (this.isOnline) {
      //TODO:
      console.log("--  submit online move --");
      console.log("GameVSDetect");
      console.log("----------------------------");
      this.submitResult(GameSubmission.MoveEnd);
      console.log("decide how game is continued for this player");
      this.pause();
      return;
    }
    //console.log(this);
    this.enableMinefield();
  }

  //TODO: COMPLETE THE CASES
  onRoundEnd(boardTiles = []) {
    this.gameBoard.setBoardOnRoundEnd();
    this.setStatisticsOnRoundEnd(boardTiles);



    if (this.isOnline) {
      //TODO:
      console.log("--  submit online round -- ");
      console.log("GameVS");
      console.log("----------------------------");
      this.submitResult(GameSubmission.RoundEnd);
      this.pause();
      return;
    }

    this.switchTurns();
    this.startGameRound();
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);
    this.setWinnerOnGameOver();
    
    this.#displayGameOverMessage().then(() => {
      if (this.isOnline) {
        //TODO:
        console.log("--  submit online game over -- ");
        console.log("GameVS");
        console.log("----------------------------");
        this.submitResult(GameSubmission.GameOver);
        return;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  #displayGameOverMessage() {
    if (this.isDraw) {
      return this.messageController.displayDrawMessage(this.player, this.opponent).then(() => {
        //TODO: confetti of both colors
      });
    }
    if (this.isSharedDevice) {
      return this.messageController.displayDrawMessage(this.winner, this.looser, this.gameOverType).then(() => {
        //TODO: confetti of winner
      });
    }
    return this.messageController.displayEndMessage(this.player, this.opponent, this.gameOverType).then(() => {
      //TODO: confetti of winner colors
    });
  }

  get gameOverBasedOnType() {
    return this.isOver && this.gameOverType !== GameOverType.DetonatedMine && this.gameOverType !== GameOverType.ExceededTurnsLimit;
  }

  setWinnerOnGameOver() {
    if (!this.gameOverBasedOnType) {
      return;
    }
    const looser = this.looserOnVsMode;
    if (looser) {
      looser.lostGame = true;
    }
  }


}
