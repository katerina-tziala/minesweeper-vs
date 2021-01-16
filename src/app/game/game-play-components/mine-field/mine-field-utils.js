"use strict";

export const tilesPositions = (tiles) => {
  return tiles.map((tile) => tile.position);
};

export const removeFromTiles = (tilesToFilter, tilesReference) => {
  const positionsToRemove = tilesPositions(tilesReference);
  return tilesToFilter.filter(tile => !positionsToRemove.includes(tile.position));
};

export const tilesByPositions = (tiles, positionsToKeep) => {
  return tiles.filter(tile => positionsToKeep.includes(tile.position));
};

export const nonMineTiles = (tiles) => {
  return tiles.filter((tile) => !tile.isMine);
};

export const mineTiles = (tiles) => {
  return tiles.filter((tile) => tile.isMine);
};

export const nonFlaggedTiles = (tiles) => {
  return tiles.filter((tile) => !tile.isFlagged);
};

export const blankTiles = (tiles) => {
  return tiles.filter((tile) => tile.isBlank);
};

export const nonBlankTiles = (tiles) => {
  return tiles.filter((tile) => !tile.isBlank);
};

export const unrevealedTiles = (tiles) => {
  return tiles.filter((tile) => !tile.isRevealed);
};

export const untouchedTiles = (tiles) => {
  return tiles.filter((tile) => tile.isUntouched);
};

export const flaggedTiles = (tiles) => {
  return tiles.filter((tile) => tile.isFlagged);
};

export const detectedTiles = (tiles) => {
  return tiles.filter((tile) => tile.isDetected);
};
