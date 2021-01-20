"use strict";
import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
  MinefieldFreezer,
  MinesweeperBoard,
  Dashboard,
  MineFieldUtils
} from "GamePlayComponents";
import { GameAction } from "GameEnums";
import { GameTimer } from "GamePlayControllers";

export class BoardController {
  #_faceColorType;
  #_levelSettings;
  #_playerOnTurn;
  #MinesweeperBoard;
  #Dashboard;
  #MineField;
  #MinefieldFreezer;
  #MineCounter;
  #FaceIcon;
  #GameTimer;

  constructor(gameId, params, minefieldActions, onRoundTimerEnd) {
    this.#_levelSettings = params.levelSettings;
    this.optionsSettings = params.optionsSettings;
    this.minefieldActions = minefieldActions;
    this.#MinesweeperBoard = new MinesweeperBoard(gameId);
    this.#initMinefieldHandlers(gameId);
    this.#initDashboardHandlers(gameId, params.turnSettings, onRoundTimerEnd);
  }

  #initMinefieldHandlers(gameId) {
    this.#MinefieldFreezer = new MinefieldFreezer(gameId);
    this.#MineField = new MineField(
      gameId,
      this.#_levelSettings,
      this.optionsSettings,
      this.#onActiveTileChange.bind(this),
      this.#onTileAction.bind(this),
    );
  }

  #initDashboardHandlers(gameId, turnSettings, onRoundTimerEnd) {
    this.#Dashboard = new Dashboard(gameId);
    this.#MineCounter = new DigitalCounter(this.#Dashboard.mineCounterId);
    this.#FaceIcon = new DashboardFaceIcon(gameId);
    this.#GameTimer = new GameTimer(turnSettings, this.#Dashboard.timerId, onRoundTimerEnd);
  }

  set playerOnTurn(player) {
    this.#_playerOnTurn = player;
  }

  get playerOnTurn() {
    return this.#_playerOnTurn;
  }

  get wrongFlagHint() {
    return this.optionsSettings ? this.optionsSettings.wrongFlagHint : false;
  }

  get strategyAllowed() {
    return true;
  }

  set faceColorType(type) {
    this.#_faceColorType = type;
  }

  get #faceColorType() {
    return this.#_faceColorType;
  }

  #initMinesCounter() {
    return this.#MineCounter.generate().then(() => {
      this.#MineCounter.updateValue(this.#_levelSettings.numberOfMines);
      return;
    });
  }

  #initTimer() {
    return this.#GameTimer.generate();
  }

  #initMinefield() {
    return this.#MinesweeperBoard.clearedMinefieldContainer.then(minefieldContainer => {
      minefieldContainer.append(this.mineField.generate());
      minefieldContainer.append(this.#MinefieldFreezer.generateView());
      return;
    });
  }

  #onActiveTileChange(activeTileOnBoard) {
    activeTileOnBoard ? this.setSurpriseFace() : this.setSmileFace();
  }

  #onTileAction(action, tile) {
    if (this.minefieldActions.onTileAction) {
      this.minefieldActions.onTileAction(action, tile);
    }
  }

  generateView(actionsContainer) {
    const gameContainer = this.#MinesweeperBoard.generatedBoardContainer;
    const board = this.#MinesweeperBoard.generateView();
    const dashboard = this.#Dashboard.generateView(this.#FaceIcon.generateIcon());
    this.#MinesweeperBoard.insertOnBoardAsFirst(board, dashboard);
    this.#MinesweeperBoard.insertOnBoardAsFirst(board, actionsContainer);
    gameContainer.append(board);
    return gameContainer;
  }

  initView() {
    const viewUpdates = [this.#initMinefield()];
    viewUpdates.push(this.setSmileFace());
    viewUpdates.push(this.#initMinesCounter());
    viewUpdates.push(this.#initTimer());
    return Promise.all(viewUpdates);
  }

  // TIMER
  get gameTimer() {
    return this.#GameTimer;
  }

  get timerRunning() {
    return this.gameTimer.isRunning;
  }

  get roundTimer() {
    return this.gameTimer.roundTimer;
  }

  get timerValue() {
    return this.gameTimer.value;
  }

  startRoundTimer() {
    if (this.roundTimer) {
      this.startTimer();
    }
  }

  startGameTimer() {
    if (!this.roundTimer && !this.timerRunning) {
      this.gameTimer.start(1);
    }
  }

  startTimer() {
    this.gameTimer.start();
  }

  stopTimer() {
    this.gameTimer.stop();
  }

  continueTimer() {
    this.gameTimer.continue();
  }

  // MINEFIELD
  get mineField() {
    return this.#MineField;
  }

  get mineFieldTiles() {
    return this.#MineField.tiles;
  }

  get minefieldCleared() {
    return this.mineField.isCleared;
  }

  get allMinesDetected() {
    return this.mineField.allMinesDetected;
  }

  get numberOfDetectedMines() {
    return this.mineField.numberOfDetectedMines;
  }

  get numberOfFlags() {
    return this.mineField.numberOfFlags;
  }

  get freezerId() {
    return this.#MinefieldFreezer.freezerId;
  }

  displayFreezerLoader(player) {
    return this.#MinefieldFreezer.displayLoader(player.colorType);
  }

  disableMinefield() {
    this.#MinefieldFreezer.display();
  }

  enableMinefield() {
    if (!this.playerOnTurn.isBot && this.playerOnTurn.turn) {
      this.#MinefieldFreezer.hide();
    }
  }

  revealMinefield() {
    this.#MinefieldFreezer.display();
    return this.mineField.revealField();
  }


  handleTileAction(action, tile) {
    if (action === GameAction.Mark) {
      this.handleTileMarking(tile);
      return;
    }
    this.handleTileRevealing(tile);
  }

  getTilesPositions(tiles) {
    return MineFieldUtils.tilesPositions(tiles);
  }

  //TODO: check logic per game
  revealingAllowed(tile) {
    return this.mineField.revealingAllowed(tile);
  }

  markingAllowed(tile) {
    return this.mineField.markingAllowed(tile, this.playerOnTurn);
  }

  resetingAllowed(tile) {
    return this.mineField.resetingAllowed(tile, this.playerOnTurn);
  }

  flaggingAllowed(tile) {
    return this.mineField.flaggingAllowed(tile, this.playerOnTurn);
  }

  handleTileMarking(tile) {
    // set flag
    if (this.flaggingAllowed(tile)) {
      this.disableMinefield();
      this.onFlaggedTile(tile);
      return;
    }
    // set mark
    if (this.markingAllowed(tile)) {
      this.disableMinefield();
      this.onMarkedTile(tile);
      return;
    }
    // reset
    if (this.resetingAllowed(tile)) {
      this.disableMinefield();
      this.onResetedTile(tile);
      return;
    }
    this.submitAbortedAction();
  }

  submitAbortedAction() {
    if (this.minefieldActions.onActionAborted) {
      this.minefieldActions.onActionAborted();
    }
  }

  onFlaggedTile(tile) {
    this.mineField.setFlagOnMinefield(tile, this.playerOnTurn).then(() => {
      this.updateMinesCounter();
      if (this.minefieldActions.onFlaggedTile) {
        this.minefieldActions.onFlaggedTile(tile);
      }
    });
  }

  onMarkedTile(tile) {
    this.mineField.setMarkOnMinefield(tile, this.playerOnTurn).then(() => {
      this.updateMinesCounter();
      if (this.minefieldActions.onMarkedTile) {
        this.minefieldActions.onMarkedTile(tile);
      }
    });
  }

  onResetedTile(tile) {
    this.mineField.resetTile(tile, this.playerOnTurn).then(() => {
      this.updateMinesCounter();
      if (this.minefieldActions.onResetedTile) {
        this.minefieldActions.onResetedTile(tile);
      }
    });
  }

  handleTileRevealing(tile) {
    if (this.revealingAllowed(tile)) {
      this.disableMinefield();
      this.revealMinefieldArea(tile);
      return;
    }
    this.submitAbortedAction();
  }

  revealMinefieldArea(tile, player = this.playerOnTurn) {
    this.mineField.getRevealedTiles(tile, player.id).then(result => {
      if (result.detonatedMine) {
        this.onTileDetonation(result.tiles);
        return;
      }
      this.onRevealedTiles(result.tiles);
    });

  }

  onTileDetonation(boardTiles, player = this.playerOnTurn) {
    this.pause();
    player.detonatedTile = boardTiles[0].position;
    if (this.minefieldActions.onTileDetonation) {
      this.minefieldActions.onTileDetonation(boardTiles);
    }
  }

  onRevealedTiles(boardTiles, player = this.playerOnTurn) {
    const tilesPositions = this.getTilesPositions(boardTiles);
    player.revealedTiles = tilesPositions;
    this.submitTileRevealing(boardTiles);
  }

  submitTileRevealing(boardTiles, cleared = false) {
    if (this.minefieldActions.onRevealedTiles) {
      this.minefieldActions.onRevealedTiles(boardTiles, cleared);
    }
  }

  // FACE ICON
  setSurpriseFace() {
    return this.#FaceIcon.setSurpriseFace(this.#faceColorType);
  }

  setRollingEyesFace(colorType) {
    return this.#FaceIcon.setRollingEyesFace(colorType);
  }

  setSmileFace() {
    return this.#FaceIcon.setSmileFace(this.#faceColorType);
  }

  #setFaceIconOnGameEnd(isDraw) {
    if (isDraw) {
      this.#FaceIcon.setGrintSquintFace();
      return;
    }
    this.playerOnTurn.lostGame
      ? this.#FaceIcon.setLostFace(this.#faceColorType)
      : this.#FaceIcon.setWinnerFace(this.#faceColorType);
  }

  // MINES COUNTER
  updateMinesCounter() {
    const minesToDetect = this.wrongFlagHint ? this.numberOfDetectedMines : this.numberOfFlags;
    this.#MineCounter.updateValue(this.#_levelSettings.numberOfMines - minesToDetect);
  }

  // SET BOARD STATE
  pause() {
    this.stopTimer();
    this.disableMinefield();
  }

  continue() {
    this.continueTimer();
    this.enableMinefield();
  }

  setBoardOnGameOver(isDraw) {
    return this.revealMinefield().then(() => {
      this.setDashboardoardOnGameOver(isDraw);
      return;
    });
  }

  setDashboardoardOnGameOver(isDraw) {
    this.pause();
    this.updateMinesCounter();
    this.#setFaceIconOnGameEnd(isDraw);
  }
}
