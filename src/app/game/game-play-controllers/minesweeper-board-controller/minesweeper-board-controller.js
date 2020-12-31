"use strict";
import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
  MinesweeperBoard,
  Dashboard
} from "GamePlayComponents";

import { GameAction } from "GameEnums";
import { GameTimer } from "GamePlayControllers";
export class MinesweeperBoardController {
  #_faceColorType;
  #_levelSettings;
  #_wrongFlagHint;
  // FUNCTIONS
  #onTileRevealing;
  #onTileMarking;
  // HANDLERS
  #MinesweeperBoard;
  #Dashboard;
  #MineField;
  #MineCounter;
  #FaceIcon;
  #GameTimer;

  constructor(gameId, params, onTileRevealing, onTileMarking, onRoundTimerEnd) {
    this.#_levelSettings = params.levelSettings;
    this.#_wrongFlagHint = params.optionsSettings.wrongFlagHint;
    this.#onTileRevealing = onTileRevealing;
    this.#onTileMarking = onTileMarking;
    this.#MinesweeperBoard = new MinesweeperBoard(gameId);
    this.#MineField = new MineField(
      gameId,
      this.#_levelSettings,
      this.#onActiveTileChange.bind(this),
      this.#onTileAction.bind(this),
    );
    this.#initDashboardHandlers(gameId, params.turnSettings, onRoundTimerEnd);
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
      return;
    });
  }

  #onActiveTileChange(activeTileOnBoard) {
    activeTileOnBoard ? this.setSurpriseFace() : this.setSmileFace();
  }

  #onTileAction(action, tile) {
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
  get roundTimer() {
    return this.#GameTimer.roundTimer;
  }

  startRoundTimer() {
    if (this.roundTimer) {
      this.startTimer();
    }
  }

  startGameTimer() {
    if (!this.roundTimer) {
      this.#GameTimer.start(1);
    }
  }

  startTimer() {
    this.#GameTimer.start();
  }

  stopTimer() {
    this.#GameTimer.stop();
  }

  continueTimer() {
    this.#GameTimer.continue();
  }

  timerRunning() {
    return this.#GameTimer.timerRunning;
  }

  setNotificationUpdate(onPointNotify, notificationPoint) {
    return this.#GameTimer.setNotificationUpdate(onPointNotify, notificationPoint);
  }

  get timerValue() {
    return this.#GameTimer.timerValue;
  }

  // MINEFIELD
  get mineField() {
    return this.#MineField;
  }

  disableMinefield() {
    this.mineField.disable();
  }

  enableMinefield() {
    this.mineField.enable();
  }

  revealMinefield() {
    this.mineField.revealField();
  }

  get freezerId() {
    return this.mineField.freezerId;
  }

  getRevealedTilesResult(tile, playerId) {
    return this.mineField.getRevealedTilesResult(tile, playerId);
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
    const minesToDetect = this.#_wrongFlagHint ? this.numberOfDetectedMines : this.numberOfFlags;
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

  onGameOver(playerOnTurn) {
    this.pause();
    this.updateMinesCounter();
    this.revealMinefield();
    this.#setFaceIconOnGameEnd(playerOnTurn);
  }

  initBoardOnRound(player) {
    this.faceColorType = player.colorType;
    return this.setSmileFace().then(() => {
      this.updateMinesCounter();
      return;
    });
  }

  setBoardOnRoundEnd() {
    this.updateMinesCounter();
    if (this.roundTimer) {
      this.pause();
    }
  }

  setDashboardOnSneakPeek(opponentColorType) {
    this.updateMinesCounter();
    this.setRollingEyesFace(opponentColorType);
  }

  setDashboardAfterSneakPeek() {
    this.setSmileFace();
    this.updateMinesCounter();
    this.enableMinefield();
  }
}
