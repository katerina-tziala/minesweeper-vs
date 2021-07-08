'use strict';
import { TileChecker } from '../game-ui/minefield/@minefield.module';
import '../game-ui/game-timer/GameTimer';
import '../game-ui/flags-counter/FlagsCounter';
import { BoardFaceType } from '../game-ui/board-face/@board-face.module';

import './game-board.scss';



import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './game-board.constants';
import { generateMinesPositions } from '../game-utils/game-utils';
import { TemplateGenerator, ElementHandler } from 'UI_ELEMENTS';
export default class GameBoard extends HTMLElement {
  #level = {};
  #options = {};
  #gameStyles = {};
  #player;
  #Minefield;
  #GameTimer;
  #FlagsCounter;
  #BoardFace;

  #boardFaceListener;

  #minefieldListeners;

  constructor() {
    super();
    this.#minefieldListeners = new Map();
    this.#minefieldListeners.set('onActiveTileChange', this.#onActiveTileChange.bind(this));
    this.#minefieldListeners.set('onRevealTile', this.#onRevealTile.bind(this));
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
      this.#Minefield.revealTile(tile, id);
    }
  }




  // static get observedAttributes() {
  //   return Object.values(ATTRIBUTES);
  // }

  // attributeChangedCallback(attrName, oldVal, newVal) {
  //   console.log('attributeChangedCallback GameBoard ', attrName);
  //   // upgrated
  // }

  // connectedCallback() {
  //   console.log('connectedCallback GameBoard');
  // }

  get boardConfig() {
    const { rows, columns } = this.#level;
    const config = { ...this.#gameStyles, ...this.#options, rows, columns };
    config.revealing = true;
    config.flagging = true;
    config.disabled = false;
    config.turnDuration = 0;
    return config;
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
    this.#setFaceState(BoardFaceType.Smile);



    console.log(this.#Minefield);
    const minesPositions = [1, 2, 3, 80, 81];

    this.#setFlagsCounter(minesPositions.length);
    // // console.log(generateMinesPositions(this.#level.rows, this.#level.columns, this.#level.numberOfMines));
    this.#Minefield.init(minesPositions);
    // const asd = this.getElementsByTagName('app-minefield')[0];
    console.log(this.#GameTimer);
    // console.log(asd);

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


  disconnectedCallback() {
    console.log('disconnectedCallback GameBoard');
    this.#removeFaceListener();
    this.#removeMinefieldListeners();
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
    console.log('restart');
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

customElements.define('app-game-board', GameBoard);