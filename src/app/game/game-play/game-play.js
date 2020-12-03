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

import { GameTimer } from "./game-timer/game-timer";

import { GamePlayViewHelper } from "./game-play-view-helper";



export class GamePlay {
  #_game;
  #dashboardFaceIcon;
  #mineCounter;
  #timeCounter;
  #mineField;

  constructor(game, actions) {
    this.game = game;
    this.actionsAllowed = true;
    this.actions = actions;
    this.init();
  }

  set game(game) {
    this.#_game = game;
  }

  get game() {
    return this.#_game;
  }

  init() {
    // console.log(" ------- init ------- ");
    console.log(this.game.levelSettings);

    this.#mineCounter = new DigitalCounter(this.#getBoardSectionID(DASHBOARD_SECTION.mineCounter));
    this.#dashboardFaceIcon = new DashboardFaceIcon(this.#getBoardSectionID(DASHBOARD_SECTION.actionStateIcon));
    this.#initTimeCounter();
    this.#mineField = new MineField(this.game.id, this.game.levelSettings, this.#onActiveTileChange.bind(this), this.#onTileAction.bind(this));
  }




  // MINEFIELD ACTIONS
  #onActiveTileChange(activeTile) {
    activeTile
      ? this.#dashboardFaceIcon.setSurpriseFace(this.game.dashboardIconColor)
      : this.#dashboardFaceIcon.setSmileFace(this.game.dashboardIconColor)
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
      this.#mineField.revealMinefieldTile(tile, playerOnTurn.id).then(boardTiles => {
        this.onPlayerMove(boardTiles);
      });
    } else {
      this.#mineField.toggleMinefieldFreezer(false);
    }
  }

  onPlayerMove(boardTiles) {
    this.game.updateOnPlayerMove(boardTiles);
    this.game.checkGameEnd(this.#mineField);
    this.game.isOver ? this.onGameEnd() : this.onMoveEnd();
  }

  onMoveEnd() {
    this.startGameRound();
    //console.log("updateViewAfterPlayerMove");
    // console.log(this.game);

  }

  continueGame() {
    //console.log("continueGame");
    this.#timeCounter.continue();
    this.#mineField.toggleMinefieldFreezer(false);
  }

  onGameEnd() {
    //console.log("onGameEnd");
    this.#timeCounter.stop();
    this.#mineField.toggleMinefieldFreezer(true);
    this.#boardFaceIconOnGameEnd = this.game.player.lost;
  }



  generateView() {
    const gameContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], this.#gameContainerID);
    gameContainer.append(GamePlayViewHelper.generateBoard(this.game.id));
    return gameContainer;
  }

  start() {
    this.#initGameView.then(() => {
      this.game.roundTimer ? this.game.setGameStart() : this.#timeCounter.init();

      if (!this.game.singlePlayer) {
        console.log("show start modal");
        console.log(this.game.playerOnTurn);
      }

      this.startGameRound();
    });
  }


  #setDashboardRoundState() {
    this.#mineCounter.value = this.game.minesToDetect;
    this.#dashboardFaceIcon.setSmileFace(this.game.dashboardIconColor);
    if (this.game.roundTimer) {
      this.#timeCounter.start();
    }
  }

  startGameRound() {
    this.game.startRound();
    this.#setDashboardRoundState();

    if (!this.game.singlePlayer) {
      console.log("set round styles");
    }

    this.#mineField.toggleMinefieldFreezer(false);
  }


  reStart() {
    this.game.init();
    this.init();
    this.start();
  }

  // PRIVATE FUNCTIONS
  #initTimeCounter() {
    const params = this.game.gameTimerParams;
    params.id = this.#getBoardSectionID(DASHBOARD_SECTION.timeCounter);
    this.#timeCounter = new GameTimer(params, this.#onTimerStopped.bind(this));
  }

  get #gameContainerID() {
    return DOM_ELEMENT_CLASS.container + TYPOGRAPHY.doubleHyphen + this.game.id;
  }

  set #boardFaceIconOnGameEnd(playerLost) {
    playerLost
      ? this.#dashboardFaceIcon.setLostFace(this.game.dashboardIconColor)
      : this.#dashboardFaceIcon.setWinnerFace(this.game.dashboardIconColor);
  }

  #getBoardSectionID(sectionName) {
    return GamePlayViewHelper.getBoardSectionID(sectionName, this.game.id);
  }

  #checkGameStart() {
    if (!this.#timeCounter.isRunning && this.game.isIdle) {
      this.game.setGameStart();
      this.#timeCounter.start();
    }
  }

  #onTimerStopped() {
    console.log("turn ended");
  }

  get #initGameView() {
    const renderViewParts = [
      this.#renderMineField(),
      this.#mineCounter.generate(),
      this.#dashboardFaceIcon.init(),
      this.#timeCounter.generate(),
      this.#renderActionButtons()];
    return Promise.all(renderViewParts);
  }

  #renderMineField() {
    return GamePlayViewHelper.getClearedGameSection(this.#getBoardSectionID(BOARD_SECTION.mineField))
      .then(container => {
        container.append(this.#mineField.generateMinefield);
        return Promise.resolve();
      });
  }

  // BOARD ACTIONS
  #renderActionButtons() {
    return GamePlayViewHelper.getClearedGameSection(this.#getBoardSectionID(BOARD_SECTION.boardActions))
      .then(container => {
        if (this.game.actionsAllowed) {
          const resetButton = this.#generateActionButton(ACTION_BUTTONS.reset, this.#onReset.bind(this));
          const restartButton = this.#generateActionButton(ACTION_BUTTONS.restart, this.#onRestart.bind(this));
          const exitButton = this.#generateActionButton(ACTION_BUTTONS.exit, this.#onExit.bind(this));
          container.append(resetButton, restartButton, exitButton);
          ElementHandler.display(container);
        } else {
          ElementHandler.hide(container);
        }
        return Promise.resolve();
      });
  }

  #generateActionButton(params, action) {
    const actionButton = ElementGenerator.generateButton(params, action);
    ElementHandler.addStyleClass(actionButton, DOM_ELEMENT_CLASS.actionButton);
    return actionButton;
  }

  #excecuteBoardAction(action, confirmation = CONFIRMATION.quitGame) {
    this.#timeCounter.stop();
    this.#mineField.toggleMinefieldFreezer(true);
    if (this.game.isIdle) {
      action();
      return;
    }
    self.modal.displayConfirmation(confirmation, (confirmed) => {
      confirmed ? action() : this.continueGame();
    });
  }

  #onExit() {
    this.#excecuteBoardAction(this.actions.onExit.bind(this));
  }

  #onRestart() {
    this.#excecuteBoardAction(this.reStart.bind(this), CONFIRMATION.restartGame);
  }

  #onReset() {
    this.#excecuteBoardAction(this.actions.onReset.bind(this));
  }

}
