import './switcher.scss';
import { parseBoolean } from 'UTILS';
import { ElementHandler, AriaHandler } from 'UI_ELEMENTS';
import { ATTRIBUTES, DOM_ELEMENT_CLASS, TEMPLATE } from './switcher.constants';

export default class Switcher extends HTMLElement {
  #attributeUpdateHandler;
  #button;
  #buttonListeners;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
    this.#buttonListeners = new Map();
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
    this.#initUpdatesHandling();
    this.#addListeners();
  }

  disconnectedCallback() {
    if (this.#buttonListeners.size && this.#button) {
      for (const [actionType, action] of this.#buttonListeners) {
        this.#button.removeEventListener(actionType, action);
        this.#buttonListeners.delete(actionType);
      }
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

  #addListeners() {
    if (!this.#buttonListeners.size && this.#button) {
      this.#buttonListeners.set('click', this.#toggleValue.bind(this));
      this.#buttonListeners.set('keydown', this.#onKeyDown.bind(this));
      for (const [actionType, action] of this.#buttonListeners) {
        this.#button.addEventListener(actionType, action);
      }
    }
  }

  #onKeyDown(event) {
    const actionKey = event.key;
    const actions = ['ArrowRight', 'ArrowLeft'];
    if (!actions.includes(actionKey)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const checked = actionKey === 'ArrowRight';
    if (this.checked !== checked) {
      this.#button.blur();
      this.setAttribute('checked', checked);
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