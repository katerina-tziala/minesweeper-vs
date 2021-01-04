"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { valueDefined } from "~/_utils/validator";

import { TileState } from "./tile-state.enum";
import { TileCell } from "./tile-cell/tile-cell";
import { TileButton } from "./tile-button/tile-button";

export class Tile {
  #_id;
  #_position;
  #_neighbors;
  #_content;
  #_state;
  #_modifiedBy;
  #cell;
  #button;

  constructor(gameId, params) {
    this.#_position = params.position;
    this.#_neighbors = params.neighbors;
    this.#_content = params.content;
    this.id = gameId;
    this.initState();
    this.#cell = new TileCell(this.id);
    this.#button = new TileButton(this.id);
  }

  get position() {
    return this.#_position;
  }

  get neighbors() {
    return this.#_neighbors;
  }

  get content() {
    return this.#_content;
  }

  set id(gameId) {
    this.#_id = this.position + TYPOGRAPHY.hyphen + gameId;
  }

  get id() {
    return this.#_id;
  }

  set state(state) {
    this.#_state = state;
  }

  get state() {
    return this.#_state;
  }

  set modifiedBy(playerId) {
    this.#_modifiedBy = playerId;
  }

  get modifiedBy() {
    return this.#_modifiedBy;
  }

  initState() {
    this.state = TileState.Untouched;
    this.modifiedBy = null;
  }

  /* TYPE CHECKERS */
  get isBlank() {
    return this.content.length === 1 && parseInt(this.content, 10) === 0
      ? true
      : false;
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
    return this.isMine && this.isRevealed && valueDefined(this.modifiedBy);
  }

  get isWronglyFlagged() {
    return !this.isMine && this.isFlagged;
  }

  get isDetected() {
    return this.isMine && this.isFlagged;
  }

  #isModifiedBy(playerId) {
    return this.modifiedBy === playerId;
  }

  isFlaggedBy(playerId) {
    return this.isFlagged && this.#isModifiedBy(playerId);
  }

  isMarkedBy(playerId) {
    return this.isMarked && this.#isModifiedBy(playerId);
  }

  generateView(onActivation, onAction) {
    const tile = this.#cell.generateView();

    this.#button.onActiveStateChange = onActivation;
  
    this.#button.onAction = (action) => {
      onAction(this, action);
    };

    tile.append(this.#button.generateView());
    return tile;
  }

  /* ACTIONS */
  reveal(playerID) {
    this.state = TileState.Revealed;
    this.modifiedBy = playerID;

    return this.#button.destroyButton().then(() => {
      this.#button = undefined;
      return this.#cell.revealCellContent(this.content, this.isDetonatedMine);
    });
  }

  setFlag(playerID, colorType, setWrongFlagHint = false) {
    this.state = TileState.Flagged;
    this.modifiedBy = playerID;
    const wrongFlagHint = this.isWronglyFlagged && setWrongFlagHint;
    return this.#button.setFlag(colorType, wrongFlagHint);
  }

  resetState() {
    this.initState();
    return this.#button.resetTileButtonStyling();
  }

  setMark(playerID, colorType) {
    this.state = TileState.Marked;
    this.modifiedBy = playerID;
    return this.#button.setMark(colorType);
  }

  expose() {
    this.state = TileState.Revealed;
    this.modifiedBy = null;
  
    return this.#button.revealButton().then(() => {
      this.#button = undefined;
      return this.#cell.revealCellContent(this.content, this.isDetonatedMine);
    });
  }

  additionalMark(colorType) {
    this.state = TileState.Revealed;
    this.modifiedBy = null;
    
    return this.#button.revealAdditionalMark(colorType).then(() => {
      return this.#cell.revealCellContent(this.content, this.isDetonatedMine);
    });
  }

  additionalFlag(colorType) {
    this.state = TileState.Revealed;
    this.modifiedBy = null;

    return this.#button.revealAdditionalFlag(colorType).then(() => {
      return this.#cell.revealCellContent(this.content, this.isDetonatedMine);
    });
  }

}
