"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";

import { GameType, GameVSMode, GameAction, GameEndType, GameSubmission } from "GameEnums";
import { GameViewHelper } from "./_game-view-helper";
import {
  ACTION_BUTTONS,
  BOARD_SECTION,
  DASHBOARD_SECTION,
} from "./_game.constants";

import {
  DigitalCounter,
  GameTimer,
  DashboardFaceIcon,
  MineField,
} from "GamePlayComponents";

import { CONFIRMATION } from "../../../components/modal/modal.constants";

export class Game extends AppModel {
  #dashBoardActions = {};

  //round statistics
  constructor(id, params, player) {
    super();
    this.update(params);
    this.id = id ? id : this.type;
    this.player = player;
    this.players = [this.player];
    this.createdAt = nowTimestamp();
    this.onActionTimer = true;
    // catch error on interface update
  }

  set dashBoardActions(actions) {
    return (this.#dashBoardActions = actions);
  }

  get isOnline() {
    if (
      this.optionsSettings.vsMode &&
      this.optionsSettings.vsMode === GameVSMode.Online
    ) {
      return true;
    }
    return false;
  }

  get isOver() {
    return this.gameOverType ? true : false;
  }

  get isIdle() {
    return !this.startedAt ||
      this.isOver ||
      this.players.every((player) => !player.moves)
      ? true
      : false;
  }

  get allowMarks() {
    return this.optionsSettings ? this.optionsSettings.marks : false;
  }

  get wrongFlagHint() {
    return this.optionsSettings ? this.optionsSettings.wrongFlagHint : false;
  }

  setGameStart() {
    this.startedAt = nowTimestamp();
  }

  setGameEnd(type) {
    if (type && type.length) {
      this.gameOverType = type;
      this.completedAt = nowTimestamp();
    }
  }

  initState() {
    this.initRoundTiles();
    this.gameOverType = null;
    this.completedAt = null;
    this.startedAt = null;
  }

  initRoundTiles() {
    this.roundTiles = [];
  }

  set roundTilesUpdate(newMoveTiles = []) {
    this.roundTiles = this.roundTiles.concat(newMoveTiles);
  }

  getPlayerDetectedMines(player) {
    return this.wrongFlagHint ? player.minesDetected : player.placedFlags;
  }

  get detectedMines() {
    let detectedMines = 0;
    this.players.forEach(
      (player) => (detectedMines += this.getPlayerDetectedMines(player)),
    );
    return detectedMines;
  }

  get dashboardFaceColor() {
    if (
      this.optionsSettings.vsMode &&
      this.optionsSettings.vsMode !== GameVSMode.Parallel
    ) {
      return this.playerOnTurn.colorType;
    }
    return undefined;
  }

  initTimeCounter() {
    const params = this.gameTimerSettings;
    params.id = this.getBoardSectionID(DASHBOARD_SECTION.timeCounter);
    this.gameTimer = new GameTimer(params, this.onRoundTimerEnd.bind(this));
  }

  #onActiveTileChange(activeTile) {
    if (!this.isOver) {
      this.checkGameStart();
      activeTile ? this.setSurpriseFace() : this.setSmileFace();
    }
  }

  onTileAction(action, tile) {
    if (!this.isOver) {
      action === GameAction.Mark
        ? this.handleTileMarking(tile)
        : this.handleTileRevealing(tile);
    }
  }

  revealingAllowed(tile) {
    return tile.isUntouched || tile.isMarked;
  }

  handleTileRevealing(tile) {
    if (this.revealingAllowed(tile.isUntouched)) {
      this.revealMinefieldArea(tile);
      return;
    }
    this.mineField.enable();
  }

  revealMinefieldArea(tile, player = this.playerOnTurn) {
    this.mineField
    .revealMinefieldTile(tile, player.id)
    .then((revealedTiles) => {
      if (this.tileDetonated(revealedTiles)) {
        this.updateStateOnTileDetonation(revealedTiles);
        return;
      }
      this.updateStateOnRevealedTiles(revealedTiles);
    });
  }

  markingAllowed(tile, player = this.playerOnTurn) {
    return tile.isFlaggedBy(player.id) && this.allowMarks;
  }

  tileDetonated(boardTiles) {
    return boardTiles.length === 1 && boardTiles[0].isDetonatedMine;
  }

  checkGameStart() {
    if (!this.gameTimer.isRunning && this.isIdle) {
      this.setGameStart();
      this.gameTimer.start();
    }
  }

  updateMineCounter() {
    this.mineCounter.value =
      this.levelSettings.numberOfMines - this.detectedMines;
  }

  getBoardSectionID(sectionName) {
    return GameViewHelper.getBoardSectionID(sectionName, this.id);
  }

  renderMineField() {
    return GameViewHelper.getClearedGameSection(
      this.getBoardSectionID(BOARD_SECTION.mineField),
    ).then((container) => {
      container.append(this.mineField.generate());
      return;
    });
  }

  get gameBoard() {
    const gameContainer = document.createDocumentFragment();
    const board = GameViewHelper.generateBoard(this.id);
    board.insertBefore(this.boardActions, board.firstChild);
    gameContainer.append(board);
    return gameContainer;
  }

