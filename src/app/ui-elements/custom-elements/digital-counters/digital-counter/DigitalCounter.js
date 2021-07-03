import '../counter-digit/CounterDigit';
import './digital-counter.scss';
import { ATTRIBUTES } from './digital-counter.constants';
import { numberDefined } from 'UTILS';
import { numberOfDigits, getValueArray } from './value-to-digit-converter';

export default class DigitalCounter extends HTMLElement {
  #digitsHandler;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#digitsHandler = new Map();
    this.#attributeUpdateHandler = new Map();
  }

  get #value() {
    const value = parseInt(this.getAttribute(ATTRIBUTES.value), 10)
    return numberDefined(value) ? value : undefined;
  }

  get #min() {
    return this.#getNumberAttribute(ATTRIBUTES.min);
  }

  get #max() {
    return this.#getNumberAttribute(ATTRIBUTES.max);
  }

  get #numberOfDigits() {
    return numberOfDigits(this.#min, this.#max);
  }

  get #valueInArray() {
    return getValueArray(this.#value, this.#min, this.#max);
  }

  static get observedAttributes() {
    return Object.values([ATTRIBUTES.value]);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    this.#init();
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#onValueChange.bind(this));
  }

  #onValueChange() {
    const valueArray = this.#valueInArray;
    for (const [index, digitElement] of this.#digitsHandler) {
      const digitValue = valueArray[index];
      digitElement.setAttribute('value', digitValue);
    }
  }

  #getNumberAttribute(attribute) {
    return parseInt(this.getAttribute(attribute), 10) || 0;
  }

  #init() {
    const valueArray = this.#valueInArray;
    const numberOfDigits = this.#numberOfDigits;
    for (let index = 0; index < numberOfDigits; index++) {
      const digitValue = valueArray[index];
      const digitElement = document.createElement('app-counter-digit');
      digitElement.setAttribute('value', digitValue);
      this.append(digitElement);
      this.#digitsHandler.set(index, digitElement);
    }
  }

}

customElements.define('app-digital-counter', DigitalCounter);