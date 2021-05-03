import './text-input.scss';
import { ElementHandler } from '../../element-handler';
import { AriaHandler } from '../../aria-handler';
import { DOM_ELEMENT_CLASS, TEMPLATE, ATTRIBUTES, KEY_BLACKLIST } from './text-input.constants';

export default class TextInput extends HTMLElement {
  #input;
  #label;
  #inputField;
  #inputError;
  #attributeUpdateHandler;
  #clickListener;
  #inputListeners;
  #value;
  #errorMessage;

  constructor() {
    super();
    this.#value = undefined;
    this.name = undefined;
    this.#attributeUpdateHandler = new Map();
    this.#inputListeners = new Map();
    this.#attributeUpdateHandler.set(ATTRIBUTES.name, this.#onNameChanged.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#onValueChanged.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.errorMessage, this.#onErrorMessageChange.bind(this));
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  get value() {
    if (this.#inputField) {
      const inputValue = this.#inputField.value.trim();
      return inputValue.length > 0 ? inputValue : undefined;
    }
    return undefined;
  }

  get #inputListenersTypes() {
    if (!this.#inputListeners) {
      return [];
    }
    return Array.from(this.#inputListeners.keys());
  }

  #addClickListener() {
    this.#removeClickListener();
    if (this.#input) {
      this.#clickListener = this.#onClick.bind(this);
      this.#input.addEventListener('click', this.#clickListener);
    }
  }

  #removeClickListener() {
    if (this.#clickListener && this.#input) {
      this.#input.removeEventListener('click', this.#clickListener);
    };
    this.#clickListener = undefined;
  }

  #setInputListeners() {
    if (this.#inputField) {
      this.#inputListeners.set('focus', this.#focus.bind(this));
      this.#inputListeners.set('focusout', this.#focusout.bind(this));
      this.#inputListeners.set('keyup', this.#onKeyUp.bind(this));
      this.#inputListenersTypes.forEach(listenerName => {
        this.#inputField.addEventListener(listenerName, this.#inputListeners.get(listenerName));
      });
    }
  }

  #removeInputListeners() {
    if (this.#inputField) {
      this.#inputListenersTypes.forEach(listenerName => {
        this.#inputField.removeEventListener(listenerName, this.#inputListeners.get(listenerName));
        this.#inputListeners.delete(listenerName);
      });
    }
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName)) {
      this.#attributeUpdateHandler.get(attrName)(newVal, oldVal);
    }
  }

  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.#input = this.querySelector(`.${DOM_ELEMENT_CLASS.input}`);
    this.#label = this.querySelector(`.${DOM_ELEMENT_CLASS.label}`);
    this.#inputField = this.querySelector(`.${DOM_ELEMENT_CLASS.inputField}`);
    this.#setInputListeners();
    this.#inputError = this.querySelector(`.${DOM_ELEMENT_CLASS.inputError}`);
    this.#setElementName();
    this.#setElementValue();
    this.#value ? this.#focus() : this.#focusout();
    this.#handleErrorDisplay();
  }

  disconnectedCallback() {
    this.#removeClickListener();
    this.#removeInputListeners();
  }

  #onNameChanged(name) {
    this.name = name;
    this.#setElementName();
  }

  #setElementName() {
    if (this.#inputField && this.#label && this.name) {
      this.#label.innerHTML = this.name;
      this.#inputField.name = this.name;
      AriaHandler.setAriaLabel(this.#inputField, `enter ${this.name}`);
    }
  }

  #onValueChanged(value) {
    this.#value = value;
    this.#setElementValue();
    this.#value ? this.#focus() : this.#focusout();
  }

  #onKeyUp(event) {
    if (KEY_BLACKLIST.indexOf(event.key) === -1) {
      this.#submitValueChange();
    }
  }

  #submitValueChange() {
    const event = new CustomEvent('onValueChange', { detail: { value: this.value } });
    this.dispatchEvent(event);
  }

  #setElementValue(value = this.#value) {
    if (this.#inputField) {
      this.#inputField.value = value ? value : '';
    }
  }

  #onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#inputField.focus();
  }

  #focus() {
    this.#removeClickListener();
    this.setAttribute('focused', true);
    this.#clearLabelShake();
  }

  #focusout() {
    this.#addClickListener();
    if (!this.value) {
      this.setAttribute('focused', false);
      this.#setElementValue('');
    } else {
      this.#shakeLabel();
    }
  }

  #shakeLabel() {
    const error = JSON.parse(this.getAttribute('error'));
    if (error) {
      ElementHandler.addStyleClass(this.#label, DOM_ELEMENT_CLASS.labelShake);
    }
  }

  #clearLabelShake() {
    ElementHandler.removeStyleClass(this.#label, DOM_ELEMENT_CLASS.labelShake);
  }

  #onErrorMessageChange(message) {
    this.#errorMessage = message && message.length > 0 ? message : undefined;
    this.#handleErrorDisplay();
  }

  #handleErrorDisplay() {
    this.#errorMessage ? this.#showErrorMessage() : this.#removeErrorMessage();
  }

  #showErrorMessage() {
    this.setAttribute('error', true);
    if (this.#inputError) {
      this.#inputError.innerHTML = this.#errorMessage;
      AriaHandler.setAlertRole(this.#inputError);
      ElementHandler.display(this.#inputError);
    }
  }

  #removeErrorMessage() {
    this.setAttribute('error', false);
    if (this.#inputError) {
      this.#inputError.innerHTML = '';
      ElementHandler.hide(this.#inputError);
      AriaHandler.removeRole(this.#inputError);
    }
  }

}

customElements.define('app-text-input', TextInput);