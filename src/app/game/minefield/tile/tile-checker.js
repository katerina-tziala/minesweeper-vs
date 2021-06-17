'use strict';
import { NumberValidation } from 'UTILS';
import { TileState } from './tile-state.enum';
import { TileType } from './tile-type.enum';

export function pointerInTileArea(pointerX, pointerY, area) {
  const xPointerInArea = NumberValidation.valueInBoundaries(pointerX, area.xStart, area.xEnd);
  const yPointerInArea = NumberValidation.valueInBoundaries(pointerY, area.yStart, area.yEnd);
  return xPointerInArea && yPointerInArea;
}

export function getNumberOfMinesAround(neighbors, minesPositions) {
  const minesAround = neighbors.filter(neighbor => minesPositions.includes(neighbor));
  return minesAround.length;
}

export function containsMine(tile) {
  return tile.type === TileType.Mine;
}

export function revealed(tile) {
  return tile.state === TileState.Revealed;
}

export function untouched(tile) {
  return tile.state === TileState.Untouched;
}

export function flagged(tile) {
  return tile.state === TileState.Flagged;
}

export function marked(tile) {
  return tile.state === TileState.Marked;
}