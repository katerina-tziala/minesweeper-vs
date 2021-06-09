'use strict';
import './minefield.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './minefield.constants';
import { TemplateGenerator } from 'UI_ELEMENTS';
import { NumberValidation } from 'UTILS';
import * as MinefieldUI from './minefield-ui';
import * as TileGenerator from './minefield-tile/tile-utils';
import * as MinefieldHelper from './minefield-helper';
import { TileState } from './minefield-tile/tile-state.enum';

export default class Minefield extends HTMLElement {
  #canvas;
  #minesPositions;
  #tiles;

  constructor() {
    super();

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
    MinefieldUI.setCanvasHeight(this.#canvas, this.rows, this.columns);
  }

  init(minesPositions) {
    this.#minesPositions = minesPositions;
    this.#tiles = this.#generateGridTiles();

    console.log('init Minefield');
    // console.log(this.#minesPositions);
    // console.log(this.#gridSize);
    // console.log(this.#canvas);
    // console.log(this.#tiles);

    this.#canvas.addEventListener('click', (event) => {
      const canvasArea = event.target.getBoundingClientRect();
      const x = event.x - canvasArea.left;
      const y = event.y - canvasArea.top;
      // const coordinates = { x, y };
      // // scrollable?
      // console.log(coordinates);

      const clickedTile = MinefieldHelper.getPointedTile({ x, y }, this.#tiles);
      if (clickedTile) {
        console.log(clickedTile);
        clickedTile.state = TileState.Revealed;
        MinefieldUI.drawRevealedTile(this.#canvas.getContext("2d"), clickedTile);


      }
      

    });

  }



  #generateGridTiles() {
    const ctx = this.#canvas.getContext("2d");
    return MinefieldHelper.generateGridTiles(ctx, this.#gridSize, this.#minesPositions);
  }



  disconnectedCallback() {
    console.log('disconnectedCallback Minefield');
  }

  // adoptedCallback() {
  //   console.log('adoptedCallback Minefield');
  // }






}

customElements.define('app-minefield', Minefield);