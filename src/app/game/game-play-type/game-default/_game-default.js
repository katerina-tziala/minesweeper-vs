"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";

import {
  GameType,
  GameVSMode,
  GameAction,
  GameEndType,
  GameSubmission,
} from "GameEnums";
import { GameViewHelper } from "./_game-view-helper";
import {
  ACTION_BUTTONS,
  BOARD_SECTION,
  DASHBOARD_SECTION,
} from "./_game.constants";

import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
  MinesweeperBoard
} from "GamePlayComponents";

import { GameTimer, MinesweeperBoardController } from "GamePlayControllers";
import { CONFIRMATION } from "../../../components/modal/modal.constants";
import { BoardActionsController } from "GamePlayControllers";

import { Game } from "../_game";


export class GameDefault extends Game {
  #MinesweeperBoard;

  //round statistics
  constructor(id, params, player) {
    super(id, params);
    this.player = player;
    this.players = [this.player];

    // this.turnSettings.turnTimer = true;
    // this.turnSettings.consecutiveTurns = true;
    // this.turnSettings.turnDuration = 12;
    // this.turnSettings.missedTurnsLimit = 3;


    this.optionsSettings.wrongFlagHint = true;

    this.optionsSettings.tileFlagging = true;
    this.optionsSettings.openStrategy = false;

    this.optionsSettings.unlimitedFlags = true;

    this.optionsSettings.tileRevealing = true;
    this.optionsSettings.marks = true;

    this.optionsSettings.sneakPeek = true;
    this.optionsSettings.sneakPeekDuration = 5;

    //console.log(this.turnSettings);
    console.log(this.optionsSettings);


    this.#MinesweeperBoard = new MinesweeperBoardController(this.id, this.levelSettings,
      this.wrongFlagHint, this.turnSettings,
      this.handleTileRevealing.bind(this), this.handleTileMarking.bind(this), this.onRoundTimerEnd.bind(this));
  }

  set roundTilesUpdate(newMoveTiles = []) {
    this.roundTiles = this.roundTiles.concat(newMoveTiles);
  }

  get playerOnTurn() {
    return this.player;
  }

  get dashboardFaceColor() {
    if (this.optionsSettings.vsMode) {
      return this.playerOnTurn.colorType;
    }
    return undefined;
  }

  get gameBoard() {
    return this.#MinesweeperBoard;
  }

  get allowMarks() {
    return this.optionsSettings ? this.optionsSettings.marks : false;
  }

  initState() {
    super.initState();
    this.initRoundTiles();
  }

  initRoundTiles() {
    this.roundTiles = [];
  }

  generateView() {
    const gameContainer = document.createDocumentFragment();
    gameContainer.append(this.gameBoard.generateView(this.boardActions));
    return gameContainer;
  }

  get onAfterViewInit() {
    this.gameBoard.faceColorType = this.dashboardFaceColor;
    return this.gameBoard.initView();
  }

  #checkGameStart() {
    if (this.isIdle) {
      this.setGameStart();
      this.gameBoard.startGameTimer();
    }
  }

  get gameActionAllowed() {
    if (this.isOver) {
      return false;
    }
    this.#checkGameStart();
    return true;
  }

  // HANDLE TILE REVEALING
  handleTileRevealing(tile) {
    if (!this.gameActionAllowed) {
      return;
    }
    if (this.revealingAllowed(tile)) {
      this.revealMinefieldArea(tile);
      return;
    }
    this.enableMinefield();
  }

  revealingAllowed(tile) {
    return tile.isUntouched || tile.isMarked;
  }

  revealMinefieldArea(tile, player = this.playerOnTurn) {
    this.gameBoard.getRevealedTilesResult(tile, player.id).then(result => {
      if (result.detonatedMine) {
        this.updateStateOnTileDetonation(result.tiles);
        return;
      }
      this.updateStateOnRevealedTiles(result.tiles);
    });
  }

  updateStateOnTileDetonation(revealedTiles, player = this.playerOnTurn) {
    this.pause();
    this.setGameEnd(GameEndType.DetonatedMine);
    player.detonatedTile = revealedTiles[0].position;
  }

  updateStateOnRevealedTiles(revealedTiles, player = this.playerOnTurn) {
    player.revealedTiles = this.getTilesPositions(revealedTiles);
  }

  getTilesPositions(tiles) {
    return tiles.map((tile) => tile.position);
  }

  // HANDLE TILE MARKING
  handleTileMarking(tile) {
    if (!this.gameActionAllowed) {
      return;
    }
    // set flag
    if (this.flaggingAllowed(tile)) {
      this.updateStateOnFlaggedTile(tile);
      return;
    }
    // set mark
    if (this.markingAllowed(tile)) {
      this.updateStateOnMarkedTile(tile);
      return;
    }
    // reset
    if (this.resetingAllowed(tile)) {
      this.updateStateOnResetedTile(tile);
      return;
    }

    this.enableMinefield();
  }

  flaggingAllowed(tile, player = this.playerOnTurn) {
    if (!tile.isFlagged && !tile.isMarkedBy(player.id) && player.hasFlags) {
      return true;
    }
    return false;
  }

  markingAllowed(tile, player = this.playerOnTurn) {
    return tile.isFlaggedBy(player.id) && this.allowMarks;
  }

  resetingAllowed(tile) {
    if (tile.isMarkedBy(this.playerOnTurn.id)) {
      return true;
    }
    if (tile.isFlaggedBy(this.playerOnTurn.id) && !this.allowMarks) {
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

  setFlagOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setFlag(player.id, player.colorType, this.wrongFlagHint);
    player.flaggedTile(tile.position, tile.isWronglyFlagged);
  }

  setMarkOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setMark(player.id, player.colorType);
    this.playerOnTurn.markedTile = tile.position;
  }

  resetMinefieldTile(tile, player = this.playerOnTurn) {
    tile.resetState();
    player.resetedTile = tile.position;
  }







  getPlayerDetectedMines(player) {
    return this.wrongFlagHint ? player.minesDetected : player.placedFlags;
  }

  get detectedMines() {
    let detectedMines = 0;
    this.players.forEach(
      (player) => (detectedMines += this.getPlayerDetectedMines(player)),
    );
    return detectedMines;
  }











  // MINEFIELD
  disableMinefield() {
    this.gameBoard.disableMinefield();
  }

  enableMinefield() {
    this.gameBoard.enableMinefield();
  }

  revealMinefield() {
    this.gameBoard.revealMinefield();
  }

  get freezerId() {
    return this.gameBoard.freezerId;
  }

  // MINES COUNTER
  updateMinesCounter() {
    this.gameBoard.updateMinesCounter();
  }

  // TIMER
  continueTimer() {
    this.gameBoard.continueTimer();
  }

  stopTimer() {
    this.gameBoard.stopTimer();
  }

  onRoundTimerEnd() {
    return;
  }

  pause() {
    this.gameBoard.pause();
  }

  continue() {
    this.gameBoard.continue();
  }

  onGameOver(boardTiles = []) {
    // TODO: ROUND STATISTICS
    this.roundTilesUpdate = boardTiles;
    this.setGameBoardOnGameOver();
  }

  setGameBoardOnGameOver() {
    this.gameBoard.onGameOver(this.playerOnTurn);

  }

}
