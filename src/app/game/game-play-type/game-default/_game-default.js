"use strict";

import { GameEndType } from "GameEnums";
import { MinesweeperBoardController } from "GamePlayControllers";
import { Game } from "../_game";

export class GameDefault extends Game {
  #MinesweeperBoard;

  //round statistics
  constructor(id, params, player) {
    super(id, params);
    this.player = player;
    this.players = [this.player];

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

    this.#gameBoardController = params;
  }

  set #gameBoardController(params) {
    this.#MinesweeperBoard = new MinesweeperBoardController(this.id,
      params,
      this.handleTileRevealing.bind(this),
      this.handleTileMarking.bind(this),
      this.onRoundTimerEnd.bind(this));
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

  get viewInitUpdates() {
    const viewUpdates = [this.gameBoard.initView()];
    return viewUpdates;
  }

  get onAfterViewInit() {
    this.gameBoard.faceColorType = this.dashboardFaceColor;
    return Promise.all(this.viewInitUpdates);
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
