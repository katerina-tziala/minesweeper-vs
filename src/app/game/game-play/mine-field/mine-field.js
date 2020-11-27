"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./mine-field.constants";
import { MapController } from "../../../_utils/map-controller";
import { TileGenerator } from "./tile-generator";
import { preventInteraction } from "~/_utils/utils";

export class MineField {
  #_levelSettings;
  #tiles = new Set();
  #tilesGenerator;
  #onActiveTileChange;
  #submitTileAction;

  constructor(levelSettings, onActiveTileChange, onTileAction) {
    this.levelSettings = levelSettings;
    this.#onActiveTileChange = onActiveTileChange;
    this.#submitTileAction = onTileAction;
  }

  set levelSettings(game) {
    this.#_levelSettings = game;
  }

  get #levelSettings() {
    return this.#_levelSettings;
  }

  get #freezer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.freezer);
  }

  #generateFieldFreezer() {
    const boardFreezer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.freezer], DOM_ELEMENT_ID.freezer);
    boardFreezer.addEventListener("click", (event) => { preventInteraction(event) }, false);
    return boardFreezer;
  }

  #onTileAction(tile, action) {
    if (action && tile) {
      this.#onActiveTileChange(false);
      this.toggleMinefieldFreezer(true);
      this.#submitTileAction(action, tile);
    }
  }

  get #generateMinefieldRows() {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < this.#levelSettings.rows; index++) {
      const row = ElementGenerator.generateTableRow();
      row.append(this.#generateMinefieldColumns(index));
      fragment.append(row);
    }
    return fragment;
  }

  #generateMinefieldColumns(rowIndex) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < this.#levelSettings.columns; index++) {
      const tile = this.#tilesGenerator.generateTile(rowIndex, index);
      this.#tiles.add(tile);
      fragment.append(tile.generateView(this.#onActiveTileChange, this.#onTileAction.bind(this)));
    }
    return fragment;
  }

  get generateMinefield() {
    this.#tiles = new Set();
    this.#tilesGenerator = new TileGenerator(this.#levelSettings);
    const fragment = document.createDocumentFragment();
    const mineFieldTable = ElementGenerator.generateTable();
    mineFieldTable.append(this.#generateMinefieldRows);
    fragment.append(mineFieldTable);
    fragment.append(this.#generateFieldFreezer());
    this.#tilesGenerator = undefined;
    return fragment;
  }

  toggleMinefieldFreezer(display) {
    this.#freezer.then(freezer => {
      display ? ElementHandler.display(freezer) : ElementHandler.hide(freezer);
    });
  }





}
