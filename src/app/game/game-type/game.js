"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";

import { GameType, GameVSMode } from "GameEnums";
import { GameViewHelper } from "./game-view-helper";
import { DOM_ELEMENT_CLASS, BOARD_SECTION, DASHBOARD_SECTION } from "./game.constants";

import {
  DigitalCounter,
  GameTimer,
  DashboardFaceIcon,
  MineField
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

  getBoardSectionID(sectionName) {
    return GameViewHelper.getBoardSectionID(sectionName, this.id);
  }

  renderMineField() {
    return GameViewHelper.getClearedGameSection(this.getBoardSectionID(BOARD_SECTION.mineField))
      .then(container => {
        container.append(this.mineField.generateMinefield);
        return;
      });
  }

  initTimeCounter() {
    const params = this.gameTimerSettings;
    params.id = this.getBoardSectionID(DASHBOARD_SECTION.timeCounter);
    this.gameTimer = new GameTimer(params, this.onTimerStopped.bind(this));
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


  onTimerStopped() {
    console.log("turn ended");
  }









  initState() {
    this.roundTiles = [];
    this.gameOverType = null;
    this.completedAt = null;
    this.startedAt = null;
  }

  generateView() {
    //const gameContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], this.#gameContainerID);
    const gameContainer = document.createDocumentFragment();
    gameContainer.append(GameViewHelper.generateBoard(this.id));
    return gameContainer;
  }

  get viewControllers() {
    this.mineCounter = new DigitalCounter(this.getBoardSectionID(DASHBOARD_SECTION.mineCounter));
    this.dashboardFace = new DashboardFaceIcon(this.getBoardSectionID(DASHBOARD_SECTION.actionStateIcon));
    this.initTimeCounter();
    this.mineField = new MineField(this.id, this.levelSettings, this.onActiveTileChange.bind(this), this.onTileAction.bind(this));
    return Promise.resolve();
  }

  get onViewInit() {
    const viewParts = [
      this.renderMineField(),
      this.mineCounter.generate(),
      this.dashboardFace.init(),
      this.gameTimer.generate(),
      //this.#renderActionButtons()
    ];
    return Promise.all(viewParts);
  }

  get onAfterViewInit() {
    return this.viewControllers.then(() => this.onViewInit);
  }

  updateMineCounter() {
    this.mineCounter.value = this.levelSettings.numberOfMines - this.detectedMines;
  }

  setSmileFace() {
    this.dashboardFace.setSmileFace(this.dashboardFaceColor);
  }


  // OVERRIDEN FUNCTIONS
  init() { }

  start() { }

  get gameTimerSettings() {
    const step = 1;
    const limit = null;
    const initialValue = 0;
    return { step, limit, initialValue };
  }

  get detectedMines() {
    return 0;
  }

  get dashboardFaceColor() {
    return undefined;
  }


}
