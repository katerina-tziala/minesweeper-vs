"use strict";
import { valueDefined } from "~/_utils/validator";
import { MineFieldGenerator } from "./mine-field-generator";
import { MineFieldGridSearch } from "./mine-field-grid-search";
import * as FieldUtils from "./mine-field-utils";
export class MineField {
  #_levelSettings;
  #_optionsSettings;
  #_gameId;
  #tiles = [];
  #onActiveTileChange;
  #onTileAction;

  constructor(gameId, levelSettings, optionsSettings, onActiveTileChange, onTileAction) {
    this.#gameId = gameId;
    this.#levelSettings = levelSettings;
    this.#optionsSettings = optionsSettings;
    this.#onActiveTileChange = onActiveTileChange;
    this.#onTileAction = onTileAction;
  }

  set #gameId(gameID) {
    this.#_gameId = gameID;
  }

  get #gameId() {
    return this.#_gameId;
  }

  get tiles() {
    return this.#tiles;
  }

  set #levelSettings(settings) {
    this.#_levelSettings = settings;
  }

  get #levelSettings() {
    return this.#_levelSettings;
  }

  set #optionsSettings(settings) {
    this.#_optionsSettings = settings;
  }

  get #optionsSettings() {
    return this.#_optionsSettings;
  }

  get #wrongFlagHint() {
    return this.#optionsSettings ? this.#optionsSettings.wrongFlagHint : false;
  }

  get #allowMarks() {
    return this.#optionsSettings ? this.#optionsSettings.marks : false;
  }

  get #reveallingAllowed() {
    return this.#optionsSettings && valueDefined(this.#optionsSettings.tileRevealing) ? this.#optionsSettings.tileRevealing : true;
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
    return FieldUtils.nonFlaggedTiles(this.mineTilesOnField);
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
      };
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
      };
    });
  }

  #areaToReaveal(clickedTile) {
    const gridSearch = new MineFieldGridSearch(this.#tiles);
    return gridSearch.getAreaToReveal([clickedTile]);
  }

  markingAllowed(tile, player) {
    return tile.isFlaggedBy(player.id) && this.#allowMarks;
  }

  resetingAllowed(tile, player) {
    if (tile.isMarkedBy(player.id)) {
      return true;
    }
    if (tile.isFlaggedBy(player.id) && !this.#allowMarks) {
      return true;
    }

    return false;
  }

  flaggingAllowed(tile, player) {
    if (!tile.isFlagged && !tile.isMarkedBy(player.id) && player.hasFlags) {
      return true;
    }
    return false;
  }

  revealingAllowed(tile) {
    const tileRevealingAllowed = tile.isUntouched || tile.isMarked;
    return this.#reveallingAllowed && tileRevealingAllowed;
  }

  tileFlaggedByOpponent(tile, player) {
    return tile.isFlagged && !tile.isFlaggedBy(player.id);
  }

  setFlagOnMinefield(tile, player) {
    return tile.setFlag(player.id, player.colorType, this.#wrongFlagHint).then(() => {
      player.flaggedTile(tile.position, tile.isWronglyFlagged);
      return;
    });
  }

  setMarkOnMinefield(tile, player) {
    return tile.setMark(player.id, player.colorType).then(() => {
      player.markedTile = tile.position;
      return;
    });
  }

  resetTile(tile, player) {
    return tile.resetState().then(() => {
      player.resetedTile = tile.position;
      return;
    });
  }

  flagUnrevealedMines(player) {
    const unflaggedTiles = this.unrevealedMines;
    const updates = unflaggedTiles.map((tile) => this.setFlagOnMinefield(tile, player));
    return Promise.all(updates).then(() => {
      return unflaggedTiles;
    });
  }

  // STRATEGY
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
