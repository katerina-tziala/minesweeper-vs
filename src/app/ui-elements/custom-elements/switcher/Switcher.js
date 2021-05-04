import './switcher.scss';
import { ElementHandler } from '../../element-handler';
import { AriaHandler } from '../../aria-handler';
import { TEMPLATE, ATTRIBUTES, DOM_ELEMENT_CLASS } from './switcher.constants';

export default class Switcher extends HTMLElement {
  #switchButton;
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

  get #ariaLabel() {
    return this.getAttribute(ATTRIBUTES.ariaLabel);
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
    this.#switchButton = this.querySelector(`.${DOM_ELEMENT_CLASS.switcher}`)
    this.#setDisabledState();
    this.#setState();
    this.#setAriaLabel();
    this.#setName();
    this.#initUpdatesHandling();
  }

  disconnectedCallback() {
    this.#removeEventListeners();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.checked, this.#setState.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setDisabledState.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.ariaLabel, this.#setAriaLabel.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.name, this.#setName.bind(this));
  }


  #setDisabledState() {
    this.#disabled ? this.#disable() : this.#enable();
  }

  #enable() {
    ElementHandler.setDisabled(this.#switchButton, false);
    if (this.#switchButton && !this.#eventListeners.size) {
      this.#eventListeners.set('keydown', this.#onKeyDown.bind(this));
      this.#eventListeners.set('click', this.#toggleState.bind(this));
      for (const [actionType, action] of this.#eventListeners) {
        this.#switchButton.addEventListener(actionType, action);
      }
    }
  }

  #disable() {
    ElementHandler.setDisabled(this.#switchButton);
    this.#removeEventListeners();
  }

  #removeEventListeners() {
    if (this.#switchButton && this.#eventListeners.size) {
      for (const [actionType, action] of this.#eventListeners) {
        this.#switchButton.removeEventListener(actionType, action);
        this.#eventListeners.delete(actionType);
      }
    }
    this.#eventListeners = undefined;
  }

  #onKeyDown(event) {
    if (event.code === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.#toggleState();
    }
  }

  #toggleState() {
    this.setAttribute(ATTRIBUTES.checked, !this.#checked);
    const value = this.#checked;
    const name = this.#name;
    const event = new CustomEvent('onValueChange', { detail: { name, value} });
    this.dispatchEvent(event);
  }

  #setState() {
    AriaHandler.setAriaChecked(this.#switchButton, this.#checked);
  }

  #setAriaLabel() {
    AriaHandler.setAriaLabel(this.#switchButton, this.#ariaLabel);
  }

  #setName() {
    ElementHandler.setElementId(this.#switchButton, this.#name);
    ElementHandler.setName(this.#switchButton, this.#name);
  }

}

customElements.define('app-switcher', Switcher);