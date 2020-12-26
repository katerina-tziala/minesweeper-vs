"use strict";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameType, GameVSMode, GameEndType, GameSubmission } from "GameEnums";

import { GameDefault } from "../_game-default";

import { VSDashboardController } from "GamePlayControllers";

import { GameViewHelper } from "../_game-view-helper";
import {
  VSBoard,
} from "GamePlayComponents";

export class GameVS extends GameDefault {
  constructor(id, params, player, opponent) {
    super(id, params, player);
    this.opponent = opponent;
    this.players = [this.player, this.opponent];
    this.levelSettings.minesPositions = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      73,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
    ];
  
    this.turnSettings.turnTimer = false;
    // this.turnSettings.consecutiveTurns = true;
    // this.turnSettings.turnDuration = 12;
    // this.turnSettings.missedTurnsLimit = 3;

    // //this.optionsSettings.wrongFlagHint = true;

    this.optionsSettings.tileFlagging = true;
    this.optionsSettings.openStrategy = false;

    this.optionsSettings.unlimitedFlags = true;
  
     this.optionsSettings.tileRevealing = true;
    this.optionsSettings.marks = true;

    this.optionsSettings.sneakPeek = true;
    this.optionsSettings.sneakPeekDuration = 5;

    //console.log(this.turnSettings);
    console.log(this.optionsSettings);
    this.init();
    this.setDashBoard();
  }

  setDashBoard() {
    this.vsDashboard = new VSDashboardController(
      this.wrongFlagHint,
      !this.isDetectMinesGoal,
    );
  }

  // OVERRIDEN FUNCTIONS
  get gameTimerSettings() {
    const timerSettings = super.gameTimerSettings;
    if (this.roundTimer) {
      timerSettings.step = -1;
      timerSettings.limit = 0;
      timerSettings.initialValue = this.turnSettings.turnDuration;
    }
    return timerSettings;
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

  generateView() {
    const gameContainer = super.generateView();
    // const vsDashboard = this.vsDashboard.generateView(
    //   this.player,
    //   this.opponent,
    // );
    const vsDashboard = this.#generateVSDashBoard();

    gameContainer.insertBefore(vsDashboard, gameContainer.firstChild);



    const footer = GameViewHelper.generateGameFooter();
    

    gameContainer.append(footer);






    return gameContainer;
  }

  #generateVSDashBoard() {
    const vsDashboard = this.vsDashboard.generateView(
      this.player,
      this.opponent,
    );
    const vsBoard = VSBoard.generateView(this.player.colorType, this.opponent.colorType);
    this.vsDashboard.addElementInDashboard(vsDashboard, vsBoard);
    return vsDashboard;
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






  initPlayersCards() {
    const targetValuesForPlayers = this.players.map((player) =>
      this.getPlayerTargetValue(player),
    );
    return this.vsDashboard.initCardsState(
      this.players,
      targetValuesForPlayers,
    );
  }

  get onAfterViewInit() {
    return super.onAfterViewInit.then(() => this.initPlayersCards());
  }


  start() {
    console.log(this.levelSettings.minesPositions);
    this.onAfterViewInit
      .then(() => {
        this.initDashBoard();

        if (this.roundTimer) {
          console.log("kkk");
          this.setGameStart();
        }

        console.log("START GameVS GAME");
        console.log("----------------------------");
        console.log(" show start modal message");
        this.startGameRound();
      });
  }

  startRoundTimer() {
    if (this.roundTimer) {
      this.gameTimer.start();
    }
  }

  startGameRound() {
    // TODO: ROUND STATISTICS
    this.initRoundTiles();
    this.setSmileFace();
    this.startRoundTimer();

    this.vsDashboard.setCardOnTurn(this.players).then(() => {
      if (this.playerOnTurn.isBot) {
        this.startBotRound();
        return;
      }

      this.mineField.enable();
    });
  }

  //TODO: COMPLETE THE CASES
  startBotRound() {
    //TODO:
    console.log("--  get Bot move -- ");
    console.log("GameVS");
    console.log("----------------------------");
    //this.mineField.disable();
    this.mineField.enable();
  }

  restart() {
    super.restart();
    const playersIds = this.players.map((player) => player.id);
    this.playerStartID = randomValueFromArray(playersIds);
    this.init();
    this.start();
  }

  onRoundTimerEnd() {
    this.playerOnTurn.increaseMissedTurns();

    if (this.playerOnTurn.exceededTurnsLimit) {
      this.setGameEnd(GameEndType.ExceededTurnsLimit);
    }
    this.updatePlayerCardMissedTurns().then(() => {
      if (this.isOver) {
        this.onGameOver();
        return;
      }
      this.onRoundEnd();
    });
  }

  /* UPDATE GAME AFTER MINEFIELD ACTIONS */
  playerMissedTurnsReseted(player = this.playerOnTurn) {
    if (
      this.turnSettings &&
      this.turnSettings.resetMissedTurns &&
      player.missedTurns
        ? true
        : false
    ) {
      player.resetMissedTurns();
      return true;
    }
    return false;
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
    return this.turnSettings && this.turnSettings.roundTimer;
  }

  get #turnsLimit() {
    return this.turnSettings ? this.turnSettings.missedTurnsLimit : null;
  }

  switchTurns() {
    this.players.forEach((player) => player.toggleTurn());
  }

  /* UPDATE PLAYER CARD */
  updatePlayerCardMissedTurns(player = this.playerOnTurn) {
    return this.vsDashboard.updatePlayerMissedTurns(player);
  }

  updatePlayerCardAllowedFlags(player = this.playerOnTurn) {
    return this.vsDashboard.updatePlayerAllowedFlags(player);
  }

  /* HANDLE GAME STATE AFTER PLAYER ACTION */
  onPlayerMoveEnd(boardTiles = []) {
    this.updateMineCounter();
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
    this.mineField.enable();
  }

  stopRoundTimer() {
    if (this.roundTimer) {
      this.pause();
    }
  }

  //TODO: COMPLETE THE CASES
  onRoundEnd(boardTiles = []) {
    this.updateMineCounter();
    this.stopRoundTimer();
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
    console.log("GameVS");
    console.log("----------------------------");
    console.log("show end modal message");
    console.log(this.playerOnTurn);
  }

  getCardUpdates(turnsUpdate = false, player = this.playerOnTurn) {
    const updates = [];

    if (turnsUpdate) {
      updates.push(this.updatePlayerCardMissedTurns(player));
    }

    return updates;
  }
}
