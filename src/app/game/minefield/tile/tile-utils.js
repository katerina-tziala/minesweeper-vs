'use strict';
import { STYLES_CONFIG } from '../minefield-ui/minefield-ui.constants';
import { NumberValidation } from 'UTILS';
import { TileState } from './tile-state.enum';
import { TileType } from './tile-type.enum';
import * as TileChecker from './tile-checker';

function getLinearCoordinates(coordinateReference, maxCoordinate) {
  const coordinates = [coordinateReference - 1, coordinateReference, coordinateReference + 1];
  return coordinates.filter(coordinate => NumberValidation.valueInBoundaries(coordinate, 1, maxCoordinate));
}

function getGridPositions(rowsIndexes, columnsPositions, gridColumns) {
  let positions = [];

  rowsIndexes.forEach(row => {
    const startIndex = getRowIndex(row, gridColumns);
    const positionsInrow = columnsPositions.map(column => startIndex + column);
    positions = positions.concat(positionsInrow);
  });

  return positions;
}

function getRowIndex(rowPosition, gridColumns) {
  return (rowPosition - 1) * gridColumns;
}

function getPositionAndNeighbors(row, column, gridSize) {
  const rowIndex = getRowIndex(row, gridSize.columns);
  const position = rowIndex + column;

  const rowsIndexes = getLinearCoordinates(row, gridSize.rows);
  const columnsPositions = getLinearCoordinates(column, gridSize.columns);
  const gridPositions = getGridPositions(rowsIndexes, columnsPositions, gridSize.columns);
  const neighbors = gridPositions.filter(gridPosition => gridPosition !== position);

  return { position, neighbors };
}

function getTileArea(row, column) {
  const size = STYLES_CONFIG.tileSize;

  const xStart = ((column - 1) * size) + column;
  const xEnd = xStart + size;
  const yStart = ((row - 1) * size) + row;
  const yEnd = yStart + size;

  return { xStart, xEnd, yStart, yEnd };
}

function getTileType(position, neighbors, minesPositions) {
  if (minesPositions.includes(position)) {
    return TileType.Mine;
  }

  const minesAround = TileChecker.getNumberOfMinesAround(neighbors, minesPositions);
  return minesAround ? TileType.Empty : TileType.Blank;
}

export function generateTile(row, column, gridSize, minesPositions) {
  const area = getTileArea(row, column);
  const modifiedBy = null;
  const { position, neighbors } = getPositionAndNeighbors(row, column, gridSize);
  const type = getTileType(position, neighbors, minesPositions);
  const state = TileState.Untouched;

  return { position, area, neighbors, modifiedBy, type, state };
}

