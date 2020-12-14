"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { uniqueArray, arrayDifference } from "~/_utils/utils";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./mine-field.constants";
import { TileGenerator } from "./tile-generator";
import { preventInteraction } from "~/_utils/utils";

export class MineField {
  #_levelSettings;
  #_gameId;
  #tiles = [];
  #tilesGenerator;
  #onActiveTileChange;
  #submitTileAction;

  constructor(gameId, levelSettings, onActiveTileChange, onTileAction) {
    this.gameId = gameId;
    this.levelSettings = levelSettings;
    this.#onActiveTileChange = onActiveTileChange;
    this.#submitTileAction = onTileAction;
  }

  set gameId(gameID) {
    this.#_gameId = gameID;
  }

  get gameId() {
    return this.#_gameId;
  }

  set levelSettings(game) {
    this.#_levelSettings = game;
  }

  get isCleared() {
    return this.#tiles.every((tile) => tile.isMine);
  }

  get #levelSettings() {
    return this.#_levelSettings;
  }

  get #freezerId() {
    return DOM_ELEMENT_ID.freezer + TYPOGRAPHY.doubleHyphen + this.gameId;
  }

  get #freezer() {
    return ElementHandler.getByID(this.#freezerId);
  }

  #generateFieldFreezer() {
    const boardFreezer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.freezer],
      this.#freezerId,
    );
    boardFreezer.addEventListener("click", (event) => {
      preventInteraction(event);
    });
    return boardFreezer;
  }

  #onTileAction(tile, action) {
    if (action && tile) {
      this.#onActiveTileChange(false);
      this.freezerState = true;
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
      const tile = this.#tilesGenerator.generateTile(
        this.gameId,
        rowIndex,
        index,
      );
      this.#tiles.push(tile);
      fragment.append(
        tile.generateView(
          this.#onActiveTileChange,
          this.#onTileAction.bind(this),
        ),
      );
    }
    return fragment;
  }

  get generateMinefield() {
    this.#tiles = [];
    this.#tilesGenerator = new TileGenerator(this.#levelSettings);
    const fragment = document.createDocumentFragment();
    const mineFieldTable = ElementGenerator.generateTable();
    mineFieldTable.append(this.#generateMinefieldRows);
    fragment.append(mineFieldTable);
    fragment.append(this.#generateFieldFreezer());
    this.#tilesGenerator = undefined;
    return fragment;
  }

  set freezerState(display) {
    this.#freezer.then((freezer) => {
      display ? ElementHandler.display(freezer) : ElementHandler.hide(freezer);
    });
  }

  revealMinefieldTile(clickedTile, playerId) {
    return new Promise((resolve) => {
      if (clickedTile.isBlank) {
        this.getAreaToReveal([clickedTile]).then((revealedTiles) => {
          this.revealTiles(revealedTiles, playerId);
          resolve(revealedTiles);
        });
      } else {
        this.revealTiles([clickedTile], playerId);
        resolve([clickedTile]);
      }
    });
  }

  revealTiles(revealedTiles, playerId) {
    revealedTiles.map((tile) => tile.reveal(playerId));
    this.#tiles = this.removeFromTiles(this.#tiles, revealedTiles);
  }

  removeFromTiles(tilesToFilter, tilesReference) {
    const positionsToRemove = this.getTilesPositions(tilesReference);
    return tilesToFilter.filter(
      (tile) => !positionsToRemove.includes(tile.position),
    );
  }

  getAreaToReveal(tilesToSearch, emptyArea = []) {
    let newSearch = [];
    tilesToSearch.forEach((tile) => {
      emptyArea.push(tile);
      const neighborsSearch = this.getBlankAndEmptyNeighbors(tile, emptyArea);
      newSearch = newSearch.concat(neighborsSearch.blankTiles);
      emptyArea = emptyArea.concat(neighborsSearch.emptyTiles);
    });
    // clear arrays
    emptyArea = uniqueArray(emptyArea);
    newSearch = uniqueArray(newSearch);
    newSearch = this.removeFromTiles(newSearch, emptyArea);
    return Promise.resolve(
      newSearch.length ? this.getAreaToReveal(newSearch, emptyArea) : emptyArea,
    );
  }

  getBlankAndEmptyNeighbors(referenceTile, currentEmptyTiles) {
    const blankTiles = [];
    const emptyTiles = [];
    const currentEmptyTilesPositions = this.getTilesByPositions(
      currentEmptyTiles,
    );
    const neighborsPositions = arrayDifference(
      referenceTile.neighbors,
      currentEmptyTilesPositions,
    );
    let unrevealedNeighbors = this.getTilesByPositions(neighborsPositions);
    unrevealedNeighbors = this.getNonMineTiles(unrevealedNeighbors);
    unrevealedNeighbors = this.getNonFlaggedTiles(unrevealedNeighbors);
    unrevealedNeighbors.forEach((tile) => {
      tile.isBlank ? blankTiles.push(tile) : emptyTiles.push(tile);
    });
    return { blankTiles, emptyTiles };
  }

  getBlankTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => tile.isBlank);
  }

  getTilesPositions(tiles) {
    return tiles.map((tile) => tile.position);
  }

  getTilesByPositions(positionsToKeep) {
    return this.#tiles.filter((tile) =>
      positionsToKeep.includes(tile.position),
    );
  }

  getNonMineTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => !tile.isMine);
  }

  getNonFlaggedTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => !tile.isFlagged);
  }

  disable() {
    this.freezerState = true;
  }

  enable() {
    this.freezerState = false;
  }

  getUnrevealedTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => !tile.isRevealed);
  }

  // getUnrevealedMines() {
  //   return this.getTilesByPositions(this.#levelSettings.minesPositions).filter(tile => !tile.isRevealed);
  // }

  // getFlaggedTiles(tiles = this.getFieldTiles()) {
  //   return tiles.filter(tile => tile.isFlagged());
  // }

  // getUntouchedTiles(tiles = this.getFieldTiles()) {
  //   return tiles.filter(tile => tile.isUntouched());
  // }

  // getFlaggedTilesByPlayer(playerID, tiles = this.getFieldTiles()) {
  //   return tiles.filter(tile => tile.isFlaggedBy(playerID));
  // }

  // get detectedMines() {
  //   return this.#tiles.filter(tile => tile.isDetected).length;
  // }

  revealField() {
    this.getUnrevealedTiles().forEach((tile) => {
      tile.reveal(undefined, false);
    });
  }
}
