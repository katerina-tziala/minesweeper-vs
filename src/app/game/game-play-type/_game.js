"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { clone } from "~/_utils/utils";

import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";

import {
  GameType,
  GameVSMode,
  GameAction,
  GameEndType,
  GameSubmission,
} from "GameEnums";
// import { GameViewHelper } from "./_game-view-helper";
// import {
//   ACTION_BUTTONS,
//   BOARD_SECTION,
//   DASHBOARD_SECTION,
// } from "./_game.constants";

import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
} from "GamePlayComponents";

import { GameTimer } from "GamePlayControllers";
import { CONFIRMATION } from "../../components/modal/modal.constants";
import { BoardActionsController } from "GamePlayControllers";

export class Game extends AppModel {
  #externalActions = {};

  //loader after game view ready
  constructor(id, params) {
    super();
    this.update(params);
    this.id = id ? id : this.type;
    this.createdAt = nowTimestamp();
    this.players = [];
    this.boardActionsController = new BoardActionsController(
      this.boardActionsAllowed,
      this.isOnline,
      this.#onBoardButtonAction.bind(this),
    );
  }

  set externalActions(actions) {
    this.#externalActions = actions;
  }

  get externalActions() {
    return this.#externalActions;
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

  get wrongFlagHint() {
    return this.optionsSettings ? this.optionsSettings.wrongFlagHint : false;
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

  get boardActionsAllowed() {
    return true;
  }

  get boardActions() {
    return this.boardActionsController.generateView();
  }

  initState() {
    this.gameOverType = null;
    this.completedAt = null;
    this.startedAt = null;
  }

  get gameState() {
    return {
      id: this.id,
      players: this.players,
      gameOverType: this.gameOverType,
      completedAt: this.completedAt,
      startedAt: this.startedAt,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
      roundTiles: this.roundTiles
    }
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

  #onBoardButtonAction(actionType) {
    this.pause();
    if (!this.isIdle) {
      self.modal.displayConfirmation(CONFIRMATION[actionType], (confirmed) => {
        confirmed ? this.#executeBoardAction(actionType) : this.continue();
      });
      return;
    }
    this.#executeBoardAction(actionType);
  }

  #executeBoardAction(actionType) {
    switch (actionType) {
      case GameAction.Restart:
        this.restart();
        break;
      default:
        this.externalActions[actionType]();
        break;
    }
  }

  generateView() {
    const fragment = document.createDocumentFragment();
    return fragment;
  }

  pause() {
    return;
  }

  restart() {
    return;
  }

  continue() {
    return;
  }


  setMinesPositions() {
     this.levelSettings.setMinesPositions();

    // this.levelSettings.minesPositions = [
    //   0,
    //   1,
    //   2,
    //   3,
    //   4,
    //   5,
    //   6,
    //   7,
    //   73,
    //   74,
    //   75,
    //   76,
    //   77,
    //   78,
    //   79,
    //   80,
    // ];
  }

  restart() {
    this.setMinesPositions();
  }

  ////////////////////////////////
  submitResult(type) {
    //TODO:
    console.log("--  submit game state -- ");
    console.log("----------------------------");
    console.log("update state: ", type);
    // console.log(this.externalActions);
    if (this.externalActions.onMoveSubmission) {
      console.log(clone(this));
    }
    //console.log(this);
  }


}
