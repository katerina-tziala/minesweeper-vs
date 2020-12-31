"use strict";
import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";
import { valueDefined } from "~/_utils/validator";

import {
  GameType,
  GameVSMode,
  GameAction,
  GameOverType,
  GameSubmission,
} from "GameEnums";

import { CONFIRMATION } from "../../components/modal/modal.constants";
import { BoardActionsController } from "GamePlayControllers";

export class Game extends AppModel {
  #externalActions = {};
  #BoardActionsController;
  //check errors after view updates
  constructor(id, params) {
    super();
    this.update(params);
    this.id = id ? id : this.type;
    this.createdAt = nowTimestamp();
    this.players = [];
    this.setBoardActionsController();
  }

  setBoardActionsController() {
    this.#BoardActionsController = new BoardActionsController(
      this.boardActionsAllowed,
      this.isOnline,
      this.#onBoardButtonAction.bind(this),
    );
  }

  get boardActionsController() {
    return this.#BoardActionsController;
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

  get looser() {
    return this.players.find(player => player.lostGame);
  }

  get looserOnVsMode() {
    return this.players.reduce((playerA, playerB) => {
      if (playerA.revealedTiles === playerB.revealedTiles) {
        return undefined;
      }
      return playerA.revealedTiles < playerB.revealedTiles ? playerA : playerB;
    });
  }

  get isDraw() {
    return this.players.every(player => player.lostGame) || this.players.every(player => !player.lostGame);
  }

  get bothPlayersEntered() {
    return this.players.every(player => player.entered);
  }

  get wrongFlagHint() {
    return this.optionsSettings ? this.optionsSettings.wrongFlagHint : false;
  }

  get isOver() {
    return this.gameOverType ? true : false;
  }

  get started() {
    return valueDefined(this.startedAt);
  }

  get isIdle() {
    if (this.isOver) {
      return true;
    }

    if (!this.started) {
      return true;
    }

    if (this.players.every((player) => !player.moves)) {
      return true;
    }

    return false;
  }

  get boardActionsAllowed() {
    return true;
  }

  set externalActions(actions) {
    this.#externalActions = actions;
  }

  get externalActions() {
    return this.#externalActions;
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

  get gameOverClearedMinefield() {
    return this.gameOverType === GameOverType.Cleared;
  }

  get winner() {
    return this.players.find(player => !player.lostGame);
  }

  get boardActions() {
    return this.boardActionsController.generateView();
  }

  initState() {
    this.gameOverType = null;
    this.completedAt = null;
    this.startedAt = null;
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

  start() {
    return;
  }

  restart() {
    return;
  }

  pause() {
    return;
  }

  continue() {
    return;
  }

  ////////////////////////////////
  setMinesPositions() {
    this.levelSettings.setMinesPositions();

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

  ////////////////////////////////
  submitResult(type) {
    //TODO:
    console.log("--  submit game state -- ");
    console.log("----------------------------");
    console.log("update state: ", type);
    // console.log(this.externalActions);
    if (this.externalActions.onMoveSubmission) {
      console.log(this.gameState);
    }
    //console.log(this);
  }


}
