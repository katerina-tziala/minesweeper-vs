import { AriaHandler } from '../../../aria-handler';
import { ATTRIBUTES } from './number-input-button.constants';

export default class NumberInputButton extends HTMLElement {
  #eventListeners;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#eventListeners = new Map();
    this.#attributeUpdateHandler = new Map();
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return disabled && disabled.length ? JSON.parse(disabled) : false;
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
    AriaHandler.setRole(this, 'button');
    this.setAttribute('type', 'button');
    this.setAttribute(ATTRIBUTES.disabled, this.#disabled);
    this.#setState();
    this.#addListener('keydown', this.#onKeyDown.bind(this));
    this.#addListener('click', this.#submitAction.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
  }

  disconnectedCallback() {
    this.#removeListeners();
  }

  #setState() {
    AriaHandler.setAriaDisabled(this, this.#disabled);
  }

  #addListener(actionType, action) {
    if (!this.#eventListeners.has(actionType)) {
      this.#eventListeners.set(actionType, action);
      this.addEventListener(actionType, this.#eventListeners.get(actionType));
    }
  }

  #removeListeners() {
    for (const [actionType, action] of this.#eventListeners) {
      this.removeEventListener(actionType, action);
      this.#eventListeners.delete(actionType);
    }
  }

  #onKeyDown(event) {
    if (event.code === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.#submitAction();
    }
  }

  #submitAction() {
    this.blur();
    const event = new CustomEvent('onClick');
    this.dispatchEvent(event);
  }

}

customElements.define('app-number-input-button', NumberInputButton);