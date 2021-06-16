'use strict';
import './minefield.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './minefield.constants';
import { TemplateGenerator } from 'UI_ELEMENTS';
import { NumberValidation } from 'UTILS';
import { MinefieldUI } from './minefield-ui/minefield-ui';
import * as MinefieldHelper from './minefield-helper';
import { TileState } from './tile/tile-state.enum';
import { MinefieldAction } from './minefield-action.enum';

import { STYLES_CONFIG, PALLETE } from './minefield-ui/minefield-ui-config/minefield-ui.constants';
import { parseBoolean, enumKey, debounce } from 'UTILS';
import * as TileChecker from './tile/tile-checker';
import MinefieldEventsHandler from './minefield-events-handler';

export default class Minefield extends HTMLElement {
  #canvas;
  #minesPositions = [];
  #disabledPositions = [];
  #unrevealedTiles = [];
  #revealedTiles = [];
  #attributeUpdateHandler;
  #MinefieldUI;
  #eventsHandler;
  #subscribers$ = [];
  #activeTiles = [];

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  #getNumberAttribute(name = ATTRIBUTES.rows) {
    return NumberValidation.numberFromString(this.getAttribute(name));
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return parseBoolean(disabled);
  }

  get #gridSize() {
    return { rows: this.rows, columns: this.columns };
  }

  get fieldTiles() {
    return [...this.#unrevealedTiles, this.#revealedTiles];
  }

  get rows() {
    return this.#getNumberAttribute(ATTRIBUTES.rows);
  }

  get columns() {
    return this.#getNumberAttribute(ATTRIBUTES.columns);
  }

  get mines() {
    return this.#getNumberAttribute(ATTRIBUTES.mines);
  }

  set disabledPositions(disabledPositions = []) {
    return this.#disabledPositions = disabledPositions;
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.#canvas = this.querySelector(`.${DOM_ELEMENT_CLASS.minefield}`);
    // TODO
    this.#MinefieldUI = new MinefieldUI('light', 'virusMine');
    this.#MinefieldUI.init(this.#canvas, this.rows, this.columns);
    this.#eventsHandler = new MinefieldEventsHandler(this.columns, this.rows);
    this.#subscribers$ = [
      this.#eventsHandler.selectedFieldPosition$.subscribe(this.#onSelectedTile.bind(this)),
      this.#eventsHandler.resetRevealedArea$.subscribe(this.#onResetActiveTiles.bind(this)),
      this.#eventsHandler.activeTile$.subscribe(this.#onTileActivation.bind(this)),
      this.#eventsHandler.activeArea$.subscribe(this.#onAreaActivation.bind(this))
    ];
    this.#initUpdatesHandling();
  }

  init(minesPositions) {
    this.#minesPositions = minesPositions;
    this.#revealedTiles = [];
    this.disabledPositions = [];
    this.#unrevealedTiles = this.#generateGridTiles();
    this.#MinefieldUI.initCanvas(this.#unrevealedTiles, this.#minesPositions);
    this.#checkListeners();
  }


















  revealTile(tile, playerId = null) {
    const updatedTile = { ...tile };
    updatedTile.state = TileState.Revealed;
    updatedTile.modifiedBy = playerId;
    this.#unrevealedTiles = this.#unrevealedTiles.filter(existingTile => existingTile.position !== tile.position);
    this.#revealedTiles.push(updatedTile);

    console.log("revealTile");
    console.log(this.#unrevealedTiles);
    console.log(this.#revealedTiles);
    console.log(updatedTile);
    this.#MinefieldUI.drawRevealedTile(updatedTile, this.#minesPositions);
  }

  flagTile(tile, playerId = null, colorKey = '1', flagType = 'awesomeFlag') {
    const updatedTile = { ...tile };
    updatedTile.state = TileState.Flagged;
    updatedTile.modifiedBy = playerId;

    this.#updateTiles(updatedTile);

    console.log("flagTile");
    console.log(this.#unrevealedTiles);
    console.log(updatedTile);

    this.#MinefieldUI.drawFlag(updatedTile, colorKey, flagType);
  }

  markTile(tile, playerId = null, colorKey = '1') {
    const updatedTile = { ...tile };
    updatedTile.state = TileState.Marked;
    updatedTile.modifiedBy = playerId;

    this.#updateTiles(updatedTile);

    console.log("markTile");
    console.log(this.#unrevealedTiles);
    console.log(updatedTile);
    this.#MinefieldUI.drawMark(updatedTile, colorKey);

  }


  resetTile(tile) {
    const updatedTile = { ...tile };
    updatedTile.state = TileState.Untouched;
    updatedTile.modifiedBy = null;

    this.#updateTiles(updatedTile);

    console.log("resetTile");
    console.log(this.#unrevealedTiles);
    console.log(updatedTile);
    this.#MinefieldUI.drawTile(updatedTile);

  }
  #updateTiles(updatedTile) {
    this.#unrevealedTiles = this.#unrevealedTiles.filter(existingTile => existingTile.position !== updatedTile.position);
    this.#unrevealedTiles.push({ ...updatedTile });
  }





  disconnectedCallback() {
    this.#removeListeners();
    this.#subscribers$.forEach(subscriber => subscriber.unsubscribe());
    this.#subscribers$ = [];
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#onDisabledChange.bind(this));
  }

  #checkListeners() {
    this.#disabled ? this.#removeListeners() : this.#setListeners();
  }

  #generateGridTiles() {
    return MinefieldHelper.generateGridTiles(this.#gridSize, this.#minesPositions);
  }

  #setListeners() {
    this.#eventsHandler.setListeners(this.#canvas);
  }

  #removeListeners() {
    this.#eventsHandler.removeListeners(this.#canvas);
  }
  #getAllowedUnrevealedTile(position) {
    if (this.#disabledPositions.includes(position)) {
      return;
    }
    return this.#unrevealedTiles.find(tile => tile.position === position);
  }

  #resetCurrentActiveTiles() {
    this.#activeTiles.forEach(tile => this.#MinefieldUI.drawTile(tile));
    this.#activeTiles = [];
  }

  #drawActiveTiles() {
    this.#activeTiles.forEach(tile => this.#MinefieldUI.drawActiveTile(tile));
  }

  #onSelectedTile(params) {
    const { position, action } = params;
    const tile = this.#getAllowedUnrevealedTile(position);
    if (tile) {
      this.#MinefieldUI.drawTile(tile);
      const event = new CustomEvent('onSelectTile', { detail: { tile, action } });
      this.dispatchEvent(event);
    }
  }

  #onTileActivation(position) {
    this.#resetCurrentActiveTiles();
    const tile = this.#getAllowedUnrevealedTile(position);
    if (tile) {
      this.#activeTiles = [{ ...tile }];
      this.#drawActiveTiles();
    }
    this.#submitActiveTileChange();
  }

  #onAreaActivation(position) {
    this.#resetCurrentActiveTiles();
    const tile = this.fieldTiles.find(tile => tile.position === position);
    if (tile) {
      this.#activeTiles = [{ ...tile }];
      const neighbors = this.fieldTiles.filter(fieldTile => tile.neighbors.includes(fieldTile.position));
      this.#activeTiles = [...neighbors, { ...tile }];
      this.#drawActiveTiles();
    }
  }

  #onResetActiveTiles() {
    const notify = this.#activeTiles.length === 1;
    this.#resetCurrentActiveTiles();
    if (notify) {
      this.#submitActiveTileChange();
    }
  }

  #submitActiveTileChange() {
    const activeTile = !!this.#activeTiles.length;
    const event = new CustomEvent('onActiveTileChange', { detail: { activeTile } });
    this.dispatchEvent(event);
  }

  #onDisabledChange() {
    this.#resetCurrentActiveTiles();
    this.#checkListeners();
  }

}

customElements.define('app-minefield', Minefield);