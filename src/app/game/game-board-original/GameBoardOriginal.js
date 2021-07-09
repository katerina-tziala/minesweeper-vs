'use strict';
import { DATES } from 'UTILS';
import { TemplateGenerator } from 'UI_ELEMENTS';
import { TileChecker } from '../game-ui/minefield/@minefield.module';
import '../game-ui/game-timer/GameTimer';
import '../game-ui/flags-counter/FlagsCounter';
import { BoardFaceType } from '../game-ui/board-face/@board-face.module';
import { generateMinesPositions } from '../game-utils/game-utils';

import './game-board-original.scss';
import { TEMPLATE } from './game-board-original.constants';
import { GameEndType } from './game-end-type.enum';

export default class GameBoardOriginal extends HTMLElement {
  #level = {};
  #options = {};
  #gameStyles = {};

  #Minefield;
  #GameTimer;
  #FlagsCounter;
  #BoardFace;

  #player;
  #boardFaceListener;
  #minefieldListeners;
  #startedAt = null;
  #endedAt = null;

  constructor() {
    super();
  }

  get boardConfig() {
    const { rows, columns } = this.#level;
    const config = { ...this.#gameStyles, ...this.#options, rows, columns };
    config.revealing = true;
    config.flagging = true;
    config.disabled = false;
    config.turnDuration = 0;
    return config;
  }

  connectedCallback() {
    this.#minefieldListeners = new Map();
    this.#minefieldListeners.set('onActiveTileChange', this.#onActiveTileChange.bind(this));
    this.#minefieldListeners.set('onRevealTile', this.#onRevealTile.bind(this));
    this.#minefieldListeners.set('onTilesRevealed', this.#onTilesRevealed.bind(this));
    this.#minefieldListeners.set('onChangeTileState', this.#onChangeTileState.bind(this));
    this.#minefieldListeners.set('onDetonatedMine', this.#onDetonatedMine.bind(this));
    this.#minefieldListeners.set('onMarkedTile', this.#checkFlaggedTiles.bind(this));
    this.#minefieldListeners.set('onFlaggedTile', this.#checkFlaggedTiles.bind(this));
    this.#minefieldListeners.set('onResetedTile', this.#checkFlaggedTiles.bind(this));
  }

  disconnectedCallback() {
    this.#removeFaceListener();
    this.#removeMinefieldListeners();
  }

  init(config, player) {
    const { level, options, gameStyles } = config;
    this.#level = level;
    this.#options = options;
    this.#gameStyles = gameStyles;
    this.#player = player;
    this.#render();
    this.#setFaceListener();
    this.#setMinefieldListeners();
  }

  start() {
    this.#GameTimer.reset();
    this.#startedAt = null;
    this.#endedAt = null;
    this.#setFaceState(BoardFaceType.Smile);
    const minesPositions = generateMinesPositions(this.#level.rows, this.#level.columns, this.#level.numberOfMines);
    this.#setFlagsCounter(this.#level.numberOfMines);
    this.#Minefield.init(minesPositions);
  }

  #checkStart() {
    if (!this.#startedAt && !this.#endedAt) {
      this.#startedAt = DATES.nowTimestamp();
      this.#GameTimer.start(1);
    }
  }

  #onActiveTileChange(event) {
    const { detail: { activeTile } } = event;
    const faceType = activeTile ? BoardFaceType.Surprise : BoardFaceType.Smile;
    this.#setFaceState(faceType);
  }

  #onRevealTile(event) {
    const { detail: { tile } } = event;
    const { id } = this.#player;
    if (!TileChecker.flagged(tile)) {
      this.#checkStart();
      this.#Minefield.revealTile(tile, id);
    }
  }

  #onTilesRevealed(event) {
    const { detail: { revealedTiles, minefieldCleared } } = event;
    if (minefieldCleared) {
      this.#onGameEnd(GameEndType.FieldCleared);
    }
  }

  #checkFlaggedTiles() {
    const { misplacedFlagHint } = this.#options;
    let flagsCounterValue = this.#level.numberOfMines;
    flagsCounterValue -= misplacedFlagHint ? this.#Minefield.detectedMines.length : this.#Minefield.flaggedTiles.length;
    this.#setFlagsCounter(flagsCounterValue);
  }

  #onGameEnd(gameEndType) {
    this.#endedAt = DATES.nowTimestamp();
    this.#GameTimer.stop();
    this.#Minefield.revealMines();
    const faceType = gameEndType === GameEndType.DetonatedMine ? BoardFaceType.Looser : BoardFaceType.Winner;
    this.#setFaceState(faceType);
    const data = {
      startedAt: this.#startedAt,
      endedAt: this.#endedAt,
      gameEndType
    };
    console.log(data);
  }

  #onDetonatedMine() {
    this.#onGameEnd(GameEndType.DetonatedMine);
  }

  #onChangeTileState(event) {
    this.#checkStart();
    const { detail: { tile } } = event;
    const { id, styles } = this.#player;
    if (TileChecker.untouched(tile)) {
      this.#Minefield.flagTile(tile, id, styles);
    } else {
      this.#changeTouchedTileState(tile);
    }
  }

  #changeTouchedTileState(tile) {
    const markTile = TileChecker.flagged(tile) && this.#options.marks;
    const { id, styles } = this.#player;
    markTile ? this.#Minefield.markTile(tile, id, styles) : this.#Minefield.resetTile(tile);
  }

  #setMinefieldListeners() {
    if (!this.#Minefield) {
      return;
    }
    for (const [listenerName, listenerHandler] of this.#minefieldListeners) {
      this.#Minefield.addEventListener(listenerName, listenerHandler);
    }
  }

  #removeMinefieldListeners() {
    if (!this.#Minefield) {
      return;
    }
    for (const [listenerName, listenerHandler] of this.#minefieldListeners) {
      this.#Minefield.removeEventListener(listenerName, listenerHandler);
    }
  }

  #render() {
    TemplateGenerator.setTemplate(this, TEMPLATE, this.boardConfig);
    this.#Minefield = this.#getBoardElement('app-minefield');
    this.#GameTimer = this.#getBoardElement('app-game-timer');
    this.#FlagsCounter = this.#getBoardElement('app-flags-counter');
    this.#BoardFace = this.#getBoardElement('app-board-face');
  }

  #getBoardElement(elementTag) {
    return this.getElementsByTagName(elementTag)[0];
  }

  #setFaceListener() {
    if (this.#BoardFace) {
      this.#boardFaceListener = this.#onBoardFaceClick.bind(this);
      this.#BoardFace.addEventListener('onBoardFaceClick', this.#boardFaceListener);
    }
  }

  #onBoardFaceClick() {
    this.start();
  }

  #setFaceState(faceType) {
    if (this.#BoardFace) {
      this.#BoardFace.setAttribute('state', faceType);
    }
  }

  #removeFaceListener() {
    if (this.#BoardFace) {
      this.#BoardFace.removeEventListener('onBoardFaceClick', this.#boardFaceListener);
    }
    this.#boardFaceListener = undefined;
  }

  #setFlagsCounter(value) {
    if (this.#FlagsCounter) {
      this.#FlagsCounter.setValue(value);
    }
  }

}

customElements.define('app-game-board-original', GameBoardOriginal);