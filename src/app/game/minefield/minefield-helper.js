'use strict';
import * as TileGenerator from './tile/tile-utils';
import * as TileChecker from './tile/tile-checker';
import { parseBoolean, arrayDifference } from 'UTILS';

import { TileState } from './tile/tile-state.enum';
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
  const mineTiles = tiles.filter(tile => minesPositions.includes(tile.position));
  return mineTiles.every(tile => TileChecker.flagged(tile));
}

export function getUntouchedAndMarkedTiles(tiles) {
  return tiles.filter(tile => TileChecker.untouched(tile) || TileChecker.untouched(tile));
}