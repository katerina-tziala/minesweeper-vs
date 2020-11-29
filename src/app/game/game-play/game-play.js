"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";


import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION, DASHBOARD_SECTION } from "./game-play.constants";

import { User } from "~/_models/user";


import { GameType, GameAction } from "Game";

import { MineField } from "./mine-field/mine-field";
import { DashboardFaceIcon } from "./dashboard-face-icon/dashboard-face-icon";
import { DigitalCounter } from "./digital-counter/digital-counter";






export class GamePlay {
  #_game;

  constructor(game) {
    this.game = game;

  }

  set game(game) {
    this.#_game = game;
  }

  get game() {
    return this.#_game;
  }

  get boardContainer() {
    return ElementHandler.getByID(this.game.id);
  }

  get boardMineTypeStyleClass() {
    return DOM_ELEMENT_CLASS.board + TYPOGRAPHY.doubleHyphen + LocalStorageHelper.retrieve("settings").mineType;
  }

  generateGameBoard() {
    const board = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.board, this.boardMineTypeStyleClass], this.game.id);
    Object.values(BOARD_SECTION).forEach(sectionName => {
      board.append(this.#generateBoardSection(sectionName));
    });
    return board;
  }


  #init() {
    this.mineField = new MineField(this.game.levelSettings, this.#onActiveTileChange.bind(this), this.#onTileAction.bind(this));
    this.dashboardFaceIcon = new DashboardFaceIcon(this.#getBoardSectionID(DASHBOARD_SECTION.actionStateIcon));
    this.mineCounter = new DigitalCounter(this.#getBoardSectionID(DASHBOARD_SECTION.mineCounter));
    this.timeCounter = new DigitalCounter(this.#getBoardSectionID(DASHBOARD_SECTION.timeCounter));
  }


  #onActiveTileChange(activeTile) {
    activeTile
      ? this.dashboardFaceIcon.setSurpriseFace(this.game.dashboardIconColor)
      : this.dashboardFaceIcon.setSmileFace(this.game.dashboardIconColor)
  }


  #onTileAction(action, tile) {
    // if (this.game.startedAt) {

    // }
    if (action === GameAction.Mark) {
      this.handleTileMarking(tile);
      return;
    }
    this.revealTile(tile);
  }

  handleTileMarking(tile, playerOnTurn = this.game.playerOnTurn) {
    if (tile.isUntouched) {
      tile.setFlag(playerOnTurn.id, playerOnTurn.colorType, this.game.wrongFlagHint);
      this.onPlayerMove([tile]);
    } else {
      this.handleTileActionWhenTileTouched(tile, playerOnTurn);
    }
  }

  handleTileActionWhenTileTouched(tile, playerOnTurn = this.game.playerOnTurn) {
    if (this.game.allowMarks && !tile.isMarked) {
      tile.setMark(playerOnTurn.id, playerOnTurn.colorType);
    } else {
      tile.resetState();
    }
    this.onPlayerMove([tile]);
  }

  revealTile(tile, playerOnTurn = this.game.playerOnTurn) {
    if (tile.isUntouched) {
      this.mineField.revealMinefieldTile(tile, playerOnTurn.id).then(boardTiles => {
        this.onPlayerMove(boardTiles);
      });
    } else {
      this.mineField.toggleMinefieldFreezer(false);
    }
  }

  onPlayerMove(boardTiles) {
    this.game.updateOnPlayerMove(boardTiles);
    this.game.checkGameEnd(this.mineField);
    this.game.isOver ? this.onGameEnd() : this.onMoveEnd();
  }

  onMoveEnd() {
    this.startGameRound();
    // console.log("updateViewAfterPlayerMove");
    // console.log(this.game);

  }


  startGameRound() {
    console.log("startGameRound");

    this.game.startRound();
    this.mineField.toggleMinefieldFreezer(false);
    this.dashboardFaceIcon.setSmileFace(this.game.dashboardIconColor);

    this.mineCounter.value = this.game.minesToDetect;
    this.timeCounter.value = 0;

  }

  startGame() {
    //console.log("startGame");

    this.#init();
    this.#initGameView.then(() => {

      this.startGameRound();


    });

  }






  onGameEnd() {
    console.log("onGameEnd");
    console.log(this.game);
    console.log();
    this.game.player.lost ?
      this.dashboardFaceIcon.setLostFace(this.game.dashboardIconColor)
      : this.dashboardFaceIcon.setWinnerFace(this.game.dashboardIconColor);
  }







  // PRIVATE FUNCTIONS
  get #initGameView() {
    const renderViewParts = [this.#renderMineField(), this.#renderDashboard()];
    return Promise.all(renderViewParts);

  }

  #getBoardSectionID(sectionName) {
    return sectionName + TYPOGRAPHY.doubleHyphen + this.game.id;
  }

  #renderMineField() {
    const sectionId = this.#getBoardSectionID(BOARD_SECTION.mineField);
    return this.#getClearedBoardSection(sectionId)
      .then(mineFieldContainer => {
        mineFieldContainer.append(this.mineField.generateMinefield);
        return Promise.resolve();
      });
  }

  #getClearedBoardSection(sectionId) {
    return ElementHandler.getByID(sectionId)
      .then(boardSection => {
        ElementHandler.clearContent(boardSection);
        return boardSection;
      });
  }

  #renderDashboard() {
    const sectionId = this.#getBoardSectionID(BOARD_SECTION.dashBoard);
    return this.#getClearedBoardSection(sectionId)
      .then(dashBoardContainer => {
        const actionStateIconContainer = this.#generateBoardSection(DASHBOARD_SECTION.actionStateIcon);
        const timeCounter = this.#generateCounter(DASHBOARD_SECTION.timeCounter, this.timeCounter);
        const mineCounter = this.#generateCounter(DASHBOARD_SECTION.mineCounter, this.mineCounter);
        dashBoardContainer.append(mineCounter, actionStateIconContainer, timeCounter);
        return Promise.resolve();
      });
  }

  #generateBoardSection(sectionName) {
    return ElementGenerator.generateContainer([sectionName], this.#getBoardSectionID(sectionName));
  }

  #generateCounter(name, counter) {
    const counterContainer = this.#generateBoardSection(name);
    counterContainer.append(counter.generateCounter);
    return counterContainer;
  }

}
