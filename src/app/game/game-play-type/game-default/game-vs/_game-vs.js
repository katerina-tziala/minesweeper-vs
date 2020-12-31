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

  get #onAfterRoundViewInit() {
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

  initRound() {
    // TODO: ROUND STATISTICS
    this.initRoundTiles();
  }

  startGameRound() {
    this.#onAfterRoundViewInit.then(() => {
      if (this.playerOnTurn.isBot) {
        this.startBotRound();
        return;
      }

      this.enableMinefield();
    });
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
      return this.#MessageController.displayStartMessage(this.playerOnTurn)
    }).then(() => {
      this.onGamePlayStart();
    });
  }

  onGamePlayStart() {
    if (this.roundTimer) {
      this.setGameStart();
    }
    this.startGameRound();
    console.log(this);
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
    // TODO: ROUND STATISTICS
    this.roundTilesUpdate = boardTiles;

    if (this.isOnline) {
      //TODO:
      console.log("--  submit online round -- ");
      console.log("GameVS");
      console.log("----------------------------");
      this.submitResult(GameSubmission.RoundEnd);
      this.pause();
      return;
    }
    //TODO:
    // console.log("--  move to next round -- ");
    // console.log("GameVS");
    // console.log("----------------------------");
    // console.log("go on the next round");
    this.switchTurns();
    this.startGameRound();
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);
    this.setWinnerOnGameOver();







    if (this.isOnline) {
      //TODO:
      console.log("--  submit online game over -- ");
      console.log("GameVS");
      console.log("----------------------------");
      this.submitResult(GameSubmission.GameOver);
      return;
    }

    //TODO:
    console.log("--  game over --");
    // console.log(this.gameOverType);
    // // console.log("GameVS");
    // // console.log("----------------------------");
    // // console.log("show end modal message");
    // // console.log(this.playerOnTurn);
    // console.log("----------------------------");
    // // console.log("game over statistics");

    // // console.log("winner:");
    // // When detonated mine			
    // // When turns: when turns limit reached			
    // // When all mines detected			
    // // console.log(this.players);
    // console.log("wineeeer");
    // console.log(this.winner);
   

    if (this.isDraw) {
      this.#MessageController.displayDrawMessage(this.player, this.opponent).then(() => {

      });
      return;
    }
    //variation on local
    console.log("we have a winner");
    console.log(this.winner);
    console.log(this.players);
    console.log(this.isDraw);
    console.log(this.isSharedDevice);
  }

  get gameOverBasedOnType() {
    return this.isOver && this.gameOverType !== GameOverType.DetonatedMine && this.gameOverType !== GameOverType.ExceededTurnsLimit;
  }

  setWinnerOnGameOver() {
    if (!this.gameOverBasedOnType) {
      return;
    }
    const looser = this.looser;

    if (looser) {
      looser.lostGame = true;
    }
  }

  get isSharedDevice() {
    return !this.isOnline && !this.opponent.isBot;
  }

}
