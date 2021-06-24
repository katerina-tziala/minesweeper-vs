'use strict';
import './minefield.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './minefield.constants';
import { NumberValidation, parseBoolean, sortNumbersArrayAsc } from 'UTILS';
import { MinefieldUI } from './minefield-ui/minefield-ui';
import * as MinefieldHelper from './minefield-helper';
import { TileState } from './tile/tile-state.enum';
import MinefieldEventsHandler from './minefield-events-handler';
import AppUserService from '../../state-controllers/app-user.service';
import * as TileChecker from './tile/tile-checker';
import { MinefieldAction } from './minefield-action.enum';
import { MinefieldState } from './minefield-state.enum';
import { TileType } from './tile/tile-type.enum'
export default class Minefield extends HTMLElement {
  #canvas;
  #attributeUpdateHandler = new Map();
  #MinefieldUI;
  #eventsHandler;
  #subscribers$ = [];
  #userService;
  #minesPositions = [];
  #disabledPositions = [];
  #unrevealedTiles = [];
  #revealedTiles = [];
  #activeTiles = [];
  #actionHandler = new Map();
  #tileRevealingHandler = new Map();
  #fieldState = MinefieldState.InProgress;

  constructor() {
    super();
    this.#userService = AppUserService.getInstance();
    this.#actionHandler.set(MinefieldAction.Primary, this.#onPrimaryAction.bind(this));
    this.#actionHandler.set(MinefieldAction.Secondary, this.#onSecondaryAction.bind(this));
    // TODO:  on settings update
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

  get #gridSize() {
    return { rows: this.rows, columns: this.columns };
  }

  get #onlyUnrevealedMinesOnField() {
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

  get mines() {
    return this.#getNumberAttribute(ATTRIBUTES.mines);
  }

  set disabledPositions(disabledPositions = []) {
    this.#disabledPositions = disabledPositions;
  }

  get state() {
    return this.#fieldState;
  }

  static get observedAttributes() {
    return [ATTRIBUTES.disabled];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.#canvas = this.querySelector(`.${DOM_ELEMENT_CLASS.minefield}`);
    this.#MinefieldUI = new MinefieldUI(this.#userService.theme, this.#userService.mineType);
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
    this.#fieldState = MinefieldState.InProgress;
    this.#minesPositions = minesPositions;
    this.#revealedTiles = [];
    this.disabledPositions = [];
    const fieldTiles = this.#generateGridTiles();
    this.#unrevealedTiles = [...fieldTiles];
    this.#MinefieldUI.initMinefield(this.#unrevealedTiles, this.#minesPositions);
    this.#checkListeners();
  }

  revealTile(tile, playerId = null) {
    this.#removeListeners();
    const updatedTile = this.#getUpdatedTile(tile, playerId, TileState.Revealed);
    const { type } = tile;
    if (this.#tileRevealingHandler.has(type)) {
      this.#tileRevealingHandler.get(type)(updatedTile);
    }
  }

  flagTile(tile, playerId) {
    this.#removeListeners();
    const flaggedTiles = this.#getFlaggedTiles([tile], playerId)
    this.#updateTiles(flaggedTiles, false);
    const revealedTiles = this.#checkAllMinesDetected();
    if (this.#fieldState === MinefieldState.MinesDetected) {
      this.#revealMinefield();
    }
    this.#onMinefieldUpdated({ revealedTiles, flaggedTiles });
  }

  markTile(tile, playerId = null) {
    console.log('markTile');
    console.log(tile, playerId);
  }

 // markTile(tile, playerId = null) {
  //   const updatedTile = this.#getUpdatedTile(tile, playerId);
  //   updatedTile.state = TileState.Marked;
  //   this.#updateTiles(updatedTile);
  //   this.#MinefieldUI.drawMarkedTile(updatedTile);
  //   this.#submiTileUpdate(updatedTile, 'onTileMarked');
  // }

  resetTile(tile) {
    console.log('resetTile');
    console.log(tile, playerId);
  }

  // resetTile(tile) {
  //   const updatedTile = { ...tile };
  //   updatedTile.state = TileState.Untouched;
  //   updatedTile.modifiedBy = null;
  //   this.#updateTiles(updatedTile);
  //   this.#MinefieldUI.drawUntouchedTile(updatedTile);
  //   this.#submiTileUpdate(updatedTile, 'onTileReseted');
  // }
  #onMinefieldUpdated(update) {
    console.log('-- onMinefieldUpdated');
    console.log(this.#fieldState);
    console.log(update);
  }

