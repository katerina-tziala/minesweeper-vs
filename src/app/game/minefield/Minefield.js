'use strict';
import './minefield.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './minefield.constants';
import { NumberValidation } from 'UTILS';
import { MinefieldUI } from './minefield-ui/minefield-ui';
import * as MinefieldHelper from './minefield-helper';
import { TileState } from './tile/tile-state.enum';
import { parseBoolean, arrayDifference } from 'UTILS';
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


  // revealTiles(tile, playerId = null) {
  //   const updatedTile = this.#getUpdatedTile(tile, playerId);
  //   updatedTile.state = TileState.Revealed;
  //   this.#unrevealedTiles = this.#unrevealedTiles.filter(existingTile => existingTile.position !== tile.position);
  //   this.#revealedTiles.push(updatedTile);
  //   this.#MinefieldUI.drawRevealedTile(updatedTile);
  //   this.#checkRevealedTile(updatedTile);
  // }

  revealTile(tile, playerId = null) {
    //  this.#removeListeners();
    const updatedTile = this.#getUpdatedTile(tile, playerId, TileState.Revealed);
    this.#updateTiles([updatedTile]);
    this.#MinefieldUI.drawRevealedTile(updatedTile);
    console.log(tile);
    const { type } = tile;
    if (this.#tileRevealingHandler.has(type)) {
      this.#tileRevealingHandler.get(type)(tile);
    }
  }

  #detonateMine(tile) {
    console.log('detonateMine');
  }

  #revealEmptyTile(tile) {
    console.log('revealEmptyTile');
  }
  #revealBlankTile(tile) {
    console.log('revealBlankTile');
  }

  // #checkRevealedTile(tile) {
  //   if (TileChecker.empty(tile)) {
  //     console.log('empty tile');
  //     // this.#submiTileUpdate(tile, 'onRevealedTile');
  //     return;
  //   }
  //   if (TileChecker.containsMine(tile)) {
  //     console.log('onMineDetonated');
  //     // this.#onMineDetonated(tile);
  //     return;
  //   }

  //   console.log('checkRevealedArea');
  //   console.log(tile);
  // }


  setFlagOnTile(tile, playerId) {
    this.#removeListeners();
    const updatedTile = this.#getUpdatedTile(tile, playerId, TileState.Flagged);
    updatedTile.wrongFlagHint = this.#wrongFlagHint;
    this.#updateTiles([updatedTile]);
    this.#MinefieldUI.drawFlaggedTile(updatedTile);

    const revealedTiles = this.#checkAllMinesDetected(playerId);
    const updatedTiles = [updatedTile, ...revealedTiles];
    const fieldState = this.#fieldState;
    console.log('setFlagOnTile');
    console.log(fieldState, updatedTiles);
  }

  setMarkOnTile(tile, playerId = null) {
    console.log('setMarkOnTile');
    console.log(tile, playerId);
  }

  resetTile(tile) {
    console.log('resetTile');
    console.log(tile, playerId);
  }


  #getUpdatedTile(tile, modifiedBy, state) {
    const styles = this.#userService.getPlayerConfig(modifiedBy);
    const updatedTile = MinefieldHelper.getUpdatedTile(tile, modifiedBy, state);
    updatedTile.styles = styles;
    return updatedTile;
  }

  #updateTiles(updatedTiles) {
    const revealed = TileChecker.revealed(updatedTiles[0]);
    const tilesPositions = MinefieldHelper.getTilesPositions(updatedTiles);
    this.#unrevealedTiles = this.#unrevealedTiles.filter(existingTile => !tilesPositions.includes(existingTile.position));
    if (!revealed) {
      this.#unrevealedTiles = this.#unrevealedTiles.concat(updatedTiles);
    } else {
      this.#revealedTiles = this.#revealedTiles.concat(updatedTiles);
    }
  }

  #checkAllMinesDetected(playerId) {
    const allMinesFlagged = MinefieldHelper.allMinesFlagged(this.#unrevealedTiles, this.#minesPositions);
    if (allMinesFlagged) {
      this.#fieldState = MinefieldState.MinesDetected;
      const tilesToReveal = MinefieldHelper.getUntouchedAndMarkedTiles(this.#unrevealedTiles);
      const revealedTiles = this.#getRevealedTiles(tilesToReveal, playerId);
      this.#updateTiles(revealedTiles);
      this.#revealBoard();
      return revealedTiles;
    }
    this.#setListeners();
    return [];
  }

  #getRevealedTiles(tilesToReveal, playerId) {
    return tilesToReveal.map(tile => {
      const revealedTile = this.#getUpdatedTile(tile, playerId, TileState.Revealed);
      this.#MinefieldUI.drawRevealedTile(revealedTile);
      return revealedTile;
    });
  }

  #revealBoard() {
    console.log('revealBoard');
    console.log('show detected mines');
    console.log(this.#unrevealedTiles);
  }




  // markTile(tile, playerId = null) {
  //   const updatedTile = this.#getUpdatedTile(tile, playerId);
  //   updatedTile.state = TileState.Marked;
  //   this.#updateTiles(updatedTile);
  //   this.#MinefieldUI.drawMarkedTile(updatedTile);
  //   this.#submiTileUpdate(updatedTile, 'onTileMarked');
  // }

  // resetTile(tile) {
  //   const updatedTile = { ...tile };
  //   updatedTile.state = TileState.Untouched;
  //   updatedTile.modifiedBy = null;
  //   this.#updateTiles(updatedTile);
  //   this.#MinefieldUI.drawUntouchedTile(updatedTile);
  //   this.#submiTileUpdate(updatedTile, 'onTileReseted');
  // }

  // #onMineDetonated(tile) {
  //   this.#removeListeners();
  //   const mineTiles = this.#unrevealedTiles.filter(mineTile => this.#minesPositions.includes(mineTile.position));
  //   mineTiles.forEach(mineTile => this.#MinefieldUI.drawRevealedTile(mineTile));
  //   this.#submiTileUpdate(tile, 'onDetonatedMine');
  // }

  // #submiTileUpdate(tile, type) {
  //   const event = new CustomEvent(type, { detail: { tile } });
  //   this.dispatchEvent(event);
  // }






  ///
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