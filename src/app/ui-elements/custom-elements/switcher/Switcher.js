import './switcher.scss';
import { ElementHandler } from '../../element-handler';
import { AriaHandler } from '../../aria-handler';
import { ATTRIBUTES } from './switcher.constants';

export default class Switcher extends HTMLElement {
  #eventListeners;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#eventListeners = new Map();
    this.#attributeUpdateHandler = new Map();
  }

  #getBooleanValue(valueToParse) {
    return valueToParse && valueToParse.length ? JSON.parse(valueToParse) : false;
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return this.#getBooleanValue(disabled);
  }

  get #checked() {
    const checked = this.getAttribute(ATTRIBUTES.checked);
    return this.#getBooleanValue(checked);
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
    AriaHandler.setTabindex(this, 0);
    this.setAttribute('type', 'button');
    AriaHandler.setRole(this, 'switch');
    this.#setName();
    this.#setValue();
    this.#setState();
    this.#addListeners();
    this.#initUpdatesHandling();
  }

  disconnectedCallback() {
    if (this.#eventListeners.size) {
      for (const [actionType, action] of this.#eventListeners) {
        this.removeEventListener(actionType, action);
        this.#eventListeners.delete(actionType);
      }
    }
    this.#eventListeners = undefined;
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.checked, this.#setValue.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.name, this.#setName.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
  }

  #setState() {
    const tabindex = this.#disabled ? -1 : 1;
    AriaHandler.setTabindex(this, tabindex);
    AriaHandler.setAriaDisabled(this, this.#disabled);
  }

  #addListeners() {
    this.#eventListeners.set('keydown', this.#onKeyDown.bind(this));
    this.#eventListeners.set('click', this.#toggleValue.bind(this));
    for (const [actionType, action] of this.#eventListeners) {
      this.addEventListener(actionType, action);
    }
  }

  #onKeyDown(event) {
    if (event.code === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.#toggleValue();
    }
  }

  #toggleValue() {
    if (!this.#disabled) {
      this.blur();
      this.setAttribute(ATTRIBUTES.checked, !this.#checked);
      this.#submitValueChange();
    }
  }

  #setValue() {
    AriaHandler.setAriaChecked(this, this.#checked);
  }

  #setName() {
    ElementHandler.setElementId(this, this.#name);
    ElementHandler.setName(this, this.#name);
  }

  #submitValueChange() {
    const value = this.#checked;
    const name = this.#name;
    const event = new CustomEvent('onValueChange', { detail: { name, value } });
    this.dispatchEvent(event);
  }
}

customElements.define('app-switcher', Switcher);