'use strict';
import { DATES } from 'UTILS';

import { TileChecker } from '../minefield/@minefield.module';
import '../game-timer/GameTimer';
import '../flags-counter/FlagsCounter';
import { BoardFaceType } from '../board-face/@board-face.module';
import { generateMinesPositions } from '../../game-utils/game-utils';

import './game-board.scss';

import { GameEndType } from './game-end-type.enum';
import { generateTemplate } from './game-board-generator/game-board-generator';

export default class GameBoard extends HTMLElement {
  #level = {};
  #options = {};
  #gameStyles = {};

  Minefield;
  #GameTimer;
  #FlagsCounter;
  #BoardFace;

  #player = null;
  #boardFaceListener;
  #minefieldListeners;
  #startedAt = null;
  #endedAt = null;

  constructor() {
    super();
  }

  get #minesPositions() {
    return generateMinesPositions(this.#level.rows, this.#level.columns, this.#level.numberOfMines);
  }

  get boardConfig() {
    const { rows, columns } = this.#level;
    const config = { ...this.#gameStyles, ...this.#options, rows, columns };
    // config.revealing = true;
    // config.flagging = true;
    config.disabled = true;
    // config.turnDuration = 0;
    return config;
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
    this.#setFlagsCounter(this.#level.numberOfMines);
    this.setFaceState(BoardFaceType.Smile);
    this.resetTimer();
  }

  setBoardDisabledState(disabled) {
    if (this.Minefield) {
      this.Minefield.setAttribute('disabled', disabled);
    }
  }

  setPlayer(player = null) {
    this.#player = player;
    this.setBoardDisabledState(!this.#player);
  }

  start(player, minesPositions = []) {
    this.setPlayer(player);
    this.#startedAt = null;
    this.#endedAt = null;
    minesPositions = minesPositions.length ? minesPositions : this.#minesPositions;
    this.#initBoard();
  }

  resetTimer() {
    if (this.#GameTimer) {
      this.#GameTimer.reset();
    }
  }

  onRevealTile(event) {
    console.log('onRevealTile');
    //   const { detail: { tile } } = event;
    //   const { id } = this.#player;
    //   if (!TileChecker.flagged(tile)) {
    //     this.#checkStart();
    //     this.#Minefield.revealTile(tile, id);
    //   }
  }

  onTilesRevealed(event) {
    console.log('onTilesRevealed');
    //   const { detail: { revealedTiles, minefieldCleared } } = event;
    //   if (minefieldCleared) {
    //     this.#onGameEnd(GameEndType.FieldCleared);
    //   }
  }

  onChangeTileState(event) {
    console.log('onChangeTileState');
    //   this.#checkStart();
    //   const { detail: { tile } } = event;
    //   const { id, styles } = this.#player;
    //   if (TileChecker.untouched(tile)) {
    //     this.#Minefield.flagTile(tile, id, styles);
    //   } else {
    //     this.#changeTouchedTileState(tile);
    //   }
  }

  // #changeTouchedTileState(tile) {
  //   const markTile = TileChecker.flagged(tile) && this.#options.marks;
  //   const { id, styles } = this.#player;
  //   markTile ? this.#Minefield.markTile(tile, id, styles) : this.#Minefield.resetTile(tile);
  // }

  onDetonatedMine(event) {
    console.log('onDetonatedMine');
    // this.#onGameEnd(GameEndType.DetonatedMine);
  }

  onMarkedTile(event) {
    console.log('onMarkedTile')
  }

  onFlaggedTile(event) {
    console.log('onFlaggedTile')
  }

  onResetedTile(event) {
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
  //     this.#GameTimer.start(1);
  //   }
  // }

  // #checkFlaggedTiles() {
  //   const { misplacedFlagHint } = this.#options;
  //   let flagsCounterValue = this.#level.numberOfMines;
  //   flagsCounterValue -= misplacedFlagHint ? this.#Minefield.detectedMines.length : this.#Minefield.flaggedTiles.length;
  //   this.#setFlagsCounter(flagsCounterValue);
  // }

  // #onGameEnd(gameEndType) {
  //   this.#endedAt = DATES.nowTimestamp();
  //   this.#GameTimer.stop();
  //   this.#Minefield.revealMines();
  //   const faceType = gameEndType === GameEndType.DetonatedMine ? BoardFaceType.Looser : BoardFaceType.Winner;
  //   this.#setFaceState(faceType);
  //   const data = {
  //     startedAt: this.#startedAt,
  //     endedAt: this.#endedAt,
  //     gameEndType
  //   };
  //   console.log(data);
  // }




  setFaceColor() {
    if (this.#player) {
      this.#BoardFace.setAttribute('color', `type-${this.#player.styles.colorType}`);
    }
  }

  setFaceState(faceType) {
    if (this.#BoardFace) {
      this.#BoardFace.setAttribute('state', faceType);
    }
  }

  #render() {
    const template = generateTemplate(this.boardConfig);
    this.append(template);
    this.Minefield = this.#getBoardElement('app-minefield');
    this.#GameTimer = this.#getBoardElement('app-game-timer');
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
    if (this.#FlagsCounter) {
      this.#FlagsCounter.setValue(value);
    }
  }

  #onActiveTileChange(event) {
    const { detail: { activeTile } } = event;
    const faceType = activeTile ? BoardFaceType.Surprise : BoardFaceType.Smile;
    this.setFaceState(faceType);
  }

}

customElements.define('app-game-board', GameBoard);