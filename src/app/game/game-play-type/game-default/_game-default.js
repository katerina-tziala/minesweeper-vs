"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";

import {
  GameType,
  GameVSMode,
  GameAction,
  GameEndType,
  GameSubmission,
} from "GameEnums";
import { GameViewHelper } from "./_game-view-helper";
import {
  ACTION_BUTTONS,
  BOARD_SECTION,
  DASHBOARD_SECTION,
} from "./_game.constants";

import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
} from "GamePlayComponents";

import { GameTimer } from "GamePlayControllers";
import { CONFIRMATION } from "../../../components/modal/modal.constants";
import { BoardActionsController } from "GamePlayControllers";

import { Game } from "../_game";


export class GameDefault extends Game {
 
  
  //round statistics
  constructor(id, params, player) {
    super(id, params);

    this.player = player;
    this.players = [this.player];


  

    // catch error on interface update
  }





  get allowMarks() {
    return this.optionsSettings ? this.optionsSettings.marks : false;
  }

  initState() {
    super.initState();
    this.initRoundTiles();
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

  #onTileAction(action, tile) {
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
    if (this.revealingAllowed(tile)) {
      this.revealMinefieldArea(tile);
      return;
    }
    this.enableMinefield();
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

  resetingAllowed(tile) {
    if (tile.isMarkedBy(this.playerOnTurn.id)) {
      return true;
    }
    if (tile.isFlaggedBy(this.playerOnTurn.id) && !this.allowMarks) {
      return true;
    }

    return false;
  }

  flaggingAllowed(tile, player = this.playerOnTurn) {
    if (!tile.isFlagged && !tile.isMarkedBy(player.id) && player.hasFlags) {
      return true;
    }
    return false;
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

  setSmileFace(color = this.dashboardFaceColor) {
    this.dashboardFace.setSmileFace(color);
  }

  setRollingEyesFace(color = this.dashboardFaceColor) {
    this.dashboardFace.setRollingEyesFace(color);
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
    this.disableMinefield();
  }

  continue() {
    console.log("continue");
    this.gameTimer.continue();
    this.enableMinefield();
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

  get initViewControllers() {
    this.mineCounter = new DigitalCounter(
      this.getBoardSectionID(DASHBOARD_SECTION.mineCounter),
    );
    this.dashboardFace = new DashboardFaceIcon(
      this.id,
      this.getBoardSectionID(DASHBOARD_SECTION.actionStateIcon),
    );
    this.initTimeCounter();
    this.mineField = new MineField(
      this.id,
      this.levelSettings,
      this.#onActiveTileChange.bind(this),
      this.#onTileAction.bind(this),
    );
    return Promise.resolve();
  }




  generateView() {
    const gameContainer = document.createDocumentFragment();
    gameContainer.append(this.#gameBoardInterface);
    return gameContainer;
  }

  get #gameBoardInterface() {
    const gameContainer = GameViewHelper.generateBoardContainer();
    const board = GameViewHelper.generateBoard(this.id);
    ElementHandler.addInChildNodes(board, this.boardActions, 0);
    gameContainer.append(board);
    return gameContainer;
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
  
 


  

  
  init() {
    return;
  }

  start() {
    return;
  }


  handleTileMarking(tile) {
    // set flag
    if (this.flaggingAllowed(tile)) {
      this.updateStateOnFlaggedTile(tile);
      return;
    }
    // set mark
    if (this.markingAllowed(tile)) {
      this.updateStateOnMarkedTile(tile);
      return;
    }
    // reset
    if (this.resetingAllowed(tile)) {
      this.updateStateOnResetedTile(tile);
      return;
    }

    this.enableMinefield();
  }

  updateStateOnFlaggedTile(tile) {
    return;
  }

  updateStateOnMarkedTile(tile) {
    return;
  }

  updateStateOnResetedTile(tile) {
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
  }

  setMarkOnMinefieldTile(tile, player = this.playerOnTurn) {
    tile.setMark(player.id, player.colorType);
    this.playerOnTurn.markedTile = tile.position;
  }

  resetMinefieldTile(tile, player = this.playerOnTurn) {
    tile.resetState();
    player.resetedTile = tile.position;
  }



  onGameOver(boardTiles = []) {
    this.pause();
    // TODO: ROUND STATISTICS
    this.roundTilesUpdate = boardTiles;
    // Board state
    this.setFaceIconOnGameEnd();
    this.revealMinefield();
  }
}
