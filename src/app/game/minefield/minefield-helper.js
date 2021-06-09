'use strict';
import * as MinefieldUI from './minefield-ui';
import * as TileGenerator from './minefield-tile/tile-utils';
import * as TileChecker from './minefield-tile/tile-checker';

function generateRowTiles(ctx, row, gridSize, minesPositions) {
  const rowTiles = [];
  for (let column = 1; column <= gridSize.columns; column++) {
    const tile = TileGenerator.generateTile(row, column, gridSize, minesPositions);
    rowTiles.push(tile);
    MinefieldUI.drawTile(ctx, tile);
  }
  return rowTiles;
}

export function generateGridTiles(ctx, gridSize, minesPositions) {
  if (!ctx) {
    return [];
  }
  let tiles = [];
  for (let row = 1; row <= gridSize.rows; row++) {
    const rowTiles = generateRowTiles(ctx, row, gridSize, minesPositions);
    tiles = tiles.concat(rowTiles);
  }
  return tiles;
}

export function getPointedTile(pointerCoordinates, tiles) {
  const { x, y } = pointerCoordinates;
  return tiles.find(tile => TileChecker.pointerInTile(x, y, tile));
}

