"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";

import { GameType, GameVSMode } from "GameEnums";
import { GameViewHelper } from "./_game-view-helper";
import { ACTION_BUTTONS, BOARD_SECTION, DASHBOARD_SECTION } from "./_game.constants";

import {
  DigitalCounter,
  GameTimer,
  DashboardFaceIcon,
  MineField,
} from "GamePlayComponents";

export class Game extends AppModel {
  constructor(id, params, player) {
    super();
    this.update(params);
    this.id = id ? id : this.type;
    this.player = player;
    this.createdAt = nowTimestamp();
    this.onActionTimer = true;
  }

  initState() {
    this.roundTiles = [];
    this.gameOverType = null;
    this.completedAt = null;
    this.startedAt = null;
  }

  setGameStart() {
    this.startedAt = nowTimestamp();
  }

  getBoardSectionID(sectionName) {
    return GameViewHelper.getBoardSectionID(sectionName, this.id);
  }

  renderMineField() {
    return GameViewHelper.getClearedGameSection(
      this.getBoardSectionID(BOARD_SECTION.mineField)
    ).then((container) => {
      container.append(this.mineField.generateMinefield);
      return;
    });
  }

  onActiveTileChange(activeTile) {
    console.log("onActiveTileChange");
    // activeTile
    //   ? this.#dashboardFace.setSurpriseFace(this.game.dashboardIconColor)
    //   : this.#dashboardFace.setSmileFace(this.game.dashboardIconColor);
  }

  onTileAction(action, tile) {
    console.log("onTileAction");
    // this.#checkGameStart();
    // if (action === GameAction.Mark) {
    //   this.handleTileMarking(tile);
    //   return;
    // }
    // this.revealTile(tile);
  }

  initTimeCounter() {
    const params = this.gameTimerSettings;
    params.id = this.getBoardSectionID(DASHBOARD_SECTION.timeCounter);
    this.gameTimer = new GameTimer(params, this.onRoundTimerEnd.bind(this));
  }

  onRoundTimerEnd() {
    console.log("turn ended");
  }

  generateView() {
    const gameContainer = document.createDocumentFragment();
    const board = GameViewHelper.generateBoard(this.id);
    board.insertBefore(this.generatBoardActions(), board.firstChild);
    gameContainer.append(board);
    return gameContainer;
  }

  generatBoardActions() {
    const boardActions = GameViewHelper.generateBoardSection(BOARD_SECTION.boardActions, this.id);
    const boardActionButtons = this.boardActionButtons;
    if (boardActionButtons.length) {
      boardActionButtons.forEach(button => boardActions.append(button));
    } else {
      ElementHandler.hide(boardActions);
    }
    return boardActions;
  }

  get initViewControllers() {
    this.mineCounter = new DigitalCounter(
      this.getBoardSectionID(DASHBOARD_SECTION.mineCounter)
    );
    this.dashboardFace = new DashboardFaceIcon(
      this.getBoardSectionID(DASHBOARD_SECTION.actionStateIcon)
    );
    this.initTimeCounter();
    this.mineField = new MineField(
      this.id,
      this.levelSettings,
      this.onActiveTileChange.bind(this),
      this.onTileAction.bind(this)
    );
    return Promise.resolve();
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

  updateMineCounter() {
    this.mineCounter.value =
      this.levelSettings.numberOfMines - this.detectedMines;
  }

  setSmileFace() {
    this.dashboardFace.setSmileFace(this.dashboardFaceColor);
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

  initDashBoard() {
    this.gameTimer.init();
    this.updateMineCounter();
    this.setSmileFace();
  }

  get isParallel() {
    if (
      this.optionsSettings.vsMode &&
      this.optionsSettings.vsMode === GameVSMode.Parallel
    ) {
      return true;
    }
    return false;
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




  // OVERRIDEN FUNCTIONS
  get gameTimerSettings() {
    const step = 1;
    const limit = null;
    const initialValue = 0;
    return { step, limit, initialValue };
  }

  get detectedMines() {
    return 0;
  }

  get playerOnTurn() {
    return this.player;
  }

  get boardActionButtons() {
    if (this.isParallel) {
      return [];
    }
    const boardActions = [];
    boardActions.push(GameViewHelper.generateActionButton(ACTION_BUTTONS.exit, this.onExit.bind(this)));
    if (!this.isOnline) {
      boardActions.push(GameViewHelper.generateActionButton(ACTION_BUTTONS.restart, this.onRestart.bind(this)));
      boardActions.push(GameViewHelper.generateActionButton(ACTION_BUTTONS.reset, this.onReset.bind(this)));
    }
    return boardActions;
  }

  init() {
    return;
  }

  start() {
    return;
  }

  onExit() {
    console.log("onExit");
    return;
  }

  onRestart() {
    console.log("onRestart");
    return;
  }

  onReset() {
    console.log("onReset");
    return;
  }


}
