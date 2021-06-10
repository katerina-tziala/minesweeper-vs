'use strict';
import { NumberValidation } from 'UTILS';
import { TileState } from './tile-state.enum';
import { TileType } from './tile-type.enum';

export function pointerInTile(pointerX, pointerY, tile) {
  const { area } = tile;
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
