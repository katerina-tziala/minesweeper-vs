"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";


import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, TILE_BTN } from "./tile.constants";
import { TileState } from "../../../_enums/tile-state.enum";
import { TileView } from "./tile.view";



export class Tile {
  #_id;
  #_neighbors;
  #_content;
  #_state;
  #_modifiedBy;
  #viewController;

  constructor(params) {
    this.#id = params.id;
    this.#neighbors = params.neighbors;
    this.#content = params.content;
    this.#state = TileState.Untouched;
    this.#modifiedBy = null;
    this.#viewController = new TileView(this.id);
  }

  set #id(id) {
    return this.#_id = id;
  }

  get id() {
    return this.#_id;
  }

  set #neighbors(neighbors) {
    return this.#_neighbors = neighbors;
  }

  get neighbors() {
    return this.#_neighbors;
  }

  set #content(content) {
    return this.#_content = content;
  }

  get #content() {
    return this.#_content;
  }

  set #state(state) {
    return this.#_state = state;
  }

  get state() {
    return this.#_state;
  }

  set #modifiedBy(modifiedBy) {
    return this.#_modifiedBy = modifiedBy;
  }

  get modifiedBy() {
    return this.#_modifiedBy;
  }

  generateView(onActivation, onAction) {
    return this.#viewController.generateView(
      this.#content,
      onActivation,
      (action) => onAction(this, action)
    );
  }




  // initState() {
  //   this.setState(TileStateEnum.Untouched);
  //   this.setModifiedBy(null);
  // }

  // setState(state) {
  //   return this.#state = state;
  // }


  // getReportData() {
  //   return {
  //     id: this.getID(),
  //     type: this.getType(),
  //     state: this.getState(),
  //     modifiedBy: this.getModifiedBy(),
  //   };
  // }









  // /* TYPE CHECKERS */
  get isBlank() {
    return (this.#content.length === 1) && (parseInt(this.#_content, 10) === 0) ? true : false;
  }

  get isMine() {
    return this.#content.length > 1;
  }

  /* STATE CHECKERS */
  get isFlagged() {
    return this.#state === TileState.Flagged;
  }

  get isRevealed() {
    return this.#state === TileState.Revealed;
  }

  get isUntouched() {
    return this.#state === TileState.Untouched;
  }

  get isMarked() {
    return this.#state === TileState.Marked;
  }

  // isFlaggedBy(playerID) {
  //   return this.isFlagged() && this.isModifiedBy(playerID);
  // }

  // isMarkedBy(playerID) {
  //   return this.isMarked() && this.isModifiedBy(playerID);
  // }

  get isMineRevealed() {
    return this.isMine && this.isRevealed;
  }

  // isWronglyFlagged() {
  //   return (!this.isMine() && this.isFlagged());
  // }

  /* ACTIONS */
  reveal(playerID, userAction = true) {
    this.#state = TileState.Revealed;
    this.#modifiedBy = playerID;
    this.#viewController.setRevealedView(this.isMineRevealed, userAction);
  }

  // setFlag(playerID, flagColor, setWrongFlagHint = false) {
  //   this.setState(TileStateEnum.Flagged);
  //   this.setModifiedBy(playerID);
  //   this.#viewController.setFlag(flagColor);
  //   if (this.isWronglyFlagged() && setWrongFlagHint) {
  //     this.#viewController.setWrongFlagHint();
  //   }
  // }

  // setMark(playerID, playerColor) {
  //   this.setState(TileStateEnum.Marked);
  //   this.setModifiedBy(playerID);
  //   this.#viewController.setMark(playerColor);
  // }

  // removeFlag() {
  //   this.resetStateAndStyle();
  // }

  // removeMark() {
  //   this.resetStateAndStyle();
  // }

  // resetStateAndStyle() {
  //   this.initState();
  //   this.#viewController.resetTileButtonStyling();
  // }

  // disable() {
  //   this.#viewController.toggleButtonInteraction(true);
  // }

  // enable() {
  //   this.#viewController.toggleButtonInteraction(false);
  // }

  // setWrongFlagHint() {
  //   this.#viewController.setWrongFlagHint(false);
  // }















}
