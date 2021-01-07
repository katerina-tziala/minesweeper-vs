"use strict";
import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
  MinefieldFreezer,
  MinesweeperBoard,
  Dashboard
} from "GamePlayComponents";

import { GameTimer } from "GamePlayControllers";
import * as FieldUtils from "../../game-play-components/mine-field/mine-field-utils";
export class BoardController {
  #_faceColorType;
  #_levelSettings;
  #_playerOnTurn;
  // HANDLERS
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



    // console.log(this.optionsSettings);


    
    this.#initMinefieldHandlers(gameId);
    this.#initDashboardHandlers(gameId, params.turnSettings, onRoundTimerEnd);
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
    //  if (!this.playerOnTurn.isBot && this.playerOnTurn.turn) {
    this.#MinefieldFreezer.hide();
    // }
  }

  revealMinefield() {
    this.#MinefieldFreezer.display();
    return this.mineField.revealField();
  }






  getTilesPositions(tiles) {
    return FieldUtils.tilesPositions(tiles);
  }

  //TODO: check logic per game
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

  resetingAllowed(tile, player = this.playerOnTurn) {
    if (tile.isMarkedBy(this.playerOnTurn.id)) {
      return true;
    }
    if (tile.isFlaggedBy(player.id) && !this.allowMarks) {
      return true;
    }

    return false;
  }

  handleTileMarking(tile) {
    this.disableMinefield();
    // set flag
    if (this.flaggingAllowed(tile)) {
      this.onFlaggedTile(tile);
      return;
    }
    // set mark
    if (this.markingAllowed(tile)) {
      this.onMarkedTile(tile);
      return;
    }
    // reset
    if (this.resetingAllowed(tile)) {
      this.onResetedTile(tile);
      return;
    }

    this.enableMinefield();
  }

  handleTileRevealing(tile) {
    this.disableMinefield();

    if (this.revealingAllowed(tile)) {
      this.revealMinefieldArea(tile);
      return;
    }

    this.enableMinefield();
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
    if (this.minefieldActions.onRevealedTiles) {
      this.minefieldActions.onRevealedTiles(boardTiles);
    }
  }

  setFlagOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setFlag(player.id, player.colorType, this.wrongFlagHint);
    player.flaggedTile(tile.position, tile.isWronglyFlagged);
  }

  onFlaggedTile(tile) {
    this.setFlagOnMinefieldTile(tile);
    this.updateMinesCounter();
    if (this.minefieldActions.onFlaggedTile) {
      this.minefieldActions.onFlaggedTile(tile);
    }
  }

  resetMinefieldTile(tile, player = this.playerOnTurn) {
    tile.resetState();
    player.resetedTile = tile.position;
  }

  onResetedTile(tile) {
    this.resetMinefieldTile(tile);
    this.updateMinesCounter();
    if (this.minefieldActions.onResetedTile) {
      this.minefieldActions.onResetedTile(tile);
    }
  }

  setMarkOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setMark(player.id, player.colorType);
    player.markedTile = tile.position;
  }

  onMarkedTile(tile) {
    this.setMarkOnMinefieldTile(tile);
    this.updateMinesCounter();
    if (this.minefieldActions.onMarkedTile) {
      this.minefieldActions.onMarkedTile(tile);
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
    });
  }

  setDashboardoardOnGameOver(isDraw) {
    this.pause();
    this.updateMinesCounter();
    this.#setFaceIconOnGameEnd(isDraw);
  }
}
