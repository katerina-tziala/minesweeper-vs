"use strict";

import { uniqueArray, arrayDifference } from "~/_utils/utils";
import * as FieldUtils from "./mine-field-utils";

export class MineFieldGridSearch {
  #tiles = [];
 
  constructor(tiles) {
    this.#tiles = tiles;
  }
  
  getAreaToReveal(tilesToSearch, emptyArea = []) {
    let newSearch = [];

    tilesToSearch.forEach((tile) => {
      emptyArea.push(tile);
      const neighborsSearch = this.getBlankAndEmptyNeighbors(tile, emptyArea);
      newSearch = newSearch.concat(neighborsSearch.blankTiles);
      emptyArea = emptyArea.concat(neighborsSearch.emptyTiles);
    });

    emptyArea = uniqueArray(emptyArea);
    newSearch = uniqueArray(newSearch);
    newSearch = FieldUtils.removeFromTiles(newSearch, emptyArea);


    return Promise.resolve(
      newSearch.length ? this.getAreaToReveal(newSearch, emptyArea) : emptyArea,
    );
    
  }

  getBlankAndEmptyNeighbors(referenceTile, currentEmptyTiles) {
    const blankTiles = [];
    const emptyTiles = [];

    const currentEmptyTilesPositions = FieldUtils.tilesPositions(currentEmptyTiles);

    const neighborsPositions = arrayDifference(
      referenceTile.neighbors,
      currentEmptyTilesPositions,
    );

    let unrevealedNeighbors = this.getTilesByPositions(neighborsPositions);
    unrevealedNeighbors = FieldUtils.nonMineTiles(unrevealedNeighbors);
    unrevealedNeighbors = FieldUtils.nonFlaggedTiles(unrevealedNeighbors);

    unrevealedNeighbors.forEach((tile) => {
      tile.isBlank ? blankTiles.push(tile) : emptyTiles.push(tile);
    });
  
    return { blankTiles, emptyTiles };
  }

  getTilesByPositions(positionsToKeep) {
    return FieldUtils.tilesByPositions(this.#tiles, positionsToKeep);
  }

}
