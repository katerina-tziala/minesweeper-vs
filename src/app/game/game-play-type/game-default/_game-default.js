"use strict";

import { GameOverType, GameAction } from "GameEnums";

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

  get minefieldActions() {
    return {
      onTileAction: this.#onTileAction.bind(this),
      onTileDetonation: this.onTileDetonation.bind(this),
      onRevealedTiles: this.onRevealedTiles.bind(this)
    }
  }

  #onTileAction(action, tile) {
    if (!this.gameActionAllowed) {
      return;
    }
    if (action === GameAction.Mark) {
      this.gameBoard.handleTileMarking(tile);
      return;
    }
    this.gameBoard.handleTileRevealing(tile);
  }

  onTileDetonation() {
    return;
  }

  onRevealedTiles() {
    return;
  }

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

  // TIMER
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
    //check for draw for board face
  }

  setGameBoardOnGameOver() {
    this.gameBoard.setBoardOnGameOver(this.playerOnTurn);
  }
}
