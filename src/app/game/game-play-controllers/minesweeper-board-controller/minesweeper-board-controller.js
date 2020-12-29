"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./minesweeper-board-controller.constants";

import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
  MinesweeperBoard
} from "GamePlayComponents";

import {
  GameType,
  GameVSMode,
  GameAction,
  GameEndType,
  GameSubmission,
} from "GameEnums";





import { DashboardController } from "GamePlayControllers";


export class MinesweeperBoardController {
  #gameId;
  #_faceColorType;
  #levelSettings;
  #wrongFlagHint;

  #MinesweeperBoard;
  #Dashboard;
  #MineField;
  #onTileRevealing;
  #onTileMarking;

  constructor(gameId, levelSettings, wrongFlagHint, turnSettings, onTileRevealing, onTileMarking, onRoundTimerEnd) {
    //this.#gameId = gameId;
    this.#levelSettings = levelSettings;
    this.#wrongFlagHint = wrongFlagHint;

    this.#onTileRevealing = onTileRevealing;
    this.#onTileMarking = onTileMarking;

    this.#MinesweeperBoard = new MinesweeperBoard(gameId);
    this.#Dashboard = new DashboardController(gameId, turnSettings, onRoundTimerEnd);
    this.#MineField = new MineField(
      gameId,
      this.#levelSettings,
      this.#onActiveTileChange.bind(this),
      this.#onTileAction.bind(this),
    );
  }

  set faceColorType(type) {
    this.#_faceColorType = type;
  }

  get #faceColorType() {
    return this.#_faceColorType;
  }

  get roundTimer() {
    return this.#Dashboard.roundTimer;
  }

  get #board() {
    return this.#MinesweeperBoard;
  }

  get #dashboard() {
    return this.#Dashboard;
  }

  generateView(actionsContainer) {
    const gameContainer = this.#board.generatedBoardContainer;
    const board = this.#board.generateView();
    const dashboard = this.#dashboard.generateView();
    this.#board.insertOnBoardAsFirst(board, dashboard);
    this.#board.insertOnBoardAsFirst(board, actionsContainer);
    gameContainer.append(board);
    return gameContainer;
  }

  initView() {
    const viewUpdates = [this.#initMinefield()];
    viewUpdates.push(this.#dashboard.initView(this.#levelSettings.numberOfMines, this.#faceColorType));
    return Promise.all(viewUpdates);
  }

  #initMinefield() {
    return this.#board.minefieldContainer.then(minefieldContainer => {
      ElementHandler.clearContent(minefieldContainer);
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

  // TIMER
  startRoundTimer() {
    if (this.roundTimer) {
      this.startTimer();
    }
  }

  startTimer() {
    return this.#Dashboard.startTimer();
  }

  stopTimer() {
    return this.#Dashboard.stopTimer();
  }

  continueTimer() {
    return this.#Dashboard.continueTimer();
  }

  timerRunning() {
    return this.#Dashboard.timerRunning;
  }

  setNotificationUpdate(onPointNotify, notificationPoint) {
    return this.#Dashboard.setNotificationUpdate(onPointNotify, notificationPoint);
  }
  get timerValue() {
    return this.#Dashboard.timerValue;
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
    return this.#Dashboard.setSurpriseFace(this.#faceColorType);
  }

  setRollingEyesFace(colorType) {
    return this.#Dashboard.setRollingEyesFace(colorType);
  }

  setSmileFace() {
    return this.#Dashboard.setSmileFace(this.#faceColorType);
  }

  #setFaceIconOnGameEnd(playerOnTurn) {
    playerOnTurn.lostGame
      ? this.#Dashboard.setLostFace(this.#faceColorType)
      : this.#Dashboard.setWinnerFace(this.#faceColorType);
  }

  // MINES COUNTER
  updateMinesCounter() {
    const minesToDetect = this.#wrongFlagHint ? this.numberOfDetectedMines : this.numberOfFlags;
    this.#Dashboard.updateMinesCounter(this.#levelSettings.numberOfMines - minesToDetect);
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
    this.revealMinefield();
    this.#setFaceIconOnGameEnd(playerOnTurn);
  }

  initBoardOnRound(player) {
    this.faceColorType = player.colorType;
    return this.setSmileFace().then(() => {
      this.startRoundTimer();
      return;
    });
  }
}
