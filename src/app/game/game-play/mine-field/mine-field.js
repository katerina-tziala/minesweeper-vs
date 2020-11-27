"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./mine-field.constants";
import { MapController } from "../../../_utils/map-controller";
import { TileGenerator } from "./tile-generator";


export class MineField {
  #_levelSettings;
  #tiles = new Set();


  constructor(levelSettings) {
    this.levelSettings = levelSettings;
  }

  set levelSettings(game) {
    this.#_levelSettings = game;
  }

  get levelSettings() {
    return this.#_levelSettings;
  }

  get generateMinefield() {
    this.#tiles = new Set();
    this.tilesGenerator = new TileGenerator(this.levelSettings);
    const mineFieldTable = ElementGenerator.generateTable();
    mineFieldTable.append(this.generateMinefieldRows);
    return mineFieldTable;
  }

  get generateMinefieldRows() {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < this.levelSettings.rows; index++) {
      const row = ElementGenerator.generateTableRow();
      row.append(this.generateMinefieldColumns(index));
      fragment.append(row);
    }
    return fragment;
  }

  generateMinefieldColumns(rowIndex) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < this.levelSettings.columns; index++) {
      const tile = this.tilesGenerator.generateTile(rowIndex, index);
      this.#tiles.add(tile);
      fragment.append(tile.generateView());
    }
    return fragment;
  }








}
