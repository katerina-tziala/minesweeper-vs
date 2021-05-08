import './switcher.scss';
import { parseBoolean } from 'UTILS';
import { ElementHandler, AriaHandler } from 'UI_ELEMENTS';
import { ATTRIBUTES, DOM_ELEMENT_CLASS, TEMPLATE } from './switcher.constants';

export default class Switcher extends HTMLElement {
  #attributeUpdateHandler;
  #button;
  #clickListener;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return parseBoolean(disabled);
  }

  get #checked() {
    const checked = this.getAttribute(ATTRIBUTES.checked);
    return parseBoolean(checked);
  }

  get #name() {
    return this.getAttribute(ATTRIBUTES.name);
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
    this.#button = this.querySelector(`.${DOM_ELEMENT_CLASS.switcher}`)
    this.#setValue();
    this.#setState();
    this.#addListener();
    this.#initUpdatesHandling();
  }

  disconnectedCallback() {
    if (!this.#clickListener) {
      this.#button.removeEventListener('click', this.#clickListener);
      this.#clickListener = undefined;
    }
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.checked, this.#setValue.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
  }

  #setState() {
    ElementHandler.setDisabled(this.#button, this.#disabled);
    AriaHandler.setAriaDisabled(this.#button, this.#disabled);
  }

  #addListener() {
    if (!this.#clickListener) {
      this.#clickListener = this.#toggleValue.bind(this);
      this.#button.addEventListener('click', this.#clickListener);
    }
  }

  #toggleValue() {
    if (!this.#disabled) {
      this.#button.blur();
      this.setAttribute(ATTRIBUTES.checked, !this.#checked);
      this.#submitValueChange();
    }
  }

  #setValue() {
    AriaHandler.setAriaChecked(this.#button, this.#checked);
  }

  #submitValueChange() {
    const value = this.#checked;
    const name = this.#name;
    const event = new CustomEvent('onValueChange', { detail: { name, value } });
    this.dispatchEvent(event);
  }
}

customElements.define('app-switcher', Switcher);