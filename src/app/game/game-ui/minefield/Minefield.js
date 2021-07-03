'use strict';
import './minefield.scss';
import { NumberValidation, parseBoolean, definedString } from 'UTILS';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './minefield.constants';
import { MinefieldUI } from './minefield-ui/minefield-ui';
import * as MinefieldHelper from './minefield-helper';
import { MinefieldEventsHandler, MinefieldEventType } from './minefield-events/@minefield-events.module';
import { TileType, TileState, TileChecker } from './tile/@tile.module';

export default class Minefield extends HTMLElement {
  #canvas;
  #attributeUpdateHandler = new Map();
  #MinefieldUI;
  #eventsHandler;
  #subscribers$ = [];
  #minesPositions = [];
  #disabledPositions = [];
  #unrevealedTiles = [];
  #revealedTiles = [];
  #activeTiles = [];
  #actionHandler = new Map();
  #tileRevealingHandler = new Map();
  #tileStyles = {};

  constructor() {
    super();
    this.#actionHandler.set(MinefieldEventType.Primary, this.#onPrimaryAction.bind(this));
    this.#actionHandler.set(MinefieldEventType.Secondary, this.#onSecondaryAction.bind(this));
    this.#tileRevealingHandler.set(TileType.Blank, this.#revealBlankTile.bind(this));
    this.#tileRevealingHandler.set(TileType.Empty, this.#revealEmptyTile.bind(this));
    this.#tileRevealingHandler.set(TileType.Mine, this.#detonateMine.bind(this));
  }

