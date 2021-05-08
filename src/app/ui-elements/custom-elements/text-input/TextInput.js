import './text-input.scss';
import { TYPOGRAPHY } from 'UTILS';
import { ElementHandler, AriaHandler } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, TEMPLATE, ATTRIBUTES, KEY_BLACKLIST } from './text-input.constants';

export default class TextInput extends HTMLElement {
  #input;
  #labelElement;
  #inputField;
  #errorElement;
  #attributeUpdateHandler;
  #inputListeners;
  #clickListener;

  constructor() {
    super();
    this.#inputListeners = new Map();
    this.#attributeUpdateHandler = new Map();
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  get #inputListenersTypes() {
    return this.#inputListeners ? Array.from(this.#inputListeners.keys()) : [];
  }

  get #name() {
    return this.getAttribute(ATTRIBUTES.name);
  }

  get #errorMessage() {
    let errorMessage = this.getAttribute(ATTRIBUTES.errorMessage);
    errorMessage = errorMessage && errorMessage.length > 0 ? errorMessage : undefined;
    return errorMessage;
  }

  get #label() {
    const label = this.getAttribute(ATTRIBUTES.label);
    return label && label.length ? label : this.#name;
  }

  get value() {
    const value = this.getAttribute(ATTRIBUTES.value) || TYPOGRAPHY.emptyString;
    return value.trim();
  }

  get hasError() {
    const error = this.getAttribute('error');
    return error && error.length ? JSON.parse(error) : false;
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return disabled && disabled.length ? JSON.parse(disabled) : false;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    const name = this.#name;
    if (name) {
      this.#init();
      this.#setName();
      this.#setInputValue();
      this.#setState();
      this.#setInputListeners();
      this.#handleErrorDisplay();
      this.#initUpdatesHandling();
    } else {
      throw new Error('name required for app-text-input');
    }
  }

  disconnectedCallback() {
    this.#removeClickListener();
    this.#removeInputListeners();
  }

  #init() {
    this.innerHTML = TEMPLATE;
    this.#input = this.querySelector(`.${DOM_ELEMENT_CLASS.input}`);
    this.#labelElement = this.querySelector(`.${DOM_ELEMENT_CLASS.label}`);
    this.#inputField = this.querySelector(`.${DOM_ELEMENT_CLASS.inputField}`);
    this.#errorElement = this.querySelector(`.${DOM_ELEMENT_CLASS.inputError}`);
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#setInputValue.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.errorMessage, this.#handleErrorDisplay.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.label, this.#setLabelText.bind(this));
  }

  #setName() {
    this.#setFieldName();
    this.#setLabelText();
  }

  #setFieldName() {
    if (this.inputField) {
      this.inputField.name = this.#name;
      ElementHandler.setForAttribute(this.#labelElement, this.#label);
    }
  }

  #setLabelText() {
    ElementHandler.setContent(this.#labelElement, this.#label);
  }

  #setInputValue() {
    if (this.#inputField) {
      this.#inputField.value = this.value;
    }
  }

  #setState() {
    ElementHandler.setDisabled(this.#inputField, this.#disabled);
    this.initFocusedState();
  }

  initFocusedState() {
    this.value.length ? this.#onFocused() : this.#onFocusedOut();
  }

  #setInputListeners() {
    if (this.inputField && !this.#inputListeners.size) {
      this.#inputListeners.set('focus', this.#focus.bind(this));
      this.#inputListeners.set('focusout', this.#focusout.bind(this));
      this.#inputListeners.set('keyup', this.#onKeyUp.bind(this));
      this.#inputListenersTypes.forEach(listenerName => {
        inputField.addEventListener(listenerName, this.#inputListeners.get(listenerName));
      });
    }
  }

  #removeInputListeners() {
    if (this.inputField && !!this.#inputListeners.size) {
      this.#inputListenersTypes.forEach(listenerName => {
        inputField.removeEventListener(listenerName, this.#inputListeners.get(listenerName));
      });
      this.#inputListeners = new Map();
    }
  }

  #focus(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#onFocused();
  }

  #focusout(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#onFocusedOut();
  }

  #onKeyUp(event) {
    if (!KEY_BLACKLIST.includes(event.key)) {
      this.setAttribute(ATTRIBUTES.value, event.target.value.trim());
      this.#submitValueChange();
    }
  }

  #onFocused() {
    this.setAttribute('focused', true);
    this.#removeClickListener();
    this.#clearLabelShake();
  }

  #onFocusedOut() {
    if (!this.value.length) {
      this.setAttribute('focused', false);
      this.#setInputValue();
      this.#addClickListener();
    } else {
      this.#shakeLabel();
    }
  }

  #onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.#inputField) {
      this.#inputField.focus();
    }
  }

  #addClickListener() {
    if (this.#input && !this.#clickListener && !this.#disabled) {
      this.#clickListener = this.#onClick.bind(this);
      this.#input.addEventListener('click', this.#clickListener);
    }
  }

  #removeClickListener() {
    if (this.#input && this.#clickListener) {
      this.#input.removeEventListener('click', this.#clickListener);
      this.#clickListener = undefined;
    };
  }

  #shakeLabel() {
    const error = JSON.parse(this.getAttribute('error'));
    if (error) {
      ElementHandler.addStyleClass(this.#labelElement, DOM_ELEMENT_CLASS.labelShake);
    }
  }

  #clearLabelShake() {
    ElementHandler.removeStyleClass(this.#labelElement, DOM_ELEMENT_CLASS.labelShake);
  }

  #handleErrorDisplay() {
    this.#errorMessage ? this.#showErrorMessage() : this.#removeErrorMessage();
  }

  #showErrorMessage() {
    this.setAttribute('error', true);
    AriaHandler.setAriaLabel(this.#errorElement, this.#errorMessage);
  }

  #removeErrorMessage() {
    this.setAttribute('error', false);
    AriaHandler.setAriaLabel(this.#errorElement, '');
  }

  #submitValueChange() {
    let value = this.value;
    value = value.length ? value : undefined;
    const name = this.#name;
    const event = new CustomEvent('onValueChange', { detail: { name, value } });
    this.dispatchEvent(event);
  }
}

customElements.define('app-text-input', TextInput);