'use strict';
import './cleared-tiles.scss';
import { NumberValidation } from 'UTILS';
import { ElementHandler } from 'UI_ELEMENTS';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './cleared-tiles.constants';

export default class ClearedTiles extends HTMLElement {
  #indicator;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get value() {
    const value = this.getAttribute(ATTRIBUTES.value);
    return NumberValidation.numberFromString(value);
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
    this.#indicator = this.querySelector(`.${DOM_ELEMENT_CLASS.indicatorNumber}`);

    console.log(this.#indicator);
    // this.#setIndicator();
    // this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#setIndicator.bind(this));
  }

  // #setIndicator() {
  //   if (!this.#indicator) return;
  //   const infinite = !NumberValidation.numberDefined(this.value);
  //   infinite ? this.#setInfinite() : this.#setNumber();
  // }

  // #setInfinite() {
  //   this.#indicator.innerHTML = TEMPLATES.infinite;
  //   this.#setIndicatorStyles();
  // }

  // #setNumber() {
  //   const value = NumberValidation.numberFromString(this.value);
  //   this.#indicator.innerHTML = value;

  //   const styles = [DOM_ELEMENT_CLASS.flagsNumber];
  //   if (NumberValidation.numberFromString(value) < 2) {
  //     styles.push(`${DOM_ELEMENT_CLASS.flagsNumber}--${value}`)
  //   }
  //   this.#setIndicatorStyles(styles);
  // }

  // #setIndicatorStyles(styles = [DOM_ELEMENT_CLASS.flagsNumber]) {
  //   ElementHandler.setStyleClass(this.#indicator, styles);
  // }

}

customElements.define('app-cleared-tiles', ClearedTiles);