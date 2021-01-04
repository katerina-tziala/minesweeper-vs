"use strict";
import { ElementGenerator } from "HTML_DOM_Manager";
import { uniqueArray, arrayDifference } from "~/_utils/utils";
import { TileGenerator } from "./tile/tile-generator";

export class MineField {
  #_levelSettings;
  #_gameId;
  #tiles = [];
  #tilesGenerator;
  #onActiveTileChange;
  #submitTileAction;

  constructor(gameId, levelSettings, onActiveTileChange, onTileAction) {
    this.gameId = gameId;
    this.levelSettings = levelSettings;
    this.#onActiveTileChange = onActiveTileChange;
    this.#submitTileAction = onTileAction;
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

  #onTileAction(tile, action) {
    if (action && tile) {
      this.#onActiveTileChange(false);
      this.#submitTileAction(action, tile);
    }
  }

  get #generateMinefieldRows() {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < this.#levelSettings.rows; index++) {
      const row = ElementGenerator.generateTableRow();
      row.append(this.#generateMinefieldColumns(index));
      fragment.append(row);
    }
    return fragment;
  }

  #generateMinefieldColumns(rowIndex) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < this.#levelSettings.columns; index++) {
      const tile = this.#tilesGenerator.generateTile(
        this.gameId,
        rowIndex,
        index,
      );
      this.#tiles.push(tile);
      
      fragment.append(
        tile.generateView(
          this.#onActiveTileChange,
          this.#onTileAction.bind(this),
        ),
      );
    }
    return fragment;
  }

  generate() {
    this.#tiles = [];
    this.#tilesGenerator = new TileGenerator(this.#levelSettings);
    const fragment = document.createDocumentFragment();
    const mineFieldTable = ElementGenerator.generateTable();
    mineFieldTable.append(this.#generateMinefieldRows);
    fragment.append(mineFieldTable);
    this.#tilesGenerator = undefined;
    return fragment;
  }



  getRevealedTilesResult(clickedTile, playerId) {
    return new Promise((resolve) => {
      if (clickedTile.isBlank) {
        this.#getAreaToReveal([clickedTile]).then((revealedTiles) => {
          this.#revealTiles(revealedTiles, playerId);
          resolve({
            tiles: revealedTiles,
            detonatedMine: false
          });
        });
      } else {
        this.#revealTiles([clickedTile], playerId);
        resolve({
          tiles: [clickedTile],
          detonatedMine: this.#tileDetonated([clickedTile])
        });
      }
    });
  }

  #tileDetonated(boardTiles) {
    return boardTiles.length === 1 && boardTiles[0].isDetonatedMine;
  }

  #revealTiles(revealedTiles, playerId) {
    const updates = revealedTiles.map((tile) => tile.reveal(playerId));
    this.#tiles = this.#removeFromTiles(this.#tiles, revealedTiles);
    return Promise.all(updates);
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
    return tiles.map((tile) => tile.position);
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
