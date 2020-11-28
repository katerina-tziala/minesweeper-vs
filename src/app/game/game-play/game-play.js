"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";


import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./game-play.constants";

import { User } from "~/_models/user";


import { GameType, GameAction } from "Game";

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
    this.mineField.revealMinefieldTile(tile, playerOnTurn.id).then(boardTiles => {
      this.onPlayerMove(boardTiles);
    });
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
    this.game.startRound();
    this.mineField.toggleMinefieldFreezer(false);


  }




  startGame() {
    // console.log("startGame");
    // console.log(this.game);

    ElementHandler.getByID(this.getBoardSectionID(BOARD_SECTION.mineField))
      .then(mineFieldContainer => {
        ElementHandler.clearContent(mineFieldContainer);
        mineFieldContainer.append(this.mineField.generateMinefield);
        this.startGameRound();
      });

  }

  onGameEnd() {
    console.log("onGameEnd");
    console.log(this.game);

  }









}
