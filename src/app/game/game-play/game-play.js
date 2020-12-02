"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";


import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION, DASHBOARD_SECTION, ACTION_BUTTONS } from "./game-play.constants";

import { User } from "~/_models/user";


import { GameType, GameAction } from "Game";

import { MineField } from "./mine-field/mine-field";
import { DashboardFaceIcon } from "./dashboard-face-icon/dashboard-face-icon";
import { DigitalCounter } from "./digital-counter/digital-counter";

import { CONFIRMATION } from "../../components/modal/modal.constants";





export class GamePlay {
  #_game;
  #_timerInterval;

  constructor(game, actions) {
    this.game = game;
    this.actionsAllowed = true;
    this.actions = actions;

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
    this.stopTimer();


    console.log(this.game.levelSettings);
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
    this.#checkGameStart();
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


  get timerStarted() {
    return this.#_timerInterval ? true : false;
  }

  stopTimer() {
    clearInterval(this.#_timerInterval);
    this.#_timerInterval = undefined;
  }

  setGameTimer() {
    this.stopTimer();
    this.timeCounter.value = 1;
    this.#_timerInterval = setInterval(() => {
      this.timeCounter.value = this.timeCounter.value + 1;
    }, 1000);
  }

  setRoundTimer() {
    this.stopTimer();
    this.timeCounter.value = this.game.roundDuration;
    this.#_timerInterval = setInterval(() => {
      this.timeCounter.value = this.timeCounter.value - 1;
      if (this.timeCounter.value === 0) {
        this.stopTimer();
        console.log("turn ended");
      }
    }, 1000);
  }

  #checkGameStart() {
    if (!this.timerStarted && !this.game.startedAt) {
      this.game.startedAt = new Date().toISOString();
      this.setGameTimer();
    }
  }

  startGameRound() {
    console.log("startGameRound");

    this.game.startRound();
    this.dashboardFaceIcon.setSmileFace(this.game.dashboardIconColor);
    this.mineCounter.value = this.game.minesToDetect;

    if (this.game.roundTimer) {
      console.log("set round styles");
      this.setRoundTimer();
      //console.log(this.game.playerOnTurn);
    }

    this.mineField.toggleMinefieldFreezer(false);
  }


  start() {
    //console.log("startGame");

    this.#init();
    this.#initGameView.then(() => {
      this.timeCounter.value = 0;
      if (this.game.roundTimer) {
        this.game.startedAt = new Date().toISOString();
        //console.log(this.game.playerOnTurn);
      }
      if (!this.game.singlePlayer) {
        console.log("show start modal");
      }
      this.startGameRound();
    });

  }


  reStart() {
    this.game.init();
    this.#init();
    this.start();
  }




  onGameEnd() {
    console.log("onGameEnd");
    console.log(this.game);

    this.stopTimer();
    this.game.player.lost ?
      this.dashboardFaceIcon.setLostFace(this.game.dashboardIconColor)
      : this.dashboardFaceIcon.setWinnerFace(this.game.dashboardIconColor);
  }







  // PRIVATE FUNCTIONS
  get #initGameView() {
    const renderViewParts = [this.#renderMineField(), this.#renderDashboard(), this.#renderActionButtons()];
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

  #renderActionButtons() {
    const sectionId = this.#getBoardSectionID(BOARD_SECTION.boardActions);
    return this.#getClearedBoardSection(sectionId)
      .then(actionsContainer => {
        if (this.actionsAllowed) {
          const resetButton = this.#generateActionButton(ACTION_BUTTONS.reset, this.#onReset.bind(this));
          const restartButton = this.#generateActionButton(ACTION_BUTTONS.restart, this.#onRestart.bind(this));
          const exitButton = this.#generateActionButton(ACTION_BUTTONS.exit, this.#onExit.bind(this));
          actionsContainer.append(resetButton, restartButton, exitButton);
          ElementHandler.display(actionsContainer);
        } else {
          ElementHandler.hide(actionsContainer);
        }
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

  #generateActionButton(params, action) {
    const actionButton = ElementGenerator.generateButton(params, action);
    ElementHandler.addStyleClass(actionButton, DOM_ELEMENT_CLASS.actionButton);
    return actionButton;
  }






  #confirmAction(confirmation = CONFIRMATION.quitGame) {
    this.stopTimer();
    return new Promise(resolve => {
      if (this.game.startedAt && !this.game.isOver) {
        self.modal.displayConfirmation(confirmation, (confirmed) => {
          resolve(confirmed);
        });
      } else {// excecute the action immediately
        resolve(true);
      }
    });
  }

  #onExit() {
    this.#confirmAction().then(confirmed => {
      confirmed ? this.actions.onExit() : this.continueGame();
    });
  }

  #onRestart() {
    this.#confirmAction(CONFIRMATION.restartGame).then(confirmed => {
      confirmed ? this.reStart() : this.continueGame();
    });
  }

  #onReset() {
    this.#confirmAction().then(confirmed => {
      confirmed ? this.actions.onReset() : this.continueGame();
    });
  }






  continueGame() {
    console.log(this.game.startedAt);
    console.log(this.timeCounter.value);
    console.log("continueGame");
    // this.stopTimer();
    // this.timeCounter.value = 1;
    // this.#_timerInterval = setInterval(() => {
    //   this.timeCounter.value = this.timeCounter.value + 1;
    // }, 1000);

  }
  continueGameTimer() {
    console.log(this.game.startedAt);
    console.log(this.timeCounter.value);
    // this.stopTimer();
    // this.timeCounter.value = 1;
    // this.#_timerInterval = setInterval(() => {
    //   this.timeCounter.value = this.timeCounter.value + 1;
    // }, 1000);

  }

  // if (this.game.roundTimer) {
  //   console.log("set round styles");
  //   this.setRoundTimer();
  //   //console.log(this.game.playerOnTurn);
  // }
}
