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

    //this.turnSettings.turnTimer = false;
    this.turnSettings.consecutiveTurns = true;
    this.turnSettings.turnDuration = 5;
    this.turnSettings.missedTurnsLimit = 3;

    // this.optionsSettings.unlimitedFlags = false;
    // this.optionsSettings.tileRevealing = false;
    this.optionsSettings.marks = true;
    //console.log(this.turnSettings);
    console.log(this.optionsSettings);
    this.init();
    this.vsDashboard = new GameVSDashboard(!this.isDetectMinesGoal);
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
        return this.vsDashboard.initCardsState(this.players);
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
    this.initMoveTiles();

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

  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    this.resetPlayerTurnsAfterMove().then(() => {
      this.onGameOver(revealedTiles);
    });
  }

  // CLASS SPECIFIC FUNCTIONS
  get #roundTimer() {
    return this.turnSettings && this.turnSettings.turnTimer;
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

  roundEnded(boardTiles) {
    return true;
  }

  get #maxAllowedFlags() {
    return !this.optionsSettings.unlimitedFlags
      ? this.levelSettings.numberOfMines
      : null;
  }

  switchTurns() {
    this.players.forEach((player) => player.toggleTurn());
  }

  resetPlayerTurnsAfterMove(player = this.playerOnTurn) {
    if (this.turnSettings.consecutiveTurns && player.missedTurns) {
      player.resetMissedTurns();
      return this.vsDashboard.updatePlayerMissedTurns(player);
    }
    return Promise.resolve();
  }

  updatePlayerAllowedFlags(player = this.playerOnTurn) {
    return this.vsDashboard.updatePlayerAllowedFlags(player);
  }

  updatePlayerTurnsAndAllowedFlags(player = this.playerOnTurn) {
    const playerUpdates = [this.vsDashboard.updatePlayerAllowedFlags(player)];
    playerUpdates.push(this.resetPlayerTurnsAfterMove());
    return Promise.all(playerUpdates);
  }

  resetingAllowed(tile, player = this.playerOnTurn) {
    return (
      (tile.isFlaggedBy(player.id) && !this.allowMarks) ||
      tile.isMarkedBy(player.id)
    );
  }

  handleTileMarking(tile) {
    if (this.flaggingAllowed(tile)) { // set flag
      this.updateStateOnFlaggedTile(tile);
      return;
    }

    if (this.markingAllowed(tile)) { // set mark
      this.updateStateOnMarkedTile(tile);
      return;
    }
  
    if (this.resetingAllowed(tile)) { // reset
      this.updateStateOnResetedTile(tile);
      return;
    }

    console.log("round continue");
    console.log("NO RESET NO FLAG NO MARK");
    console.log(tile);
    this.mineField.enable();
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
  
  onPlayerMoveEnd(boardTiles = []) {
    return;
  }




  onRoundEnd(boardTiles = []) {
    this.pause();
    this.moveTilesUpdate = boardTiles;
    this.playerOnTurn.increaseMoves();

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
