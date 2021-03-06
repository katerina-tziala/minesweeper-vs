"use strict";
import { Game } from "../_game";

export class GameDefault extends Game {
  #MinesweeperBoard;

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

  }


  set gameBoard(boardController) {
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

  get viewInitUpdates() {
    const viewUpdates = [this.gameBoard.initView()];
    return viewUpdates;
  }

  get onAfterViewInit() {
    this.gameBoard.faceColorType = this.dashboardFaceColor;
    return Promise.all(this.viewInitUpdates);
  }

  generateView() {
    const gameContainer = document.createDocumentFragment();
    gameContainer.append(this.gameBoard.generateView(this.boardActions));
    return gameContainer;
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
  get freezerId() {
    return this.gameBoard.freezerId;
  }

  get minefieldActions() {
    return {
      onTileAction: this.#onTileAction.bind(this),
      onTileDetonation: this.onTileDetonation.bind(this),
      onRevealedTiles: this.onRevealedTiles.bind(this),
      onActionAborted: this.checkBotAction.bind(this)
    };
  }

  #onTileAction(action, tile) {
    if (!this.gameActionAllowed) {
      return;
    }
    this.gameBoard.handleTileAction(action, tile);
  }

  onTileDetonation() {
    return;
  }

  onRevealedTiles() {
    return;
  }

  disableMinefield() {
    this.gameBoard.disableMinefield();
  }

  enableMinefield() {
    this.gameBoard.enableMinefield();
  }

  displayMinefieldLoader(player = this.player) {
    return this.gameBoard.displayFreezerLoader(player);
  }

  submitBotMove() {
    if (!this.isOver) {
      this.playerOnTurn.getMove(this.gameBoard.mineFieldTiles).then(result => {
        if (!this.isOver && this.gameBoard.timerRunning && result && this.playerOnTurn.isBot) {
          console.log("submitBotMove", result);
          this.#onTileAction(result.action, result.tile);
        }
      });
    }
  }

  checkBotAction() {
    if (!this.isOver && this.playerOnTurn.isBot) {
      this.submitBotMove();
    }
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

  onGameOver(gameOverType, boardTiles = []) {
    this.setGameEnd(gameOverType);
    this.setStatisticsOnRoundEnd(boardTiles);
    this.setGameBoardOnGameOver();
  }

  setGameBoardOnGameOver(isDraw = this.isDraw) {
    this.gameBoard.setBoardOnGameOver(isDraw);
  }
}
