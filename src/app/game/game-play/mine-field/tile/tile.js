"use strict";
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
    this.id = params.id;
    this.neighbors = params.neighbors;
    this.content = params.content;
    this.initState();
    this.#viewController = new TileView(this.id);
  }

  set id(id) {
    return this.#_id = id;
  }

  get id() {
    return this.#_id;
  }

  set neighbors(neighbors) {
    return this.#_neighbors = neighbors;
  }

  get neighbors() {
    return this.#_neighbors;
  }

  set content(content) {
    return this.#_content = content;
  }

  get content() {
    return this.#_content;
  }

  set state(state) {
    return this.#_state = state;
  }

  get state() {
    return this.#_state;
  }

  set modifiedBy(modifiedBy) {
    return this.#_modifiedBy = modifiedBy;
  }

  get modifiedBy() {
    return this.#_modifiedBy;
  }

  generateView(onActivation, onAction) {
    return this.#viewController.generateView(
      this.content,
      onActivation,
      (action) => onAction(this, action)
    );
  }

  initState() {
    this.state = TileState.Untouched;
    this.modifiedBy = null;
  }

  /* TYPE CHECKERS */
  get isBlank() {
    return (this.content.length === 1) && (parseInt(this.content, 10) === 0) ? true : false;
  }

  get isMine() {
    return this.content.length > 1;
  }

  /* STATE CHECKERS */
  get isFlagged() {
    return this.state === TileState.Flagged;
  }

  get isRevealed() {
    return this.state === TileState.Revealed;
  }

  get isUntouched() {
    return this.state === TileState.Untouched;
  }

  get isMarked() {
    return this.state === TileState.Marked;
  }

  get isDetonatedMine() {
    return this.isMine && this.isRevealed;
  }

  get isWronglyFlagged() {
    return (!this.isMine && this.isFlagged);
  }

  get isDetected() {
    return (this.isMine && this.isFlagged);
  }

  isFlaggedBy(playerID) {
    return this.isFlagged && this.isModifiedBy === playerID;
  }

  isMarkedBy(playerID) {
    return this.isMarked && this.isModifiedBy === playerID;
  }

  /* ACTIONS */
  reveal(playerID, userAction = true) {
    this.state = TileState.Revealed;
    this.modifiedBy = playerID;
    this.#viewController.setRevealedView(this.isDetonatedMine, userAction);
  }

  setFlag(playerID, colorType, setWrongFlagHint = false) {
    this.state = TileState.Flagged;
    this.modifiedBy = playerID;
    const wrongFlagHint = this.isWronglyFlagged && setWrongFlagHint;
    this.#viewController.setFlag(colorType, wrongFlagHint);
  }

  resetState() {
    this.initState();
    this.#viewController.resetTileButtonStyling();
  }

  setMark(playerID, colorType) {
    this.state = TileState.Marked;
    this.modifiedBy = playerID;
    this.#viewController.setMark(colorType);
  }

  // disable() {
  //   this.#viewController.toggleButtonInteraction(true);
  // }

  // enable() {
  //   this.#viewController.toggleButtonInteraction(false);
  // }

}
