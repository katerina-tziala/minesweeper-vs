'use strict';
import { DATES } from 'UTILS';

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
import { generateTemplate } from './game-board-generator/game-board-generator';

export default class GameBoard extends HTMLElement {
  #level = {};
  #options = {};
  #gameStyles = {};

  Minefield;
  GameTimer;
  #FlagsCounter;
  #BoardFace;

  player = null;
  #boardFaceListener;
  #minefieldListeners;
  #startedAt = null;
  #endedAt = null;

  constructor() {
    super();
  }

  get #minesPositions() {
    return generateMinesPositions(this.#level.rows, this.#level.columns, this.numberOfMines);
  }

  get boardConfig() {
    const { rows, columns } = this.#level;
    const config = { ...this.#gameStyles, ...this.#options, rows, columns };
    config.disabled = true;
    return config;
  }

  get numberOfMines() {
    return this.#level ? this.#level.numberOfMines : 0;
  }

  get turnsTimer() {
    return !!this.#options.turnDuration;
  }

  connectedCallback() {
    this.#minefieldListeners = new Map();
    this.#minefieldListeners.set('onActiveTileChange', this.#onActiveTileChange.bind(this));
    this.#minefieldListeners.set('onRevealTile', this.onRevealTile.bind(this));
    this.#minefieldListeners.set('onTilesRevealed', this.onTilesRevealed.bind(this));
    this.#minefieldListeners.set('onChangeTileState', this.onChangeTileState.bind(this));
    this.#minefieldListeners.set('onDetonatedMine', this.onDetonatedMine.bind(this));
    this.#minefieldListeners.set('onMarkedTile', this.onMarkedTile.bind(this));
    this.#minefieldListeners.set('onFlaggedTile', this.onFlaggedTile.bind(this));
    this.#minefieldListeners.set('onResetedTile', this.onResetedTile.bind(this));
  }

  disconnectedCallback() {
    this.#removeFaceListener();
    this.#removeMinefieldListeners();
  }

  init(config) {
    const { level, options, gameStyles } = config;
    this.#level = level;
    this.#options = options;
    this.#gameStyles = gameStyles;
    this.#render();
    this.#setMinefieldListeners();
    this.#setFaceListener();
    this.#initBoard();
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
    this.setBoardDisabledState(true);
  }

  start(player, minesPositions = []) {
    this.setPlayer(player);
    this.#startedAt = null;
    this.#endedAt = null;
    minesPositions = minesPositions.length ? minesPositions : this.#minesPositions;
    this.#initBoard(minesPositions);
    this.setBoardDisabledState(!this.player);
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
      console.log('onRevealTile');
      console.log('checkStart');

      //this.#checkStart();
      this.Minefield.revealTile(tile, id);
    }
  }

  onTilesRevealed(event) {
    const { detail: { revealedTiles, minefieldCleared } } = event;
    if (minefieldCleared) {
      this.onGameEnd(GameEndType.FieldCleared, revealedTiles);
    }
  }

  onChangeTileState(event) {
    if (!this.player) return;
    const { detail: { tile } } = event;
    const untouchedTile = TileChecker.untouched(tile);
    untouchedTile ? this.flagTile(tile) : this.#changeFlaggedTileState(tile);
  }

  flagTile(tile) {
    //   this.#checkStart();
    const { id, styles } = this.player;
    this.Minefield.flagTile(tile, id, styles);
  }

  #changeFlaggedTileState(tile) {
    //   this.#checkStart();
    const markTile = TileChecker.flagged(tile) && this.#options.marks;
    const { id, styles } = this.player;
    markTile ? this.Minefield.markTile(tile, id, styles) : this.Minefield.resetTile(tile);
  }

  onDetonatedMine(event) {
    console.log('onDetonatedMine');
    // this.#onGameEnd(GameEndType.DetonatedMine);
  }

  onMarkedTile(event) {
    this.checkFlaggedTiles();
    console.log('onMarkedTile')
  }

  onFlaggedTile(event) {
    this.checkFlaggedTiles();
    console.log('onFlaggedTile')
  }

  onResetedTile(event) {
    this.checkFlaggedTiles();
    console.log('onResetedTile')
  }

  onRestart() {
    console.log('onRestart');
    // if (this.#startedAt) {
    //   this.start();
    // }
  }

  // #checkStart() {
  //   if (!this.#startedAt && !this.#endedAt) {
  //     this.#startedAt = DATES.nowTimestamp();
  //     this.GameTimer.start(1);
  //   }
  // }

  checkFlaggedTiles() {
    const { misplacedFlagHint } = this.#options;
    let flagsCounterValue = this.numberOfMines;
    flagsCounterValue -= misplacedFlagHint ? this.Minefield.detectedMines.length : this.Minefield.flaggedTiles.length;
    this.#setFlagsCounter(flagsCounterValue);
  }

  onGameEnd(gameEndType, tiles = []) {
    this.#endedAt = DATES.nowTimestamp();
    this.stopTimer();
    const data = {
      startedAt: this.#startedAt,
      endedAt: this.#endedAt,
      gameEndType,
      tiles
    };
    console.log('onGameEnd');
    console.log(data);
  }

  stopTimer() {
    if (this.GameTimer) {
      this.GameTimer.stop();
    }
  }

  setFaceColor() {
    if (this.player) {
      const color = this.player.styles.colorType;
      ElementHandler.setElementAttributes(this.#BoardFace, { color });
    }
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

  initTurnTimer() {
    if (this.turnsTimer) {
      this.resetTimer();
      this.#setTimerColor();
    }
  }

  #setTimerColor() {
    const color_type = this.player ? this.player.styles.colorType : '';
    ElementHandler.setElementAttributes(this.GameTimer, { color_type });
  }

  #render() {
    const template = generateTemplate(this.boardConfig);
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
}

customElements.define('app-game-board', GameBoard);