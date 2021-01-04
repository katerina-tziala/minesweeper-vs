"use strict";

import { uniqueArray, arrayDifference } from "~/_utils/utils";
import { MineFieldGenerator } from "./mine-field-generator";
import * as FieldUtils from "./mine-field-utils";

export class MineField {
  #_levelSettings;
  #_gameId;
  #tiles = [];
  #onActiveTileChange;
  #onTileAction;

  constructor(gameId, levelSettings, onActiveTileChange, onTileAction) {
    this.gameId = gameId;
    this.levelSettings = levelSettings;
    this.#onActiveTileChange = onActiveTileChange;
    this.#onTileAction = onTileAction;
  }

  set gameId(gameID) {
    this.#_gameId = gameID;
  }

  get gameId() {
    return this.#_gameId;
  }

  set levelSettings(game) {
    this.#_levelSettings = game;
  }

  get isCleared() {
    return this.#tiles.every((tile) => tile.isMine);
  }

  get allMinesDetected() {
    const detectedTiles = this.#tiles.filter((tile) => tile.isDetected);
    return detectedTiles.length === this.#levelSettings.numberOfMines;
  }

  get #levelSettings() {
    return this.#_levelSettings;
  }


  generate() {
    const generator = new MineFieldGenerator(this.gameId, this.#levelSettings, this.#onActiveTileChange, this.#onTileAction);
    const generatedField = generator.generate();
    this.#tiles = generatedField.tiles;
    return generatedField.table;
  }

  getRevealedTilesResult(clickedTile, playerId) {
    if (clickedTile.isBlank) {
      return this.#getAreaToReveal([clickedTile]).then((revealedTiles) => {
        return this.#revealTiles(revealedTiles, playerId);
      }).then(revealedTiles => {
        return {
          tiles: revealedTiles,
          detonatedMine: false
        }
      });
    }

    return this.#revealTiles([clickedTile], playerId).then(revealedTiles => {
      return {
        tiles: revealedTiles,
        detonatedMine: this.#tileDetonated([clickedTile])
      }
    });
  }

  #tileDetonated(boardTiles) {
    return boardTiles.length === 1 && boardTiles[0].isDetonatedMine;
  }

  #revealTiles(revealedTiles, playerId) {
    const updates = revealedTiles.map(tile => tile.reveal(playerId));
    return Promise.all(updates).then(() => {
      this.#tiles = this.#removeFromTiles(this.#tiles, revealedTiles);
      return revealedTiles;
    });
  }

  #removeFromTiles(tilesToFilter, tilesReference) {
    const positionsToRemove = this.getTilesPositions(tilesReference);
    return tilesToFilter.filter(
      (tile) => !positionsToRemove.includes(tile.position),
    );
  }

  #getAreaToReveal(tilesToSearch, emptyArea = []) {
    let newSearch = [];
    tilesToSearch.forEach((tile) => {
      emptyArea.push(tile);
      const neighborsSearch = this.#getBlankAndEmptyNeighbors(tile, emptyArea);
      newSearch = newSearch.concat(neighborsSearch.blankTiles);
      emptyArea = emptyArea.concat(neighborsSearch.emptyTiles);
    });
    // clear arrays
    emptyArea = uniqueArray(emptyArea);
    newSearch = uniqueArray(newSearch);
    newSearch = this.#removeFromTiles(newSearch, emptyArea);
    return Promise.resolve(
      newSearch.length ? this.#getAreaToReveal(newSearch, emptyArea) : emptyArea,
    );
  }

  #getBlankAndEmptyNeighbors(referenceTile, currentEmptyTiles) {
    const blankTiles = [];
    const emptyTiles = [];

    const currentEmptyTilesPositions = this.getTilesByPositions(
      currentEmptyTiles,
    );

    const neighborsPositions = arrayDifference(
      referenceTile.neighbors,
      currentEmptyTilesPositions,
    );

    let unrevealedNeighbors = this.getTilesByPositions(neighborsPositions);
    unrevealedNeighbors = this.getNonMineTiles(unrevealedNeighbors);
    unrevealedNeighbors = this.getNonFlaggedTiles(unrevealedNeighbors);
    unrevealedNeighbors.forEach((tile) => {
      tile.isBlank ? blankTiles.push(tile) : emptyTiles.push(tile);
    });
    return { blankTiles, emptyTiles };
  }

  getBlankTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => tile.isBlank);
  }

  getTilesPositions(tiles) {
    return FieldUtils.tilesPositions(tiles);
  }

  getTilesByPositions(positionsToKeep) {
    return this.#tiles.filter((tile) =>
      positionsToKeep.includes(tile.position),
    );
  }

  getNonMineTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => !tile.isMine);
  }

  getNonFlaggedTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => !tile.isFlagged);
  }


  getUnrevealedTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => !tile.isRevealed);
  }

  getUntouchedTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => tile.isUntouched);
  }

  getFlaggedTiles(tiles = this.#tiles) {
    return tiles.filter((tile) => tile.isFlagged);
  }

  get numberOfDetectedMines() {
    return this.getTilesByPositions(this.#levelSettings.minesPositions).filter(
      (tile) => tile.isFlagged,
    ).length;
  }

  get numberOfFlags() {
    return this.getFlaggedTiles().length;
  }

  get unrevealedMines() {
    return this.getTilesByPositions(this.#levelSettings.minesPositions).filter(
      (tile) => !tile.isFlagged,
    );
  }

  revealField() {
    const updates = this.getUnrevealedTiles().map((tile) => tile.expose());
    return Promise.all(updates);
  }

  hideStrategy(player) {
    const tilesToReset = this.getTilesByPositions(player.strategyPositions);
    const updates = tilesToReset.map(tile => tile.resetState());
    return Promise.all(updates);
  }

  showStrategy(player, wrongFlagHint) {
    const tilesToMark = this.getTilesByPositions(player.marksPositions);
    const marksUpdates = tilesToMark.map(tile => tile.setMark(player.id, player.colorType));

    const tilesToFlag = this.getTilesByPositions(player.flagsPositions);
    const flagsUpdates = tilesToFlag.map(tile => tile.setFlag(player.id, player.colorType, wrongFlagHint));
    return Promise.all([...marksUpdates, ...flagsUpdates]);
  }


  revealWithAdditionalStrategy(player, wrongFlagHint) {
    return this.#revealWithAdditionalMarks(player).then(() => {
      return this.#revealWithAdditionalFlags(player, wrongFlagHint);
    }).then(() => {
      return this.revealField();
    });
  }

  #revealWithAdditionalMarks(player) {
    const tilesForMarks = this.getTilesByPositions(player.marksPositions);
    const updates = [];
    tilesForMarks.forEach(tile => {
      if (tile.isUntouched) {
        updates.push(tile.setMark(player.id, player.colorType));
      } else {
        updates.push(tile.additionalMark(player.colorType));
      }
    });
    return Promise.all(updates);
  }

  #revealWithAdditionalFlags(player, wrongFlagHint) {
    const updates = [];
    const tilesToFlag = this.getTilesByPositions(player.flagsPositions);
    tilesToFlag.forEach(tile => {
      if (tile.isUntouched) {
        updates.push(tile.setFlag(player.id, player.colorType, wrongFlagHint));
      } else {
        updates.push(tile.additionalFlag(player.colorType));
      }
    });
    return Promise.all(updates);
  }




}
