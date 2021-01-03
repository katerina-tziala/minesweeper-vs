"use strict";
import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
  MinefieldFreezer,
  MinesweeperBoard,
  Dashboard
} from "GamePlayComponents";

import { GameAction } from "GameEnums";
import { GameTimer } from "GamePlayControllers";

export class MinesweeperBoardController {
  #_faceColorType;
  #_levelSettings;
  #_playerOnTurn;
  // FUNCTIONS
  #onTileRevealing;
  #onTileMarking;
  // HANDLERS
  #MinesweeperBoard;
  #Dashboard;
  #MineField;
  #MinefieldFreezer;
  #MineCounter;
  #FaceIcon;
  #GameTimer;


  constructor(gameId, params, onTileRevealing, onTileMarking, onRoundTimerEnd) {
    this.#_levelSettings = params.levelSettings;
    this.optionsSettings = params.optionsSettings;
    this.#onTileRevealing = onTileRevealing;
    this.#onTileMarking = onTileMarking;
    this.#MinesweeperBoard = new MinesweeperBoard(gameId);
    this.#initMinefieldHandlers(gameId);
    this.#initDashboardHandlers(gameId, params.turnSettings, onRoundTimerEnd);
  }

  set playerOnTurn(player) {
    return this.#_playerOnTurn = player;
  }

  get playerOnTurn() {
    return this.#_playerOnTurn;
  }

  get wrongFlagHint() {
    return this.optionsSettings ? this.optionsSettings.wrongFlagHint : false;
  }

  get allowMarks() {
    return this.optionsSettings ? this.optionsSettings.marks : false;
  }

  #initMinefieldHandlers(gameId) {
    this.#MinefieldFreezer = new MinefieldFreezer(gameId);
    this.#MineField = new MineField(
      gameId,
      this.#_levelSettings,
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

  set faceColorType(type) {
    this.#_faceColorType = type;
  }

  get #faceColorType() {
    return this.#_faceColorType;
  }

  get #board() {
    return this.#MinesweeperBoard;
  }

  get #dashboard() {
    return this.#Dashboard;
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
    return this.#board.clearedMinefieldContainer.then(minefieldContainer => {
      minefieldContainer.append(this.mineField.generate());
      minefieldContainer.append(this.#MinefieldFreezer.generateView());
      return;
    });
  }

  #onActiveTileChange(activeTileOnBoard) {
    activeTileOnBoard ? this.setSurpriseFace() : this.setSmileFace();
  }

  #onTileAction(action, tile) {
    this.disableMinefield();
    if (action === GameAction.Mark) {
      this.#onTileMarking(tile);
      return;
    }
    this.#onTileRevealing(tile);
  }

  generateView(actionsContainer) {
    const gameContainer = this.#board.generatedBoardContainer;
    const board = this.#board.generateView();
    const dashboard = this.#dashboard.generateView(this.#FaceIcon.generateIcon());
    this.#board.insertOnBoardAsFirst(board, dashboard);
    this.#board.insertOnBoardAsFirst(board, actionsContainer);
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
    if (!this.roundTimer) {
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

  timerRunning() {
    return this.gameTimer.timerRunning;
  }

  // MINEFIELD
  get mineField() {
    return this.#MineField;
  }

  displayFreezerLoader(player) {
    return this.#MinefieldFreezer.displayLoader(player.colorType);
  }

  get freezerId() {
    return this.#MinefieldFreezer.freezerId;
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
    this.mineField.revealField();
    this.#MinefieldFreezer.display();
  }

  getRevealedTilesResult(tile, playerId) {
    return this.mineField.getRevealedTilesResult(tile, playerId);
  }

  getTilesPositions(tiles) {
    return this.mineField.getTilesPositions(tiles);
  }

  get minefieldCleared() {
    return this.mineField.isCleared;
  }

  get unrevealedMines() {
    return this.mineField.unrevealedMines;
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

  revealingAllowed(tile) {
    return tile.isUntouched || tile.isMarked;
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

  setFlagOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setFlag(player.id, player.colorType, this.wrongFlagHint);
    player.flaggedTile(tile.position, tile.isWronglyFlagged);
  }

  setMarkOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setMark(player.id, player.colorType);
    player.markedTile = tile.position;
  }

  resetMinefieldTile(tile, player = this.playerOnTurn) {
    tile.resetState();
    player.resetedTile = tile.position;
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

  #setFaceIconOnGameEnd(playerOnTurn) {
    playerOnTurn.lostGame
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

  setBoardOnGameOver(playerOnTurn) {
    this.pause();
    this.updateMinesCounter();
    this.revealMinefield();
    this.#setFaceIconOnGameEnd(playerOnTurn);
  }

}
