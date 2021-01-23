"use strict";
import { ElementHandler } from "HTML_DOM_Manager";
import { randomValueFromArray } from "~/_utils/utils.js";
import { GameOverType, GameSubmission } from "GameEnums";
import { GameDefault } from "../_game-default";
import {
  VSDashboardController,
  GameMessageVSController as MessageController
} from "GamePlayControllers";

import { REPORT_KEYS } from "../../_game.constants";


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
      this.optionsSettings.tileFlagging
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

  get goalTargetNumber() {
    return null;
  }

  get isSharedDevice() {
    return !this.isOnline && !this.opponent.isBot;
  }

  get gameInfoResults() {
    const gameInfo = super.gameInfoResults;
    gameInfo.rounds = this.numberOfRounds;
    gameInfo.playerStarted = this.players.find(player => player.id === this.playerStartID).name;
    return gameInfo;
  }

  get gameReportKeys() {
    const keys = super.gameReportKeys;
    return keys.concat(REPORT_KEYS.vs);
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
    viewUpdates.push(this.gameBoard.initBoardOnRound(this.playerOnTurn, this.playerWaiting));
    return viewUpdates;
  }

  get onAfterRoundViewInit() {
    return Promise.all(this.roundViewUpdates);
  }

  init() {


    // console.log(this.turnSettings);

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

  updateStateOnFlaggedTile() {
    return;
  }

  updateStateOnMarkedTile() {
    return;
  }

  updateStateOnResetedTile() {
    return;
  }

  // FUNCTIONS TO HANDLE TURNS
  get roundTimer() {
    return this.gameBoard.roundTimer;
  }

  get #turnsLimit() {
    return this.turnSettings ? this.turnSettings.turnsLimit : null;
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
    this.playerOnTurn.checkTurnsLimit();
    this.updatedPlayerCard({ turnsUpdate: true }).then(() => {
      if (this.playerOnTurn.exceededTurnsLimit) {
        this.onGameOver(GameOverType.ExceededTurnsLimit);
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
      if (!this.bothPlayersEntered) {
        this.#displayReadyMessageAndWait();
        return;
      }
      this.#displayStartMessageAndStart();
    });
  }

  #displayStartMessageAndStart() {
    this.messageController.displayStartMessage(this.playerOnTurn).then(() => {
      this.onGamePlayStart();
    });
  }

  #displayReadyMessageAndWait() {
    const updates = [
      this.displayMinefieldLoader(this.opponent),
      this.messageController.displayReadyMessage(this.opponent)
    ];
    return Promise.all(updates);
  }

  onGamePlayStart() {
    if (this.roundTimer) {
      this.setGameStart();
    }
    this.setUpNewRound().then(() => this.onRoundPlayStart());
  }

  startGameRound() {
    this.setUpNewRound().then(() => {
      return this.messageController.displayTurnMessage(this.playerOnTurn);
    }).then(() => {
      this.onRoundPlayStart();
    }).catch(err => {
      console.log(err);
    });
  }

  setUpNewRound() {
    this.initRoundStatistics();
    return this.onAfterRoundViewInit;
  }

  onRoundPlayStart() {
    this.gameBoard.startRoundTimer();
    if (this.isOnline) {
      console.log("onlineeeeeeeeeeeeeee");
    }
    if (this.playerOnTurn.isBot) {
      this.submitBotMove();
      return;
    }

    this.enableMinefield();
  }

  /* HANDLE GAME STATE AFTER PLAYER ACTION */
  onPlayerMoveEnd(boardTiles = []) {
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
    if (this.playerOnTurn.isBot) {
      this.submitBotMove();
      return;
    }
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

  onGameOver(gameOverType, boardTiles = []) {
    this.setGameEnd(gameOverType);
    this.setStatisticsOnRoundEnd(boardTiles);
    this.setWinnerOnGameOver();
    this.setGameBoardOnGameOver();
    if (this.isOnline) {
      //TODO:
      console.log("--  submit online game over -- ");
      console.log("GameVS");
      console.log("----------------------------");
      this.submitResult(GameSubmission.GameOver);
    }
    this.#displayGameOverMessage();
  }




  #displayGameOverMessage() {
    return this.messageController.displayGameOverMessage(this.gameResults);
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
