'use strict';
import './placed-flags.scss';
import { NumberValidation } from 'UTILS';
import { ElementHandler } from 'UI_ELEMENTS';
import { ATTRIBUTES, TEMPLATES, DOM_ELEMENT_CLASS } from './placed-flags.constants';

export default class PlacedFlags extends HTMLElement {
  #indicator;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get value() {
    return this.getAttribute(ATTRIBUTES.value);
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
    this.innerHTML = TEMPLATES.flagsNumber;
    this.#indicator = this.querySelector(`.${DOM_ELEMENT_CLASS.flagsNumber}`);
    this.#setIndicator();
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#setIndicator.bind(this));
  }

  #setIndicator() {
    if (!this.#indicator) return;
    const infinite = !NumberValidation.numberDefined(this.value);
    infinite ? this.#setInfinite() : this.#setNumber();
  }

  #setInfinite() {
    this.#indicator.innerHTML = TEMPLATES.infinite;
    this.#setIndicatorStyles();
  }

  #setNumber() {
    const value = NumberValidation.numberFromString(this.value);
    this.#indicator.innerHTML = value;

    const styles = [DOM_ELEMENT_CLASS.flagsNumber];
    if (NumberValidation.numberFromString(value) < 2) {
      styles.push(`${DOM_ELEMENT_CLASS.flagsNumber}--${value}`)
    }
    this.#setIndicatorStyles(styles);
  }

  #setIndicatorStyles(styles = [DOM_ELEMENT_CLASS.flagsNumber]) {
    ElementHandler.setStyleClass(this.#indicator, styles);
  }

}

customElements.define('app-placed-flags', PlacedFlags);