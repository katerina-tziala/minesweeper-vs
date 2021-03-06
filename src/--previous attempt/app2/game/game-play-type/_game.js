"use strict";
import { AppModel } from "~/_models/app-model";
import { nowTimestamp, dateDifferenceInHoursMinutesSeconds } from "~/_utils/dates";
import { valueDefined } from "~/_utils/validator";

import {
  GameVSMode,
  GameAction,
  GameType,
  GameOverType,
  GameSubmission
} from "GameEnums";

import { RoundStatistics } from "GameModels";

import { CONFIRMATION } from "../../components/modal/modal.constants";
import { BoardActionsController } from "GamePlayControllers";


import { REPORT_KEYS } from "./_game.constants";

export class Game extends AppModel {
  #externalActions = {};
  #BoardActionsController;
  #roundStatistics;
  //check errors after view updates
  constructor(id, params) {
    super();
    this.update(params);
    this.id = id ? id : this.type;
    this.createdAt = nowTimestamp();
    this.players = [];
    this.setBoardActionsController();
    this.#roundStatistics = new RoundStatistics();
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
    return this.type === GameType.Online;
  }

  get gameOverClearedMinefield() {
    return this.gameOverType === GameOverType.Cleared;
  }

  get winner() {
    return this.players.find(player => !player.lostGame);
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
    if (this.players.length === 2) {
      return this.players.every(player => player.lostGame) || this.players.every(player => !player.lostGame);
    }
    return false;
  }

  get bothPlayersEntered() {
    return this.players.every(player => player.entered);
  }

  get wrongFlagHint() {
    return this.optionsSettings ? this.optionsSettings.wrongFlagHint : false;
  }

  get isOver() {
    return this.gameOverType || this.completedAt ? true : false;
  }

  get started() {
    return valueDefined(this.startedAt);
  }

  get isIdle() {
    if (this.isOver) {
      return true;
    }

    if (!this.startedAt) {
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

  get roundTiles() {
    return this.#roundStatistics.roundTiles;
  }

  get rounds() {
    return this.#roundStatistics.rounds;
  }

  get numberOfRounds() {
    return this.#roundStatistics.rounds.length;
  }

  get gameState() {
    return {
      id: this.id,
      players: this.players,
      gameOverType: this.gameOverType,
      startedAt: this.startedAt,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
      roundTiles: this.roundTiles,
      rounds: this.rounds
    };
  }

  get boardActions() {
    return this.boardActionsController.generateView();
  }

  get duration() {
    return dateDifferenceInHoursMinutesSeconds(this.completedAt, this.startedAt);
  }

  get gameInfoResults() {
    return {
      duration: this.duration,
      draw: this.isDraw,
      gameOverType: this.gameOverType
    };
  }

  get gameReportKeys() {
    return REPORT_KEYS.default;
  }

  get gamePlayersResults() {
    return this.players.map(player => player.reportData);
  }

  get gameResults() {
    return {
      gameInfo: this.gameInfoResults,
      playersResults: this.gamePlayersResults,
      reportResults: this.gameReportKeys
    };
  }

  initState() {
    this.gameOverType = null;
    this.completedAt = null;
    this.startedAt = null;
    this.initRoundStatistics();
  }

  initRoundStatistics() {
    this.#roundStatistics.initRoundStatistics();
  }

  setStatisticsOnRoundEnd(boardTiles) {
    this.#roundStatistics.onRoundEnd(boardTiles);
  }

  setGameStart() {
    this.startedAt = nowTimestamp();
  }

  setCompleted() {
    this.completedAt = nowTimestamp();
  }

  setGameEnd(type) {
    if (type && type.length) {
      this.gameOverType = type;
      this.setCompleted();
    }
  }

  #onBoardButtonAction(actionType) {
    this.pause();
    if (this.externalActions && this.externalActions.onBoardMenuAction) {
      this.externalActions.onBoardMenuAction(actionType)
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
    console.log("--  submit game state -- ");
    console.log("----------------------------");

    if (self.onlineConnection) {

      if (type === GameSubmission.GameOver) {
        self.onlineConnection.sendData(type, this.gameState);
      } else {
        const data = {
          updateType: type,
          gameUpdate: this.gameState
        };
        console.log(data);
        self.onlineConnection.sendData("game-update", data);
      }
    }
  }


}
