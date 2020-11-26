"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";


import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./game-play.constants";

import { User } from "~/_models/user";


import { GameType } from "Game";

export class GamePlay {
  #_game;

  constructor(game) {
    this.game = game;
    // this.init();
  }

  set game(game) {
    this.#_game = game;
  }

  get game() {
    return this.#_game;
  }


  get board() {
    return ElementHandler.getByID(this.game.id);
  }


  generateGameBoard() {
    const board = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.board], this.game.id);
    Object.values(BOARD_SECTION).forEach(sectionName => {
      board.append(ElementGenerator.generateContainer([sectionName], sectionName));
    });
    return board;
  }


  startGame() {
    console.log("startGame");
    console.log(this.game);


  }










}