  #revealMinefield() {
    console.log('revealMinefield');
    console.log('show detected mines');
    console.log(this.#unrevealedTiles);
  }

  #getUpdatedTile(tile, modifiedBy, state) {
    const styles = this.#userService.getPlayerConfig(modifiedBy);
    const updatedTile = MinefieldHelper.getUpdatedTile(tile, modifiedBy, state);
    updatedTile.styles = styles;
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
    this.#submitActiveTileChange();
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
      this.#submitActiveTileChange();
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

  #getFlaggedTiles(tilesToFlag, playerId) {
    const flaggedTiles = [];
    for (let index = 0; index < tilesToFlag.length; index++) {
      const updatedTile = this.#getUpdatedTile(tilesToFlag[index], playerId, TileState.Flagged);
      updatedTile.wrongFlagHint = this.#wrongFlagHint;
      this.#MinefieldUI.drawFlaggedTile(updatedTile);
      flaggedTiles.push(updatedTile);
    }
    return flaggedTiles;
  }

  #detonateMine(detonatedMine) {
    this.#updateTiles([detonatedMine]);
    this.#MinefieldUI.drawRevealedTile(detonatedMine);
    this.#fieldState = MinefieldState.DetonatedMine;
    this.#revealMinefield();
    this.#onMinefieldUpdated({ detonatedMine });
  }

  #revealEmptyTile(tile) {
    this.#MinefieldUI.drawRevealedTile(tile);
    this.#onRevealedTiles([tile], tile.modifiedBy);
  }

  #revealBlankTile(tile) {
    const areaToReveal = MinefieldHelper.getAreaToReveal([tile], this.#unrevealedTiles);
    const revealedTiles = this.#getRevealedTiles(areaToReveal, tile.modifiedBy);
    this.#onRevealedTiles(revealedTiles, tile.modifiedBy);
  }

  #onRevealedTiles(revealedTiles, playerId) {
    this.#updateTiles(revealedTiles);
    const flaggedTiles = this.#checkClearedMinefield(playerId);
    this.#updateTiles(flaggedTiles, false);
    if (this.#fieldState === MinefieldState.FieldCleared) {
      this.#revealMinefield();
    } else {
      this.#setListeners();
    }
    this.#onMinefieldUpdated({ revealedTiles, flaggedTiles });
  }

  #checkClearedMinefield(playerId) {
    if (this.#onlyUnrevealedMinesOnField) {
      this.#fieldState = MinefieldState.FieldCleared;
      return this.#flagging ? this.#getFlaggedTiles(this.#unrevealedTiles, playerId) : [];
    }
    return [];
  }
  #checkAllMinesDetected(playerId) {
    const allMinesFlagged = MinefieldHelper.allMinesFlagged(this.#unrevealedTiles, this.#minesPositions);
    if (allMinesFlagged) {
      this.#fieldState = MinefieldState.MinesDetected;
      return this.#revealing ? this.#revealUntouchedAndMarkedTiles(playerId) : [];
    }
    this.#setListeners();
    return [];
  }

  #revealUntouchedAndMarkedTiles(playerId) {
    const tilesToReveal = MinefieldHelper.getUntouchedAndMarkedTiles(this.#unrevealedTiles);
    const revealedTiles = this.#getRevealedTiles(tilesToReveal, playerId);
    this.#updateTiles(revealedTiles);
    return revealedTiles;
  }

  #onSelectedTile(params) {
    this.#resetCurrentActiveTiles();
    this.#submitActiveTileChange();

    const { position, action } = params;
    const tile = this.#getAllowedUnrevealedTile(position);
    if (tile && this.#actionHandler.has(action)) {
      this.#actionHandler.get(action)(tile);
    }
  }

  #onSecondaryAction(tile) {
    const eventType = this.#flagging ? 'onChangeTileState' : this.#revealing ? 'onRevealTile' : undefined;
    this.#emitTileUpdateAction(tile, eventType);
  }

  #emitTileUpdateAction(tile, eventType) {
    if (eventType) {
      const event = new CustomEvent(eventType, { detail: { tile } });
      this.dispatchEvent(event);
    }
  }

  #onPrimaryAction(tile) {
    const eventType = this.#revealing ? 'onRevealTile' : this.#flagging ? 'onChangeTileState' : undefined;
    this.#emitTileUpdateAction(tile, eventType);
  }

  #submitActiveTileChange() {
    const activeTile = !!this.#activeTiles.length;
    const event = new CustomEvent('onActiveTileChange', { detail: { activeTile } });
    this.dispatchEvent(event);
  }

}

customElements.define('app-minefield', Minefield);