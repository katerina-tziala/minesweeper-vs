import './text-input.scss';
import { ElementHandler } from '../../element-handler';
import { DOM_ELEMENT_CLASS, TEMPLATE, ATTRIBUTES, KEY_BLACKLIST } from './text-input.constants';
import { TextInputTemplateHelper as TemplateHelper } from './TextInputTemplateHelper';

export default class TextInput extends HTMLElement {
  #inputListeners;
  #clickListener;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#inputListeners = new Map();
    this.#attributeUpdateHandler = new Map();
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  get #inputListenersTypes() {
    if (!this.#inputListeners) {
      return [];
    }
    return Array.from(this.#inputListeners.keys());
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
    return  label && label.length ? label : this.#name;
  }

  get value() {
    return this.getAttribute(ATTRIBUTES.value).trim();
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
    this.innerHTML = TEMPLATE;
    this.#setName();
    this.#setInputValue();
    this.#setState();
    this.initFocusedState();
    this.#handleErrorDisplay();
    this.#initUpdatesHandling();
  }

  disconnectedCallback() {
    this.#removeClickListener();
    this.#removeInputListeners();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.name, this.#setName.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#setInputValue.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.errorMessage, this.#handleErrorDisplay.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.label, this.#setLabelText.bind(this));
  }

  #updateElement(className, callBack) {
    const element = this.querySelector(`.${className}`);
    if (element) {
      callBack(element);
    }
  }

  #setName() {
    this.#setFieldName();
    this.#setLabelText();
  }

  #setFieldName() {
    this.#updateElement(DOM_ELEMENT_CLASS.inputField, (inputField) => {
      TemplateHelper.setFieldName(inputField, this.#name);
      this.#pairLabelToField();
    });
  }

  #pairLabelToField() {
    this.#updateElement(DOM_ELEMENT_CLASS.label, (label) => TemplateHelper.setLabelForAttribute(label, this.#name));
  }

  #setLabelText() {
    this.#updateElement(DOM_ELEMENT_CLASS.label, (label) => TemplateHelper.setLabelText(label, this.#label));
  }

  #setInputValue() {
    this.#updateElement(DOM_ELEMENT_CLASS.inputField, (inputField) => inputField.value = this.value);
  }

  #setState() {
    this.#disabled ? this.#removeInputListeners() : this.#setInputListeners();
    this.#updateElement(DOM_ELEMENT_CLASS.inputField, (inputField) => {
      ElementHandler.setDisabled(inputField, this.#disabled);
    });
    this.initFocusedState();
  }

  initFocusedState() {
    this.value.length ? this.#onFocused() : this.#onFocusedOut();
  }

  #setInputListeners() {
    this.#updateElement(DOM_ELEMENT_CLASS.inputField, (inputField) => {
      this.#inputListeners.set('focus', this.#focus.bind(this));
      this.#inputListeners.set('focusout', this.#focusout.bind(this));
      this.#inputListeners.set('keyup', this.#onKeyUp.bind(this));
      this.#inputListenersTypes.forEach(listenerName => {
        inputField.addEventListener(listenerName, this.#inputListeners.get(listenerName));
      });
    });
  }

  #removeInputListeners() {
    this.#updateElement(DOM_ELEMENT_CLASS.inputField, (inputField) => {
      this.#inputListenersTypes.forEach(listenerName => {
        inputField.removeEventListener(listenerName, this.#inputListeners.get(listenerName));
      });
    });
    this.#inputListeners = new Map();
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

  #submitValueChange() {
    let value = this.value;
    value = value.length ? value : undefined;
    const event = new CustomEvent('onValueChange', { detail: { value } });
    this.dispatchEvent(event);
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
    this.#updateElement(DOM_ELEMENT_CLASS.inputField, (inputField) => inputField.focus());
  }

  #addClickListener() {
    if (!this.#clickListener && !this.#disabled) {
      this.#updateElement(DOM_ELEMENT_CLASS.input, (input) => {
        this.#clickListener = this.#onClick.bind(this);
        input.addEventListener('click', this.#clickListener);
      });
    }
  }

  #removeClickListener() {
    if (this.#clickListener) {
      this.#updateElement(DOM_ELEMENT_CLASS.input, (input) => {
        input.removeEventListener('click', this.#clickListener);
      });
      this.#clickListener = undefined;
    };
  }

  #shakeLabel() {
    const error = JSON.parse(this.getAttribute('error'));
    if (error) {
      this.#updateElement(DOM_ELEMENT_CLASS.label, TemplateHelper.shakeLabel);
    }
  }

  #clearLabelShake() {
    this.#updateElement(DOM_ELEMENT_CLASS.label, TemplateHelper.clearLabelShake);
  }

  #handleErrorDisplay() {
    this.#errorMessage ? this.#showErrorMessage() : this.#removeErrorMessage();
  }

  #showErrorMessage() {
    this.setAttribute('error', true);
    this.#updateElement(DOM_ELEMENT_CLASS.inputError, (inputError) => TemplateHelper.setErrorMessage(inputError, this.#errorMessage));
  }

  #removeErrorMessage() {
    this.setAttribute('error', false);
    this.#updateElement(DOM_ELEMENT_CLASS.inputError, TemplateHelper.clearErrorMessage);
  }
}

customElements.define('app-text-input', TextInput);