  get #revealing() {
    const revealing = this.getAttribute(ATTRIBUTES.revealing);
    return parseBoolean(revealing);
  }

  get #flagging() {
    const flagging = this.getAttribute(ATTRIBUTES.flagging);
    return parseBoolean(flagging);
  }

  get #wrongFlagHint() {
    const wrongFlagHint = this.getAttribute(ATTRIBUTES.wrongFlagHint);
    return parseBoolean(wrongFlagHint);
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return parseBoolean(disabled);
  }

  get #theme() {
    const theme = this.getAttribute(ATTRIBUTES.theme);
    return definedString(theme) ? theme : 'light';
  }

  get #mineType() {
    return this.getAttribute(ATTRIBUTES.mineType);
  }

  get #gridSize() {
    return { rows: this.rows, columns: this.columns };
  }

  get #allMinesDetected() {
    return MinefieldHelper.allMinesFlagged(this.#unrevealedTiles, this.#minesPositions);
  }

  get #onlyMinesUnrevealed() {
    return this.#unrevealedTiles.every(tile => TileChecker.containsMine(tile));
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

  set disabledPositions(disabledPositions = []) {
    this.#disabledPositions = disabledPositions;
  }

  static get observedAttributes() {
    return [ATTRIBUTES.disabled, ATTRIBUTES.theme, ATTRIBUTES.mineType];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.#canvas = this.querySelector(`.${DOM_ELEMENT_CLASS.minefield}`);
    this.setAttribute(ATTRIBUTES.theme, this.#theme);
    this.#MinefieldUI = new MinefieldUI(this.#theme, this.#mineType);
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

  disconnectedCallback() {
    this.#removeListeners();
    this.#subscribers$.forEach(subscriber => subscriber.unsubscribe());
    this.#subscribers$ = [];
  }

  init(minesPositions) {
    this.#minesPositions = minesPositions;
    this.#revealedTiles = [];
    this.disabledPositions = [];
    const fieldTiles = this.#generateGridTiles();
    this.#unrevealedTiles = [...fieldTiles];
    this.#MinefieldUI.initMinefield(this.#unrevealedTiles, this.#minesPositions);
    this.#checkListeners();
  }


  revealMines() {
    const mineTiles = MinefieldHelper.getTilesByPositions(this.#unrevealedTiles, this.#minesPositions);
    console.log('reveal mines -- show double targets');
    console.log(mineTiles);
    this.#updateTiles(mineTiles, true);
    this.#MinefieldUI.drawRevealedTiles(mineTiles);
  }

  flagUntouchedMines() {
    console.log('flagUntouchedMines');

    // console.log(this.#unrevealedTiles);
  }

  revealMineField() {
    console.log('revealMineField');
    console.log('show who revealed what');
    console.log('show double flags');
    // console.log(this.#unrevealedTiles);
  }

  flagTile(tile, playerId, styles = {}) {
    this.#tileStyles = {...styles};
    this.#removeListeners();
    const flaggedTile = this.#getUpdatedTile(tile, playerId, TileState.Flagged);
    flaggedTile.wrongFlagHint = this.#wrongFlagHint;
    this.#MinefieldUI.drawFlaggedTile(flaggedTile);
    this.#updateTiles([flaggedTile], false);
    const allMinesDetected = this.#allMinesDetected;
    this.#emitEvent('onFlaggedTile', { flaggedTile, allMinesDetected });
    this.#setListeners();
  }

  markTile(tile, playerId = null, styles = {}) {
    this.#tileStyles = {...styles};
    const markedTile = this.#getUpdatedTile(tile, playerId, TileState.Marked);
    this.#updateTiles([markedTile], false);
    this.#MinefieldUI.drawMarkedTile(markedTile);
    this.#emitEvent('onMarkedTile', { markedTile });
  }

  resetTile(tile) {
    const { wrongFlagHint, styles, ...resetedTile } = MinefieldHelper.getUpdatedTile(tile, null, TileState.Untouched);
    this.#updateTiles([resetedTile], false);
    this.#MinefieldUI.drawUntouchedTile(resetedTile);
    this.#emitEvent('onResetedTile', { resetedTile });
  }

  revealTile(tile, playerId = null, styles = {}) {
    this.#tileStyles = {...styles};
    this.#removeListeners();
    const updatedTile = this.#getUpdatedTile(tile, playerId, TileState.Revealed);
    const { type } = tile;
    if (this.#tileRevealingHandler.has(type)) {
      this.#tileRevealingHandler.get(type)(updatedTile);
    }
  }

  #detonateMine(detonatedMine) {
    this.#updateTiles([detonatedMine]);
    this.#MinefieldUI.drawRevealedTile(detonatedMine);
    const event = new CustomEvent('onDetonatedMine', { detail: { detonatedMine } });
    this.dispatchEvent(event);
  }

  #revealEmptyTile(updatedTile) {
    const revealedTiles = [updatedTile];
    this.#updateTiles(revealedTiles);
    this.#MinefieldUI.drawRevealedTile(updatedTile);
    this.#emitRevealedTiles(revealedTiles);
  }

  #revealBlankTile(updatedTile) {
    const areaToReveal = MinefieldHelper.getAreaToReveal([updatedTile], this.#unrevealedTiles);
    const revealedTiles = this.#getRevealedTiles(areaToReveal, updatedTile.modifiedBy);
    this.#emitRevealedTiles(revealedTiles);
  }

  #getUpdatedTile(tile, modifiedBy, state) {
    const updatedTile = MinefieldHelper.getUpdatedTile(tile, modifiedBy, state);
    updatedTile.styles = {...this.#tileStyles};
    return updatedTile;
  }

  #updateTiles(updatedTiles, revealed = true) {
    const tilesPositions = MinefieldHelper.getTilesPositions(updatedTiles);
    this.#unrevealedTiles = this.#unrevealedTiles.filter(existingTile => !tilesPositions.includes(existingTile.position));
    if (!revealed) {
      this.#unrevealedTiles = this.#unrevealedTiles.concat(updatedTiles);
    } else {
      this.#revealedTiles = this.#revealedTiles.concat(updatedTiles);
    }
  }

  #getNumberAttribute(name = ATTRIBUTES.rows) {
    return NumberValidation.numberFromString(this.getAttribute(name));
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#onDisabledChange.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.theme, this.#onThemeChange.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.mineType, this.#onMineTypeChange.bind(this));
  }

  // TODO
  #onThemeChange() {
    console.log('onThemeChange');
    console.log(this.#theme);
  }

  // TODO
  #onMineTypeChange() {
    console.log('onMineTypeChange');
    console.log(this.#mineType);
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

  #onDisabledChange() {
    this.#resetCurrentActiveTiles();
    this.#checkListeners();
  }

  #resetCurrentActiveTiles() {
    this.#activeTiles.forEach(tile => this.#MinefieldUI.drawTile(tile));
    this.#activeTiles = [];
  }

  #drawActiveTiles() {
    this.#activeTiles.forEach(tile => this.#MinefieldUI.drawActiveTile(tile));
  }
  #getAllowedUnrevealedTile(position) {
    if (this.#disabledPositions.includes(position)) {
      return;
    }
    return this.#unrevealedTiles.find(tile => tile.position === position);
  }

  #onTileActivation(position) {
    this.#resetCurrentActiveTiles();
    const tile = this.#getAllowedUnrevealedTile(position);
    if (tile) {
      this.#activeTiles = [{ ...tile }];
      this.#drawActiveTiles();
    }
    this.#emitActiveTileChange();
  }

  #onAreaActivation(position) {
    this.#resetCurrentActiveTiles();
    const tile = this.fieldTiles.find(tile => tile.position === position);
    this.#activeTiles = MinefieldHelper.getGridArea(tile, this.fieldTiles, this.#disabledPositions);
    this.#drawActiveTiles();
  }

  #onResetActiveTiles() {
    const notify = this.#activeTiles.length === 1;
    this.#resetCurrentActiveTiles();
    if (notify) {
      this.#emitActiveTileChange();
    }
  }

  #getRevealedTiles(tilesToReveal, playerId) {
    const revealedTiles = [];
    for (let index = 0; index < tilesToReveal.length; index++) {
      const updatedTile = this.#getUpdatedTile(tilesToReveal[index], playerId, TileState.Revealed);
      this.#MinefieldUI.drawRevealedTile(updatedTile);
      revealedTiles.push(updatedTile);
    }
    this.#updateTiles(revealedTiles);
    return revealedTiles;
  }

  #onSelectedTile(params) {
    this.#resetCurrentActiveTiles();
    this.#emitActiveTileChange();

    const { position, action } = params;
    const tile = this.#getAllowedUnrevealedTile(position);
    if (tile && this.#actionHandler.has(action)) {
      this.#actionHandler.get(action)(tile);
    }
  }

  #onSecondaryAction(tile) {
    const eventType = this.#flagging ? 'onChangeTileState' : this.#revealing ? 'onRevealTile' : undefined;
    this.#emitEvent(eventType, { tile });
  }

  #onPrimaryAction(tile) {
    const eventType = this.#revealing ? 'onRevealTile' : this.#flagging ? 'onChangeTileState' : undefined;
    this.#emitEvent(eventType, { tile });
  }

  #emitActiveTileChange() {
    const activeTile = !!this.#activeTiles.length;
    this.#emitEvent('onActiveTileChange', { activeTile });
  }

  #emitRevealedTiles(revealedTiles) {
    const minefieldCleared = this.#onlyMinesUnrevealed;
    if (!minefieldCleared) {
      this.#setListeners();
    }
    this.#emitEvent('onRevealedTiles', { revealedTiles, minefieldCleared });
  }

  #emitEvent(eventType, data) {
    if (eventType) {
      const event = new CustomEvent(eventType, { detail: data });
      this.dispatchEvent(event);
    }
  }

}

customElements.define('app-minefield', Minefield);