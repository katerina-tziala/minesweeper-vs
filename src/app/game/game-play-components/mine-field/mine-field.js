"use strict";
import { MineFieldGenerator } from "./mine-field-generator";
import { MineFieldGridSearch } from "./mine-field-grid-search";
import * as FieldUtils from "./mine-field-utils";
export class MineField {
  #_levelSettings;
  #_gameId;
  #tiles = [];
  #onActiveTileChange;
  #onTileAction;

  constructor(gameId, levelSettings, onActiveTileChange, onTileAction) {
    this.#gameId = gameId;
    this.#levelSettings = levelSettings;
    this.#onActiveTileChange = onActiveTileChange;
    this.#onTileAction = onTileAction;
  }

  set #gameId(gameID) {
    this.#_gameId = gameID;
  }

  get #gameId() {
    return this.#_gameId;
  }

  set #levelSettings(game) {
    this.#_levelSettings = game;
  }

  get #levelSettings() {
    return this.#_levelSettings;
  }

  get isCleared() {
    return this.#tiles.every((tile) => tile.isMine);
  }

  get allMinesDetected() {
    const detectedTiles = FieldUtils.detectedTiles(this.#tiles);
    return detectedTiles.length === this.#levelSettings.numberOfMines;
  }

  get flaggedTilesOnField() {
    return FieldUtils.flaggedTiles(this.#tiles);
  }

  get numberOfFlags() {
    return this.flaggedTilesOnField.length;
  }

  get mineTilesOnField() {
    return this.#getTilesByPositions(this.#levelSettings.minesPositions);
  }

  get numberOfDetectedMines() {
    return FieldUtils.flaggedTiles(this.mineTilesOnField).length;
  }

  get unrevealedMines() {
    return FieldUtils.nonFlaggedTiles(this.mineTilesOnField).length;
  }

  get #unrevealedTilesOnBoard() {
    return FieldUtils.unrevealedTiles(this.#tiles);
  }

  #removeFromTiles(tilesToFilter, tilesReference) {
    return FieldUtils.removeFromTiles(tilesToFilter, tilesReference);
  }

  #getTilesByPositions(positionsToKeep) {
    return FieldUtils.tilesByPositions(this.#tiles, positionsToKeep);
  }

  generate() {
    const generator = new MineFieldGenerator(this.#gameId, this.#levelSettings, this.#onActiveTileChange, this.#onTileAction);
    const generatedField = generator.generate();
    this.#tiles = generatedField.tiles;
    return generatedField.table;
  }

  getRevealedTiles(clickedTile, playerId) {
    if (clickedTile.isBlank) {
      return this.#getRevealedArea(clickedTile, playerId);
    }

    return this.#revealTiles([clickedTile], playerId).then(revealedTiles => {
      return {
        tiles: revealedTiles,
        detonatedMine: this.#tileDetonated(revealedTiles)
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

  #getRevealedArea(clickedTile, playerId) {
    return this.#areaToReaveal(clickedTile).then((revealedTiles) => {
      return this.#revealTiles(revealedTiles, playerId);
    }).then(revealedTiles => {
      return {
        tiles: revealedTiles,
        detonatedMine: false
      }
    });
  }

  #areaToReaveal(clickedTile) {
    const gridSearch = new MineFieldGridSearch(this.#tiles);
    return gridSearch.getAreaToReveal([clickedTile]);
  }








  hideStrategy(player) {
    const tilesToReset = this.#getTilesByPositions(player.strategyPositions);
    const updates = tilesToReset.map(tile => tile.resetState());
    return Promise.all(updates);
  }

  showStrategy(player, wrongFlagHint) {
    const tilesToMark = this.#getTilesByPositions(player.marksPositions);
    const marksUpdates = tilesToMark.map(tile => tile.setMark(player.id, player.colorType));

    const tilesToFlag = this.#getTilesByPositions(player.flagsPositions);
    const flagsUpdates = tilesToFlag.map(tile => tile.setFlag(player.id, player.colorType, wrongFlagHint));
    return Promise.all([...marksUpdates, ...flagsUpdates]);
  }

  // REVEAL MINEFIELD
  revealField() {
    const updates = this.#unrevealedTilesOnBoard.map((tile) => tile.expose());
    return Promise.all(updates);
  }

  revealWithAdditionalStrategy(player, wrongFlagHint) {
    return this.#revealWithAdditionalMarks(player).then(() => {
      return this.#revealWithAdditionalFlags(player, wrongFlagHint);
    }).then(() => {
      return this.revealField();
    });
  }

  #revealWithAdditionalMarks(player) {
    const tilesForMarks = this.#getTilesByPositions(player.marksPositions);
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
    const tilesToFlag = this.#getTilesByPositions(player.flagsPositions);
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
