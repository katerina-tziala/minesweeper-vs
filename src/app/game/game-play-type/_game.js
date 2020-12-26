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
  #dashBoardActions = {};

  
  constructor(id, params) {
    super();
    this.update(params);
    this.id = id ? id : this.type;
    this.createdAt = nowTimestamp();
  }

  set dashBoardActions(actions) {
    this.#dashBoardActions = actions;
  }

  get dashBoardActions() {
    return this.#dashBoardActions;
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



}
