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

export function empty(tile) {
  return tile.type === TileType.Empty;
}

export function blank(tile) {
  return tile.type === TileType.Blank;
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

export function detectedMine(tile) {
  return flagged(tile) && containsMine(tile);
}

export function detonateddMine(tile) {
  return revealed(tile) && containsMine(tile);
}

export function allowedInArea(tile) {
  return !containsMine(tile) && !flagged(tile);
}

export function modifiedByPlayer(tile, playerId) {
  return tile.modifiedBy === playerId;
}