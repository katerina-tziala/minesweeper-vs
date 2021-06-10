'use strict';
import * as TileGenerator from './tile/tile-utils';
import * as TileChecker from './tile/tile-checker';

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

export function getPointedTile(pointerCoordinates, tiles) {
  const { x, y } = pointerCoordinates;
  return tiles.find(tile => TileChecker.pointerInTile(x, y, tile));
}

