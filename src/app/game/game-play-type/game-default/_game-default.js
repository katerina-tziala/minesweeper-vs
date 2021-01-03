"use strict";

import { GameOverType } from "GameEnums";

import { Game } from "../_game";

export class GameDefault extends Game {
  #MinesweeperBoard;

  //round statistics
  constructor(id, params, player) {
    super(id, params);
    this.player = player;
    this.players = [this.player];


    this.optionsSettings.openStrategy = false;

    this.optionsSettings.sneakPeek = true;

    this.optionsSettings.sneakPeekDuration = 3;

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

  }

  // get minefieldActions() {
  //   return {
  //     onTileDetonation: this.onTileDetonation.bind(this),
  //     onRevealedTiles: this.onRevealedTiles.bind(this),
  //     onFlaggedTile: this.onFlaggedTile.bind(this),
  //     onMarkedTile: this.onMarkedTile.bind(this),
  //     onResetedTile: this.onResetedTile.bind(this),
  //   }
  // }

  set gameBoardController(boardController) {
    this.#MinesweeperBoard = boardController;
  }

  get gameBoard() {
    return this.#MinesweeperBoard;
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
    this.setGameEnd(GameOverType.DetonatedMine);
    player.detonatedTile = revealedTiles[0].position;
  }

  updateStateOnRevealedTiles(revealedTiles, player = this.playerOnTurn) {
    player.revealedTiles = this.getTilesPositions(revealedTiles);
  }

  getTilesPositions(tiles) {
    return this.gameBoard.getTilesPositions(tiles);
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

  revealingAllowed(tile) {
    return this.gameBoard.revealingAllowed(tile);
  }

  flaggingAllowed(tile) {
    return this.gameBoard.flaggingAllowed(tile);
  }

  markingAllowed(tile) {
    return this.gameBoard.markingAllowed(tile);
  }

  resetingAllowed(tile) {
    return this.gameBoard.resetingAllowed(tile);
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

  setFlagOnMinefieldTile(tile) {
    this.gameBoard.setFlagOnMinefieldTile(tile);
  }

  setMarkOnMinefieldTile(tile) {
    this.gameBoard.setMarkOnMinefieldTile(tile);
  }

  resetMinefieldTile(tile) {
    this.gameBoard.resetMinefieldTile(tile);
  }

  // MINEFIELD
  disableMinefield() {
    this.gameBoard.disableMinefield();
  }

  enableMinefield() {
    this.gameBoard.enableMinefield();
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
    this.setStatisticsOnRoundEnd(boardTiles);
    this.setGameBoardOnGameOver();
  }

  setGameBoardOnGameOver() {
    this.gameBoard.setBoardOnGameOver(this.playerOnTurn);
  }
}
