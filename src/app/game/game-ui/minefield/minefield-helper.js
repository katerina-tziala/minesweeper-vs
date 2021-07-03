'use strict';
import * as TileGenerator from './tile/tile-utils';
import * as TileChecker from './tile/tile-checker';
import { arrayDifference } from 'UTILS';
import { TileState } from './tile/tile-state.enum';
import { TileType } from './tile/tile-type.enum';

function generateRowTiles(row, gridSize, minesPositions) {
  const rowTiles = [];
  for (let column = 1; column <= gridSize.columns; column++) {
    const tile = TileGenerator.generateTile(row, column, gridSize, minesPositions);
    rowTiles.push(tile);
  }
  return rowTiles;
}

export function generateGridTiles(gridSize, minesPositions) {
  let tiles = [];
  for (let row = 1; row <= gridSize.rows; row++) {
    const rowTiles = generateRowTiles(row, gridSize, minesPositions);
    tiles = tiles.concat(rowTiles);
  }
  return tiles;
}

export function getGridArea(targettedTile, fieldTiles = [], disabledPositions = []) {
  let tiles = [];
  if (targettedTile) {
    const neighborsPositions = arrayDifference(targettedTile.neighbors, disabledPositions);
    const neighbors = fieldTiles.filter(tile => neighborsPositions.includes(tile.position));
    tiles = [...neighbors, { ...targettedTile }];
  }
  return tiles;
}

export function getUpdatedTile(tile, modifiedBy = null, state = TileState.Untouched) {
  const updatedTile = { ...tile };
  updatedTile.modifiedBy = modifiedBy;
  updatedTile.state = !!updatedTile.modifiedBy ? state : TileState.Untouched;
  return updatedTile;
}

export function getTilesPositions(tiles) {
  return tiles.map(tile => tile.position);
}

export function allMinesFlagged(tiles, minesPositions = []) {
  const mineTiles = getTilesByPositions(tiles, minesPositions);
  return mineTiles.every(tile => TileChecker.flagged(tile));
}

export function getUntouchedAndMarkedTiles(tiles) {
  return tiles.filter(tile => TileChecker.untouched(tile) || TileChecker.untouched(tile));
}


export function getTilesByPositions(tiles, positions = []) {
  return tiles.filter(tile => positions.includes(tile.position));
}

export function getNonMineTiles(tiles) {
  return tiles.filter(tile => !TileChecker.containsMine(tile));
}

export function getAreaToReveal(blankTiles, tilesToSearch = [], emptyArea = []) {
  let newSearch = [];

  for (let index = 0; index < blankTiles.length; index++) {
    const tileReference = blankTiles[index];
    emptyArea.push(tileReference);
    const positionsToExclude = getTilesPositions(emptyArea);
    const neighborsSearch = getBlankAndEmptyNeighbors(tileReference, tilesToSearch, positionsToExclude);
    newSearch = newSearch.concat(neighborsSearch[TileType.Blank]);
    emptyArea = emptyArea.concat(neighborsSearch[TileType.Empty]);
  }
  newSearch = Array.from(new Set(newSearch));

  return newSearch.length ? getAreaToReveal(newSearch, tilesToSearch, emptyArea) : Array.from(new Set(emptyArea));
}

function getNeighborsToSearch(referenceTile, tilesToSearch, positionsToExclude = []) {
  const neighborsPositions = arrayDifference(referenceTile.neighbors, positionsToExclude);
  return getTilesByPositions(tilesToSearch, neighborsPositions);
}

function getBlankAndEmptyNeighbors(referenceTile, tilesToSearch, positionsToExclude = []) {
  const neighbors = getNeighborsToSearch(referenceTile, tilesToSearch, positionsToExclude);
  const tilesPerType = { b: [], e: [] };

  for (let index = 0; index < neighbors.length; index++) {
    const tile = neighbors[index];
    if (TileChecker.allowedInArea(tile)) {
      tilesPerType[tile.type].push(tile);
    }
  }

  return tilesPerType;
}