'use strict';
import './player-stats-indicator.scss';
import { NumberValidation } from 'UTILS';
import { ElementHandler } from 'UI_ELEMENTS';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './player-stats-indicator.constants';

export default class PlayerStatsIndicator extends HTMLElement {
  #attributeUpdateHandler;
  #indicator;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get value() {
    return this.getAttribute(ATTRIBUTES.value);
  }

  get indicator() {
    return this.#indicator;
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
    ElementHandler.addStyleClass(this, DOM_ELEMENT_CLASS.container);
    this.#indicator = this.querySelector(`.${DOM_ELEMENT_CLASS.indicatorNumber}`);
    this.#setIndicator();
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#setIndicator.bind(this));
  }

  #setIndicator() {
    if (!this.#indicator) return;
    this.setIndicatorValue();
  }

  setIndicatorValue() {
    this.#indicator.innerHTML = NumberValidation.numberFromString(this.value);
  }
  
  setIndicatorStyles(styles = [DOM_ELEMENT_CLASS.indicatorNumber]) {
    ElementHandler.setStyleClass(this.indicator, styles);
  }
}

customElements.define('app-player-stats-indicator', PlayerStatsIndicator);