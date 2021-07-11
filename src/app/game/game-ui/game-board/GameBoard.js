'use strict';
import { DATES, arrayDifference } from 'UTILS';

import { TileChecker } from '../minefield/tile/@tile.module';
import '../minefield/Minefield';
import '../game-timer/GameTimer';
import '../flags-counter/FlagsCounter';
import '../board-face/BoardFace';

import { BoardFaceType } from '../board-face/board-face-type.enum';
import { generateMinesPositions } from '../../game-utils/game-utils';
import { ElementHandler } from 'UI_ELEMENTS';
import './game-board.scss';

import { GameEndType } from './game-end-type.enum';
import { PlayerGameStatus } from './player-game-status';
import { generateTemplate } from './game-board-generator/game-board-generator';

export default class GameBoard extends HTMLElement {
  #config = {};
  Minefield;
  GameTimer;
  #FlagsCounter;
  #BoardFace;
  player = null;
  #boardFaceListener;
  #minefieldListeners;
  #tileUpdateHandler;
  #startedAt = null;
  #endedAt = null;

  constructor() {
    super();
  }

  get defaultConfig() {
    return {};
  }

  set config(config = {}) {
    this.#config = Object.assign(config, this.defaultConfig);
  }

  get config() {
    return this.#config;
  }

  get #minesPositions() {
    const { rows, columns, numberOfMines } = this.config;
    return generateMinesPositions(rows, columns, numberOfMines);
  }

  get numberOfMines() {
    return this.config ? this.config.numberOfMines : 0;
  }

  get unlimitedFlags() {
    return !!this.config.unlimitedFlags;
  }

  get gameDuration() {
    return {
      startedAt: this.#startedAt,
      endedAt: this.#endedAt,
    };
  }

  get idle() {
    return (!this.#startedAt && !this.#endedAt) ? true : false;
  }

  connectedCallback() {
    this.#minefieldListeners = new Map();
    this.#minefieldListeners.set('onActiveTileChange', this.#onActiveTileChange.bind(this));
    this.#minefieldListeners.set('onRevealTile', this.onRevealTile.bind(this));
    this.#minefieldListeners.set('onChangeTileState', this.onChangeTileState.bind(this));
    this.#minefieldListeners.set('onUpdatedTiles', this.#onUpdatedTiles.bind(this));
    this.#setTileUpdateHandler();
  }

  disconnectedCallback() {
    this.#removeFaceListener();
    this.#removeMinefieldListeners();
  }

  init(params = {}) {
    this.config = params;
    this.#render();
    this.#setMinefieldListeners();
    this.#setFaceListener();
    this.#initBoard();
  }

  start(player, minesPositions = []) {
    this.#startedAt = this.config.gameTimer ? null : DATES.nowTimestamp();
    this.#endedAt = null;
    minesPositions = minesPositions.length ? minesPositions : this.#minesPositions;
    this.#initBoard(minesPositions);
    this.setPlayer(player);
  }

  onTilesRevealed(params) {
    const { minefieldCleared, tilesPositions } = params;
    if (minefieldCleared) {
      this.onGameEnd(GameEndType.FieldCleared, { revealedTiles: tilesPositions });
    }
  }

  onFlaggedTile(params) {
    const { tilesPositions } = params;
    this.addToPlayerFlags(tilesPositions);
    this.checkFlaggedTiles();
  }

  onRestoredTile(params) {
    const { tilesPositions } = params;
    this.removeFromPlayerFlags(tilesPositions);
    this.checkFlaggedTiles();
  }

  #initBoard(minesPositions = []) {
    this.Minefield.init(minesPositions);
    this.#setFlagsCounter(this.numberOfMines);
    this.setFaceState(BoardFaceType.Smile);
    this.resetTimer();
  }

  setPlayer(player = null) {
    this.player = player;
    this.#setPlayerFlagIcon();
    this.setBoardDisabledState(!this.player);
    if (!this.player) {
      this.stopTimer();
    }
  }

  resetTimer() {
    if (this.GameTimer) {
      this.GameTimer.reset();
    }
  }

  onRevealTile(event) {
    if (!this.player) return;
    const { detail: { tile } } = event;
    const { id } = this.player;
    if (!TileChecker.flagged(tile)) {
      this.checkTimerStart();
      this.Minefield.revealTile(tile, id);
    }
  }

  onChangeTileState(event) {
    if (!this.player) return;
    const { detail: { tile } } = event;
    const untouchedTile = TileChecker.untouched(tile);
    untouchedTile ? this.flagTile(tile) : this.#changeFlaggedTileState(tile);
  }

  flagTile(tile) {
    this.checkTimerStart();
    const { id, styles } = this.player;
    this.Minefield.flagTile(tile, id, styles);
  }

  #changeFlaggedTileState(tile) {
    const markTile = TileChecker.flagged(tile) && this.config.marks;
    const { id, styles } = this.player;
    markTile ? this.Minefield.markTile(tile, id, styles) : this.Minefield.resetTile(tile);
  }

  onRestart() {
    console.log('onRestart');
    // if (this.#startedAt) {
    //   this.start();
    // }
  }

  checkTimerStart() {
    if (this.idle) {
      this.#startedAt = DATES.nowTimestamp();
      this.GameTimer.start(1);
    }
  }

  removeFromPlayerFlags(tilesPositions) {
    const { flagsPositions } = this.player;
    this.player.flagsPositions = arrayDifference(flagsPositions, tilesPositions);
  }

  addToPlayerFlags(flaggedPositions) {
    const { flagsPositions } = this.player;
    this.player.flagsPositions = flagsPositions.concat(flaggedPositions);
  }

  checkFlaggedTiles() {
    const flagsCounterValue = this.numberOfMines - this.Minefield.flagsCount;
    this.#setFlagsCounter(flagsCounterValue);
  }

  endGame() {
    this.#endedAt = DATES.nowTimestamp();
    this.stopTimer();
    this.setBoardDisabledState(true);
  }

  onGameEnd(gameEndType, params) {
    this.setBoardFaceOnGameEnd();

    // todo
    console.log('onGameEnd');
    console.log(gameEndType);
    console.log(params);
    console.log(this.player);
    console.log(this.gameDuration);
  }

  setBoardFaceOnGameEnd() {
    const { gameStatus } = this.player;
    this.setFaceState(BoardFaceType[gameStatus]);
  }

  stopTimer() {
    if (this.GameTimer) {
      this.GameTimer.stop();
    }
  }

  setFaceColor(color = '') {
    ElementHandler.setElementAttributes(this.#BoardFace, { color });
  }

  setFaceState(state) {
    ElementHandler.setElementAttributes(this.#BoardFace, { state });
  }

  setFlagsCounterIcon(flags, colorTypes) {
    ElementHandler.setElementAttributes(this.#FlagsCounter, { flags, colorTypes });
  }

  setBoardDisabledState(disabled) {
    ElementHandler.setElementAttributes(this.Minefield, { disabled });
  }

  #render() {
    const template = generateTemplate(this.config);
    this.append(template);
    this.Minefield = this.#getBoardElement('app-minefield');
    this.GameTimer = this.#getBoardElement('app-game-timer');
    this.#FlagsCounter = this.#getBoardElement('app-flags-counter');
    this.#BoardFace = this.#getBoardElement('app-board-face');
  }

  #getBoardElement(elementTag) {
    return this.getElementsByTagName(elementTag)[0];
  }

  #setMinefieldListeners() {
    if (this.Minefield) {
      for (const [listenerName, listenerHandler] of this.#minefieldListeners) {
        this.Minefield.addEventListener(listenerName, listenerHandler);
      }
    }
  }

  #removeMinefieldListeners() {
    if (this.Minefield) {
      for (const [listenerName, listenerHandler] of this.#minefieldListeners) {
        this.Minefield.removeEventListener(listenerName, listenerHandler);
      }
    }
  }

  #setFaceListener() {
    if (this.#BoardFace) {
      this.#boardFaceListener = this.onRestart.bind(this);
      this.#BoardFace.addEventListener('onBoardFaceClick', this.#boardFaceListener);
    }
  }

  #removeFaceListener() {
    if (this.#BoardFace) {
      this.#BoardFace.removeEventListener('onBoardFaceClick', this.#boardFaceListener);
    }
    this.#boardFaceListener = undefined;
  }

  #setFlagsCounter(value) {
    ElementHandler.setElementAttributes(this.#FlagsCounter, { value });
  }

  #onActiveTileChange(event) {
    const { detail: { activeTile } } = event;
    const faceType = activeTile ? BoardFaceType.Surprise : BoardFaceType.Smile;
    this.setFaceState(faceType);
  }

  #setPlayerFlagIcon() {
    if (this.player) {
      const { styles: { flagType, colorType } } = this.player;
      this.setFlagsCounterIcon(flagType, colorType);
    }
  }

  #setTileUpdateHandler() {
    this.#tileUpdateHandler = new Map();
    this.#tileUpdateHandler.set('flagged', this.onFlaggedTile.bind(this));
    this.#tileUpdateHandler.set('revealed', this.onTilesRevealed.bind(this));
    this.#tileUpdateHandler.set('detonatedMine', this.#onDetonatedMine.bind(this));
  }

  #onUpdatedTiles({ detail }) {
    const { type } = detail;
    if (this.#tileUpdateHandler.has(type)) {
      this.#tileUpdateHandler.get(type)(detail);
    } else {
      this.onRestoredTile(detail);
    }
  }

  #onDetonatedMine(params) {
    const { tilesPositions } = params;
    this.player.gameStatus = PlayerGameStatus.Looser;
    this.onGameEnd(GameEndType.DetonatedMine, { revealed: tilesPositions });
  }
}

customElements.define('app-game-board', GameBoard);