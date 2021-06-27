import { parseBoolean, replaceStringParameter } from 'UTILS';
import { ElementHandler, AriaHandler } from 'UI_ELEMENTS';
import { ATTRIBUTES, DOM_ELEMENT_CLASS, TEMPLATE, ARIA_LABEL_TYPE, ARIA_LABEL_NAME } from './number-input-button.constants';

export default class NumberInputButton extends HTMLElement {
  #attributeUpdateHandler;
  #button;
  #clickListener;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get #name() {
    return this.getAttribute(ATTRIBUTES.name);
  }

  get #disabled() {
    return parseBoolean(this.getAttribute(ATTRIBUTES.disabled));
  }

  get #type() {
    return this.getAttribute('type');
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
    const type = this.#type;
    if (type && this.#name) {
      this.innerHTML = TEMPLATE;
      this.#button = this.querySelector(`.${DOM_ELEMENT_CLASS.button}`);
      this.#setAriaLabel();
      this.#setState();
      this.#addListener();
      this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
    } else {
      throw new Error('type required for app-number-input-button');
    }
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
    if (this.#disabled) {
      this.#button.blur();
    }
  }

  #setAriaLabel() {
    const labelType = ARIA_LABEL_TYPE[this.#type];
    const labelName = ARIA_LABEL_NAME[this.#name];
    if (labelType && labelName) {
      const label = replaceStringParameter(labelType, labelName);
      AriaHandler.setAriaLabel(this.#button, label);
    }
  }

  #addListener() {
    if (!this.#clickListener) {
      this.#clickListener = this.#submitAction.bind(this);
      this.#button.addEventListener('click', this.#clickListener);
    }
  }

  #submitAction() {
    this.#button.blur();
    const event = new CustomEvent('onClick');
    this.dispatchEvent(event);
  }

}

customElements.define('app-number-input-button', NumberInputButton);