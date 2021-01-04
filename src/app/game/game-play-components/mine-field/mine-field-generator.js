"use strict";
import { ElementGenerator } from "HTML_DOM_Manager";
import { TileGenerator } from "./tile/tile-generator";

export class MineFieldGenerator {
  #gameId;
  #levelSettings;
  #tiles = [];
  #tilesGenerator;
  #onActiveTileChange;
  #onTileAction;

  constructor(gameId, levelSettings, onActiveTileChange, onTileAction) {
    this.#gameId = gameId;
    this.#levelSettings = levelSettings;
    this.#onActiveTileChange = onActiveTileChange;
    this.#onTileAction = onTileAction;
    this.#tiles = [];
    this.#tilesGenerator = new TileGenerator(this.#levelSettings);
  }

  generate() {
    const table = this.#generatedView;
    const tiles = this.#tiles;
    return { table, tiles };
  }

  get #generatedView() {
    const fragment = document.createDocumentFragment();
    const mineFieldTable = ElementGenerator.generateTable();
    mineFieldTable.append(this.#generatedMinefieldRows);
    fragment.append(mineFieldTable);
    this.#tilesGenerator = undefined;
    return fragment;
  }

  get #generatedMinefieldRows() {
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
      const tile = this.#tilesGenerator.generateTile(this.#gameId, rowIndex, index);
      this.#tiles.push(tile);
      const tileView = tile.generateView(this.#onActiveTileChange, this.#onTileAction);
      fragment.append(tileView);
    }
    return fragment;
  }

}
