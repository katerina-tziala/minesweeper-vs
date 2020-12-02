"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { sortNumbersArrayAsc, uniqueArray, arrayDifference } from "~/_utils/utils";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./mine-field.constants";
import { TileGenerator } from "./tile-generator";
import { preventInteraction } from "~/_utils/utils";

export class MineField {
  #_levelSettings;
  #tiles = [];
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
    boardFreezer.addEventListener("click", (event) => { preventInteraction(event) });
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
      this.#tiles.push(tile);
      fragment.append(tile.generateView(this.#onActiveTileChange, this.#onTileAction.bind(this)));
    }
    return fragment;
  }

  get generateMinefield() {
    this.#tiles = [];
    console.log(this.#levelSettings.minesPositions);
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

  revealMinefieldTile(clickedTile, playerId) {
    return new Promise((resolve) => {
      if (clickedTile.isBlank) {
        this.getAreaToReveal([clickedTile]).then(revealedTiles => {
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
    revealedTiles.map(tile => tile.reveal(playerId));
    this.#tiles = this.removeFromTiles(this.#tiles, revealedTiles);
  }

  removeFromTiles(tilesToFilter, tilesReference) {
    const idsToRemove = this.getTilesIDs(tilesReference);
    return tilesToFilter.filter(tile => !idsToRemove.includes(tile.id));
  }

  getAreaToReveal(tilesToSearch, emptyArea = []) {
    let newSearch = [];
    tilesToSearch.forEach(tile => {
      emptyArea.push(tile);
      const neighborsSearch = this.getBlankAndEmptyNeighbors(tile, emptyArea);
      newSearch = newSearch.concat(neighborsSearch.blankTiles);
      emptyArea = emptyArea.concat(neighborsSearch.emptyTiles);
    });
    // clear arrays
    emptyArea = uniqueArray(emptyArea);
    newSearch = uniqueArray(newSearch);
    newSearch = this.removeFromTiles(newSearch, emptyArea);
    return Promise.resolve(newSearch.length ? this.getAreaToReveal(newSearch, emptyArea) : emptyArea);
  }

  getBlankAndEmptyNeighbors(referenceTile, currentEmptyTiles) {
    const blankTiles = [];
    const emptyTiles = [];
    const currentEmptyTilesIDs = this.getTilesIDs(currentEmptyTiles);
    const neighborsIDs = arrayDifference(referenceTile.neighbors, currentEmptyTilesIDs);
    let unrevealedNeighbors = this.getTilesByIDs(neighborsIDs);
    unrevealedNeighbors = this.getNonMineTiles(unrevealedNeighbors);
    unrevealedNeighbors = this.getNonFlaggedTiles(unrevealedNeighbors);
    unrevealedNeighbors.forEach(tile => {
      tile.isBlank ? blankTiles.push(tile) : emptyTiles.push(tile);
    });
    return { blankTiles, emptyTiles };
  }

  getBlankTiles(tiles = this.#tiles) {
    return tiles.filter(tile => tile.isBlank);
  }

  getTilesIDs(tiles) {
    return tiles.map(tile => tile.id);
  }

  getTilesByIDs(selectedIDs) {
    return this.#tiles.filter(tile => selectedIDs.includes(tile.id));
  }

  getNonMineTiles(tiles = this.#tiles) {
    return tiles.filter(tile => !tile.isMine);
  }

  getNonFlaggedTiles(tiles = this.#tiles) {
    return tiles.filter(tile => !tile.isFlagged);
  }

  // getUnrevealedTiles(tiles = this.getFieldTiles()) {
  //   return tiles.filter(tile => !tile.isRevealed());
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



  get isCleared() {
    return this.#tiles.every(tile => tile.isMine);
  }

  // get detectedMines() {
  //   return this.#tiles.filter(tile => tile.isDetected).length;
  // }






}
