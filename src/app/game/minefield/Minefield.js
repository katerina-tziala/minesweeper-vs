'use strict';
import './minefield.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './minefield.constants';
import { TemplateGenerator } from 'UI_ELEMENTS';
import { NumberValidation } from 'UTILS';
import { MinefieldUI } from './minefield-ui/minefield-ui';
import * as TileGenerator from './tile/tile-utils';
import * as MinefieldHelper from './minefield-helper';
import { TileState } from './tile/tile-state.enum';

import * as TileChecker from './tile/tile-checker';
export default class Minefield extends HTMLElement {
  #canvas;
  #minesPositions;
  #tiles = [];
  #revealedTiles = [];
  #MinefieldUI;

  constructor() {
    super();
    this.#MinefieldUI = new MinefieldUI();
  }

  #getNumberAttribute(name = ATTRIBUTES.rows) {
    return NumberValidation.numberFromString(this.getAttribute(name));
  }

  get #gridSize() {
    return { rows: this.rows, columns: this.columns };
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

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // console.log('attributeChangedCallback Minefield ', attrName);
    // upgrated
  }

  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.#canvas = this.querySelector(`.${DOM_ELEMENT_CLASS.minefield}`);
    this.#MinefieldUI.init(this.#canvas, this.rows, this.columns);
  }

  init(minesPositions) {
    this.#minesPositions = minesPositions;
    this.#revealedTiles = [];
    this.#tiles = this.#generateGridTiles();
    this.#MinefieldUI.initCanvas(this.#tiles);

    // console.log(this.#minesPositions);
    // console.log(this.#gridSize);
    // console.log(this.#canvas);
    // console.log(this.#tiles);

    this.#canvas.addEventListener('click', (event) => {
      const canvasArea = event.target.getBoundingClientRect();
      const x = event.x - canvasArea.left;
      const y = event.y - canvasArea.top;
      // scrollable?

      const clickedTile = MinefieldHelper.getPointedTile({ x, y }, this.#tiles);
      if (clickedTile) {
        console.log(clickedTile);

        //
        const untouched = TileChecker.untouched(clickedTile);
        if (untouched) {
          // this.revealTile(clickedTile);
          this.flagTile(clickedTile);
        } else {
          this.resetTile(clickedTile);
        }
        // 



      }


    });

  }



  revealTile(tile, playerId = null) {
    const updatedTile = { ...tile };
    updatedTile.state = TileState.Revealed;
    updatedTile.modifiedBy = playerId;
    this.#tiles = this.#tiles.filter(existingTile => existingTile.position !== tile.position);
    this.#revealedTiles.push(updatedTile);

    console.log("revealTile");
    console.log(this.#tiles);
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
    console.log(this.#tiles);
    console.log(updatedTile);
    this.#MinefieldUI.drawFlag(updatedTile, colorKey, flagType);
  }

  markTile(tile, playerId = null, colorKey = '1') {
    const updatedTile = { ...tile };
    updatedTile.state = TileState.Marked;
    updatedTile.modifiedBy = playerId;

    this.#updateTiles(updatedTile);

    console.log("markTile");
    console.log(this.#tiles);
    console.log(updatedTile);
    this.#MinefieldUI.drawMark(updatedTile, colorKey);

  }


  resetTile(tile) {
    const updatedTile = { ...tile };
    updatedTile.state = TileState.Untouched;
    updatedTile.modifiedBy = null;

    this.#updateTiles(updatedTile);

    console.log("resetTile");
    console.log(this.#tiles);
    console.log(updatedTile);
    this.#MinefieldUI.drawUntouchedTile(updatedTile);

  }

  disconnectedCallback() {
    console.log('disconnectedCallback Minefield');
  }

  #updateTiles(updatedTile) {
    this.#tiles = this.#tiles.filter(existingTile => existingTile.position !== updatedTile.position);
    this.#tiles.push({ ...updatedTile });
  }

  #generateGridTiles() {
    return MinefieldHelper.generateGridTiles(this.#gridSize, this.#minesPositions);
  }

}

customElements.define('app-minefield', Minefield);