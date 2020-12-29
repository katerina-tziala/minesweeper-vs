"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./minesweeper-board-controller.constants";

import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
  MinesweeperBoard,
  Dashboard
} from "GamePlayComponents";

import {
  GameType,
  GameVSMode,
  GameAction,
  GameEndType,
  GameSubmission,
} from "GameEnums";





import { GameTimer } from "GamePlayControllers";


export class MinesweeperBoardController {
  #gameId;
  #_faceColorType;
  #levelSettings;
  #wrongFlagHint;


  #onTileRevealing;
  #onTileMarking;

  #MinesweeperBoard;
  #Dashboard;
  #MineField;

  #MineCounter;
  #FaceIcon;
  #GameTimer;


  constructor(gameId, levelSettings, wrongFlagHint, turnSettings, onTileRevealing, onTileMarking, onRoundTimerEnd) {
    //this.#gameId = gameId;
    this.#levelSettings = levelSettings;
    this.#wrongFlagHint = wrongFlagHint;

    this.#onTileRevealing = onTileRevealing;
    this.#onTileMarking = onTileMarking;

    this.#MinesweeperBoard = new MinesweeperBoard(gameId);
    this.#Dashboard = new Dashboard(gameId);
    this.#MineField = new MineField(
      gameId,
      this.#levelSettings,
      this.#onActiveTileChange.bind(this),
      this.#onTileAction.bind(this),
    );


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

  #initMinesCounter() {
    return this.#MineCounter.generate().then(() => {
      this.#MineCounter.updateValue(this.#levelSettings.numberOfMines);
      return;
    });
  }

  #initTimer() {
    this.#GameTimer.initialValue = 0;
    this.#GameTimer.value = 0;
    return this.#GameTimer.generate();
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
  get roundTimer() {
    return this.#GameTimer.roundTimer;
  }

  startRoundTimer() {
    if (this.roundTimer) {
      this.startTimer();
    }
  }

  startGameTimer() {
    this.#GameTimer.initialValue = 1;
    this.startTimer();
  }


  startTimer() {
    return this.#GameTimer.start();
  }

  stopTimer() {
    return this.#GameTimer.stop();
  }

  continueTimer() {
    return this.#GameTimer.continue();
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
    const minesToDetect = this.#wrongFlagHint ? this.numberOfDetectedMines : this.numberOfFlags;
    this.#MineCounter.updateValue(this.#levelSettings.numberOfMines - minesToDetect);
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
