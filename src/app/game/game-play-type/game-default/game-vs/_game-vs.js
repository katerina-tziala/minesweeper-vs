"use strict";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameType, GameVSMode, GameEndType } from "GameEnums";

import { Game } from "../_game";

import { GameVSDashboard } from "../../game-vs-dashboard/game-vs-dashboard";

export class GameVS extends Game {
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
    //this.turnSettings.turnTimer = false;
    // this.turnSettings.consecutiveTurns = true;
    // this.turnSettings.turnDuration = 5;
    // this.turnSettings.missedTurnsLimit = 3;

    // this.optionsSettings.unlimitedFlags = false;
    // this.optionsSettings.tileRevealing = false;
    //this.optionsSettings.marks = true;
    //console.log(this.turnSettings);
    console.log(this.optionsSettings);
    this.init();
    this.vsDashboard = new GameVSDashboard(
      !this.isDetectMinesGoal,
      this.wrongFlagHint,
    );
  }

  // OVERRIDEN FUNCTIONS
  get gameTimerSettings() {
    const timerSettings = super.gameTimerSettings;
    if (this.#roundTimer) {
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

  generateView() {
    const gameContainer = super.generateView();
    const vsDashboard = this.vsDashboard.generateView(
      this.player,
      this.opponent,
    );
    gameContainer.insertBefore(vsDashboard, gameContainer.firstChild);
    return gameContainer;
  }

  init() {
    // console.log(this.#maxAllowedFlags);
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

  start() {
    console.log(this.levelSettings.minesPositions);
    this.onAfterViewInit
      .then(() => {
        return this.vsDashboard.initCardsState(
          this.players,
          this.players.map((player) => this.getPlayerTargetValue(player)),
        );
      })
      .then(() => {
        this.initDashBoard();
        if (this.#roundTimer) {
          this.setGameStart();
        }
        console.log("start VS GAME");
        // console.log(this.playerOnTurn);
        // console.log("show start modal");
        this.startGameRound();
      });
  }

  startGameRound() {
    this.initRoundTiles();

    this.vsDashboard.setCardOnTurn(this.players).then(() => {
      if (this.#roundTimer) {
        this.gameTimer.start();
      }
      console.log("-- on Start Round --");

      //keep round number
      if (this.playerOnTurn.isBot) {
        console.log("get BotMove");
        //this.mineField.disable();
        this.mineField.enable();
      } else {
        this.mineField.enable();
      }
    });
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
    this.vsDashboard.updatePlayerMissedTurns(this.playerOnTurn).then(() => {
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

  removeFromPlayerMarkedPositions(revealedTiles, player = this.playerWaiting) {
    player.removeFromMarkedPositions = this.mineField.getTilesPositions(
      revealedTiles,
    );
  }

  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated).then(() => {
      this.onGameOver(revealedTiles);
    });
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);
    this.removeFromPlayerMarkedPositions(revealedTiles);
  }

  flagOnTileAllowedByPlayer(tile, player = this.playerOnTurn) {
    if (!tile.isFlagged && !tile.isMarkedBy(player.id)) {
      return true;
    }
    return false;
  }

  setFlagOnMinefieldTile(tile) {
    super.setFlagOnMinefieldTile(tile);
    this.removeFromPlayerMarkedPositions([tile]);
  }

  resetingAllowed(tile, player = this.playerOnTurn) {
    return (
      (tile.isFlaggedBy(player.id) && !this.allowMarks) ||
      tile.isMarkedBy(player.id)
    );
  }

  handleTileMarking(tile) {
    if (this.flaggingAllowed(tile)) {
      // set flag
      this.updateStateOnFlaggedTile(tile);
      return;
    }

    if (this.markingAllowed(tile)) {
      // set mark
      this.updateStateOnMarkedTile(tile);
      return;
    }

    if (this.resetingAllowed(tile)) {
      // reset
      this.updateStateOnResetedTile(tile);
      return;
    }

    this.mineField.enable();
  }

  // resetPlayerTurnsAfterMove(player = this.playerOnTurn) {
  //   if (
  //     this.#roundTimer &&
  //     this.turnSettings.consecutiveTurns &&
  //     player.missedTurns
  //   ) {
  //
  //     player.resetMissedTurns();
  //     return this.vsDashboard.updatePlayerMissedTurns(player);
  //   }
  //   return Promise.resolve();
  // }

  // CLASS SPECIFIC FUNCTIONS
  // FUNCTIONS TO HANDLE TURNS
  get #roundTimer() {
    return this.turnSettings && this.turnSettings.roundTimer;
  }

  get #turnsLimit() {
    return this.turnSettings ? this.turnSettings.missedTurnsLimit : null;
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

  updatePlayerTurnsAndAllowedFlags(player = this.playerOnTurn) {
    const playerUpdates = [this.updatePlayerAllowedFlags(player)];
    playerUpdates.push(this.resetPlayerTurnsAfterMove());
    return Promise.all(playerUpdates);
  }





  updatePlayerCardGameInfo(player = this.playerOnTurn) {
    const playerUpdates = [this.updatePlayerTurnsAndAllowedFlags(player)];
    playerUpdates.push(this.updatePlayerGameGoalStatistics());
    return Promise.all(playerUpdates);
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

  roundEnded(boardTiles) {
    return true;
  }

  //
  onPlayerMoveEnd(boardTiles = []) {
    return;
  }

  onRoundEnd(boardTiles = []) {
    this.pause();
    this.roundTilesUpdate = boardTiles;

    console.log("-- onRoundEnd --");
    if (this.isOnline) {
      console.log("submit online round");
      console.log(this.playerOnTurn);
      return;
    }

    console.log("go on the next round");
    this.switchTurns();
    this.startGameRound();
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);
    console.log("-- onGameOver --");

    if (this.isOnline) {
      console.log("onGameOver online");
      return;
    }

    console.log(this);
    console.log("show end modal message");
    console.log("ganme vs end");
  }
}
