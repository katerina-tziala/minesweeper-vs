"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";


import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./game-play.constants";

import { User } from "~/_models/user";


import { GameType } from "Game";

import { MineField } from "../game-play/mine-field/mine-field";





export class GamePlay {
  #_game;

  constructor(game) {
    this.game = game;
    this.init();
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

  getBoardSectionID(sectionName) {
    return sectionName + TYPOGRAPHY.doubleHyphen + this.game.id;
  }

  get boardMineTypeStyleClass() {
    return DOM_ELEMENT_CLASS.board + TYPOGRAPHY.doubleHyphen + LocalStorageHelper.retrieve("settings").mineType;
  }

  generateGameBoard() {
    const board = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.board, this.boardMineTypeStyleClass], this.game.id);
    Object.values(BOARD_SECTION).forEach(sectionName => {
      board.append(ElementGenerator.generateContainer([sectionName], this.getBoardSectionID(sectionName)));
    });
    return board;
  }


  init() {
    // console.log("init");
    // console.log(this.game);


    this.mineField = new MineField(this.game.levelSettings, this.onActiveTileChange.bind(this), this.onTileAction.bind(this));

  }

  onActiveTileChange(activeTile) {
    // console.log("onActiveTileChange");
    // console.log(activeTile);


  }

  onTileAction(action, tile) {
    const playerOnTurn = this.game.playerOnTurn;


    this.mineField.revealMinefieldTile(tile, playerOnTurn.id).then(boardTiles => {

      console.log(boardTiles);


      this.mineField.toggleMinefieldFreezer(false);
    });
    // console.log(action, tile);
    // console.log();
    // console.log("onActiveTileChange");
    // console.log(activeTile);


  }







  startGame() {
    console.log("startGame");
    // console.log(this.game);

    ElementHandler.getByID(this.getBoardSectionID(BOARD_SECTION.mineField))
      .then(mineFieldContainer => {
        ElementHandler.clearContent(mineFieldContainer);
        mineFieldContainer.append(this.mineField.generateMinefield);
        this.mineField.toggleMinefieldFreezer();
      });

  }










}