  get boardActions() {
    const boardActions = GameViewHelper.generateBoardSection(
      BOARD_SECTION.boardActions,
      this.id,
    );
    const boardActionButtons = this.boardActionButtons;
    if (boardActionButtons.length) {
      boardActionButtons.forEach((button) => boardActions.append(button));
    } else {
      ElementHandler.hide(boardActions);
    }
    return boardActions;
  }

  get onViewInit() {
    const viewParts = [
      this.renderMineField(),
      this.mineCounter.generate(),
      this.dashboardFace.init(),
      this.gameTimer.generate(),
    ];
    return Promise.all(viewParts);
  }

  get onAfterViewInit() {
    return this.initViewControllers.then(() => this.onViewInit);
  }

  setSmileFace() {
    this.dashboardFace.setSmileFace(this.dashboardFaceColor);
  }

  setSurpriseFace() {
    this.dashboardFace.setSurpriseFace(this.dashboardFaceColor);
  }

  setFaceIconOnGameEnd() {
    this.playerOnTurn.lostGame
      ? this.dashboardFace.setLostFace(this.dashboardFaceColor)
      : this.dashboardFace.setWinnerFace(this.dashboardFaceColor);
  }

  initDashBoard() {
    this.gameTimer.init();
    this.updateMineCounter();
    this.setSmileFace();
  }

  pause() {
    this.gameTimer.stop();
    this.mineField.disable();
  }

  continue() {
    console.log("continue");
    this.gameTimer.continue();
    this.mineField.enable();
  }

  #executeBoardAction(action, confirmation = CONFIRMATION.quitGame) {
    this.pause();
    if (action) {
      this.isIdle
        ? action()
        : self.modal.displayConfirmation(confirmation, (confirmed) => {
            confirmed ? action() : this.continue();
          });
    }
  }

  onExit() {
    console.log("onExit - check online");
    this.#executeBoardAction(this.#dashBoardActions.onExit.bind(this));
    return;
  }

  onRestart() {
    console.log("onRestart");
    this.#executeBoardAction(this.restart.bind(this), CONFIRMATION.restartGame);
  }

  onReset() {
    console.log("onReset");
    this.#executeBoardAction(
      this.#dashBoardActions.onReset.bind(this),
      CONFIRMATION.resetGame,
    );
    return;
  }

  // OVERRIDEN FUNCTIONS
  get gameTimerSettings() {
    const step = 1;
    const limit = null;
    const initialValue = 0;
    return { step, limit, initialValue };
  }

  get playerOnTurn() {
    return this.player;
  }

  get boardActionButtons() {
    const boardActions = [];
    boardActions.push(
      GameViewHelper.generateActionButton(
        ACTION_BUTTONS.exit,
        this.onExit.bind(this),
      ),
    );
    if (!this.isOnline) {
      boardActions.push(
        GameViewHelper.generateActionButton(
          ACTION_BUTTONS.restart,
          this.onRestart.bind(this),
        ),
      );
      boardActions.push(
        GameViewHelper.generateActionButton(
          ACTION_BUTTONS.reset,
          this.onReset.bind(this),
        ),
      );
    }
    return boardActions;
  }

  get initViewControllers() {
    this.mineCounter = new DigitalCounter(
      this.getBoardSectionID(DASHBOARD_SECTION.mineCounter),
    );
    this.dashboardFace = new DashboardFaceIcon(
      this.getBoardSectionID(DASHBOARD_SECTION.actionStateIcon),
    );
    this.initTimeCounter();
    this.mineField = new MineField(
      this.id,
      this.levelSettings,
      this.#onActiveTileChange.bind(this),
      this.onTileAction.bind(this),
    );
    return Promise.resolve();
  }

  generateView() {
    const gameContainer = document.createDocumentFragment();
    gameContainer.append(this.gameBoard);
    return gameContainer;
  }

  init() {
    return;
  }

  start() {
    return;
  }

  restart() {
    // this.levelSettings.setMinesPositions();
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

  handleTileMarking(tile) {
    return;
  }

  onRoundTimerEnd() {
    return;
  }

  /* UPDATE GAME AFTER MINEFIELD ACTIONS */
  updateStateOnTileDetonation(revealedTiles, player = this.playerOnTurn) {
    this.pause();
    this.setGameEnd(GameEndType.DetonatedMine);
    player.detonatedTile = revealedTiles[0].position;
  }

  updateStateOnRevealedTiles(revealedTiles, player = this.playerOnTurn) {
    player.revealedTiles = this.mineField.getTilesPositions(revealedTiles);
  }

  setFlagOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setFlag(player.id, player.colorType, this.wrongFlagHint);
    player.flaggedTile(tile.position, tile.isWronglyFlagged);
    this.updateMineCounter();
  }

  setMarkOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setMark(player.id, player.colorType);
    this.playerOnTurn.markedTile = tile.position;
    this.updateMineCounter();
  }

  resetMinefieldTile(tile, player = this.playerOnTurn) {
    tile.resetState();
    player.resetedTile = tile.position;
    this.updateMineCounter();
  }

  ////////////////////////////////
  submitResult(type) {
    //TODO:
    console.log("--  submit game state -- ");
    console.log("----------------------------");
    console.log("update state: ", type);
    //console.log(this);

  }

  onGameOver(boardTiles = []) {
    this.pause();
    // TODO: ROUND STATISTICS
    this.roundTilesUpdate = boardTiles;
    // Board state
    this.setFaceIconOnGameEnd();
    this.mineField.revealField();
  }
}
