import { parseBoolean } from 'UTILS';
import { ElementHandler, AriaHandler } from 'UI_ELEMENTS';
import { ATTRIBUTES, DOM_ELEMENT_CLASS, TEMPLATE } from './number-input-button.constants';

export default class NumberInputButton extends HTMLElement {
  #attributeUpdateHandler;
  #button;
  #clickListener;
  // TODO: aria label
  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get #disabled() {
    return parseBoolean(this.getAttribute(ATTRIBUTES.disabled));
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
    this.#button = this.querySelector(`.${DOM_ELEMENT_CLASS.button}`);
    this.#setState();
    this.#addListener();
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
  }

  disconnectedCallback() {
    if (this.#clickListener) {
      this.#button.removeEventListener('click', this.#clickListener);
      this.#clickListener = undefined;
    }
  }

  #setState() {
    ElementHandler.setDisabled(this.#button, this.#disabled);
    AriaHandler.setAriaDisabled(this.#button, this.#disabled);
  }

  #addListener() {
    if (!this.#clickListener) {
      this.#clickListener = this.#submitAction.bind(this);
      this.#button.addEventListener('click', this.#clickListener);
    }
  }

  #submitAction() {
    this.blur();
    const event = new CustomEvent('onClick');
    this.dispatchEvent(event);
  }

}

customElements.define('app-number-input-button', NumberInputButton);