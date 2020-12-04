"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";

import { GameType, GameVSMode } from "GameEnums";
import { GameViewHelper } from "./game-view-helper";
import { DOM_ELEMENT_CLASS } from "./game.constants";




export class Game extends AppModel {

  constructor(id, params, player) {
    super();
    this.update(params);
    this.id = id ? id : this.type;
    this.player = player;
    this.createdAt = nowTimestamp();
  }

  init() {
    this.roundTiles = [];
    this.gameOverType = null;
    this.completedAt = null;
    this.startedAt = null;
  }

  get #gameContainerID() {
    return DOM_ELEMENT_CLASS.container + TYPOGRAPHY.doubleHyphen + this.id;
  }

  generateView() {
    const gameContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], this.#gameContainerID);
    gameContainer.append(GameViewHelper.generateBoard(this.id));
    return gameContainer;
  }


  start() {


    console.log("re staaart");
  }



}
