"use strict";
import {
  randomValueFromArray,
  keysFromMapByValue,
  isOdd,
  timeoutPromise
} from "~/_utils/utils";

import {
  valueInRange
} from "~/_utils/validator";
import { Player } from "../player";
import { BotMode, GameVSMode, GameAction } from "GameEnums";
import { MineFieldUtils, MineFieldGridSearch } from "GamePlayComponents";
import { LEVEL_ACTIONS, MISS_TURNS, MOVE_DURATIONS } from "./bot-player.constants";

export class BotPlayer extends Player {

  constructor() {
    super("minesweeperBot", "Minesweeper-Bot");
    this.mode = BotMode.Easy;
    this.isBot = true;
  }

  get #isEvil() {
    return this.mode === BotMode.Evil;
  }

  get #isHard() {
    return this.mode === BotMode.Hard;
  }

  get #levelActions() {
    return LEVEL_ACTIONS[this.mode];
  }

  get #actionType() {
    const allowedActions = this.#levelActions;
    const selectionValue = Math.random();
    const selectedAction = allowedActions.find(allowedAction => valueInRange(selectionValue, allowedAction.selectionRange));
    return selectedAction.action;
  }

  get #currentMoveEven() {
    const currentMove = this.moves + 1;
    return !isOdd(currentMove);
  }

  get #missTurn() {
    if (this.unlimitedTurns || !this.#currentMoveEven) {
      return false;
    }
    const selectionValue = Math.random();
    const missTurnRange = MISS_TURNS[this.mode];
    return valueInRange(selectionValue, missTurnRange);
  }

  get #moveDuration() {
    const range = MOVE_DURATIONS[this.mode];
    const selectionValue = Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
    return selectionValue;
  }

  getMove(mineFieldTiles) {
    if (this.#missTurn) {
      return Promise.resolve();
    }

    const actionType = this.#actionType;
    const moveDuration = this.#moveDuration;

    if (actionType === GameAction.Target) {
      return this.#getTargetMove(mineFieldTiles).then(result => {
        return timeoutPromise(moveDuration, result);
      });
    }
    const action = actionType;
    const tile = this.#selectedRandomTile(mineFieldTiles);
    return timeoutPromise(moveDuration, { action, tile });
  }

  #getTargetMove(mineFieldTiles) {
    if (this.goal === GameVSMode.Detect) {
      return this.#getTargetMoveForDetect(mineFieldTiles);
    }
    return this.#getTargetMoveForClear(mineFieldTiles);
  }

  #getTargetMoveForDetect(mineFieldTiles) {
    mineFieldTiles = MineFieldUtils.mineTiles(mineFieldTiles);
    mineFieldTiles = MineFieldUtils.nonFlaggedTiles(mineFieldTiles);
    const action = GameAction.Mark;
    const tile = this.#selectedRandomTile(mineFieldTiles);
    return Promise.resolve({ action, tile });
  }

  #getTargetMoveForClear(mineFieldTiles) {
    mineFieldTiles = MineFieldUtils.nonMineTiles(mineFieldTiles);

    if (this.#isEvil) {
      return this.#getBiggestAreaMove(mineFieldTiles);
    }

    const action = GameAction.Reveal;

    if (this.#isHard && this.#currentMoveEven) {
      return this.#getBiggestAreaMove(mineFieldTiles);
    }

    const tile = this.#selectedRandomTile(mineFieldTiles);
    return Promise.resolve({ action, tile });
  }

  #getBiggestAreaMove(mineFieldTiles) {
    const action = GameAction.Reveal;
    let moveMap = this.#getEmptyTilesMap(mineFieldTiles);

    return this.#getBlankTilesMap(mineFieldTiles).then(blankTilesMap => {
      moveMap = new Map([...moveMap, ...blankTilesMap]);
      const maxRevealedAreaLength = Math.max(...moveMap.values());

      const tilesPositions = keysFromMapByValue(moveMap, maxRevealedAreaLength);
      const selectedTilePosition = randomValueFromArray(tilesPositions);
      const tile = MineFieldUtils.tilesByPositions(mineFieldTiles, [selectedTilePosition])[0];
      return Promise.resolve({ action, tile });
    });
  }

  #getBlankTilesMap(mineFieldTiles) {
    let moveMap = new Map();
    const blankTiles = MineFieldUtils.blankTiles(mineFieldTiles);

    const searchResults = [];
    blankTiles.forEach(tile => searchResults.push(this.#getRevealedAreaSize(tile, mineFieldTiles)));

    return Promise.all(searchResults).then(results => {
      results.map(searchResult => moveMap = new Map([...moveMap, ...searchResult]));
      return moveMap;
    });
  }

  #getEmptyTilesMap(mineFieldTiles) {
    const moveMap = new Map();
    const nonBlankTiles = MineFieldUtils.nonBlankTiles(mineFieldTiles);
    nonBlankTiles.forEach(tile => moveMap.set(tile.position, 1));
    return moveMap;
  }

  #getRevealedAreaSize(tileReference, tiles) {
    const gridSearch = new MineFieldGridSearch(tiles);
    const sizeMap = new Map();

    return gridSearch.getAreaToReveal([tileReference]).then(areaTiles => {
      return sizeMap.set(tileReference.position, areaTiles.length);
    });
  }

  #selectedRandomTile(mineFieldTiles) {
    const tilesPositions = MineFieldUtils.tilesPositions(mineFieldTiles);
    const selectedTilePosition = randomValueFromArray(tilesPositions);
    return MineFieldUtils.tilesByPositions(mineFieldTiles, [selectedTilePosition])[0];
  }

}
