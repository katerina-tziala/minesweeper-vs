import './number-input.scss';
import './number-input-button/NumberInputButton';
import { ElementHandler } from '../../element-handler';
import { TEMPLATE, ATTRIBUTES, DOM_ELEMENT_CLASS } from './number-input.constants';
import NumberValidation from './number-validation';
import { parseBoolean } from 'UTILS';

export default class NumberInput extends HTMLElement {
  #inputListener;
  #attributeUpdateHandler;
  #buttonsListeners;

  constructor() {
    super();
    this.#buttonsListeners = new Map();
    this.#attributeUpdateHandler = new Map();
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return parseBoolean(disabled);
  }

  get #name() {
    return this.getAttribute(ATTRIBUTES.name);
  }

  get #minValue() {
    return NumberValidation.boundaryValue(this.getAttribute(ATTRIBUTES.min));
  }

  get #maxValue() {
    return NumberValidation.boundaryValue(this.getAttribute(ATTRIBUTES.max));
  }

  get #input() {
    return this.querySelector(`.${DOM_ELEMENT_CLASS.input}`);
  }

  get #minusButton() {
    return this.querySelector(`.${DOM_ELEMENT_CLASS.minus}`);
  }

  get #plusButton() {
    return this.querySelector(`.${DOM_ELEMENT_CLASS.plus}`);
  }

  get value() {
    return NumberValidation.numberFromString(this.getAttribute(ATTRIBUTES.value));
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
    this.#setName();
    this.setAttribute('disabled', this.#disabled);
    const startValue = NumberValidation.getValueInBoundaries(this.value, this.#minValue, this.#maxValue);
    this.setAttribute('value', startValue);
    this.#setInputValue();
    this.#setState();

    this.#setInputListener();
    this.#setButtonListener(DOM_ELEMENT_CLASS.minus, this.#decreaseValue.bind(this));
    this.#setButtonListener(DOM_ELEMENT_CLASS.plus, this.#increaseValue.bind(this));

    this.#initUpdatesHandling();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.name, this.#setName.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#onValueAttributeChange.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.min, this.#onBoundaryChange.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.max, this.#onBoundaryChange.bind(this));
  }

  disconnectedCallback() {
    this.#removeInputListener();
    this.#removeButtonListeners();
  }

  #onValueAttributeChange() {
    const validValue = NumberValidation.getValueInBoundaries(this.value, this.#minValue, this.#maxValue);
    if (this.value !== validValue) {
      this.setAttribute('value', validValue.toString());
    } else {
      this.#setInputValue();
      this.#checkButtons();
    }
  }

  #setInputValue() {
    ElementHandler.setElementValue(this.#input, this.value);
  }

  #setName() {
    ElementHandler.setElementId(this.#input, this.#name);
    ElementHandler.setName(this.#input, this.#name);
  }

  #setState() {
    ElementHandler.setDisabled(this.#input, this.#disabled);
    this.#disabled ? this.#disableButtons() : this.#checkButtons();
  }

  #disableButtons() {
    this.#setButtonDisabledProperty(this.#minusButton, true);
    this.#setButtonDisabledProperty(this.#plusButton, true);
  }

  #setInputListener() {
    const input = this.#input;
    if (input && !this.#inputListener) {
      this.#inputListener = this.#onKeyDown.bind(this);
      input.addEventListener('keyup', this.#inputListener);
    }
  }

  #removeInputListener() {
    const input = this.#input;
    if (input && this.#inputListener) {
      input.removeEventListener('keydown', this.#inputListener);
      this.#inputListener = undefined;
    }
  }

  #setButtonListener(className, action) {
    const button = this.querySelector(`.${className}`);
    if (button && !this.#buttonsListeners.has(className)) {
      this.#buttonsListeners.set(className, action);
      button.addEventListener('onClick', this.#buttonsListeners.get(className));
    }
  }

  #removeButtonListeners() {
    for (const [key, action] of this.#buttonsListeners) {
      const button = this.querySelector(`.${key}`);
      if (button) {
        button.removeEventListener('onClick', this.#buttonsListeners.get(key));
      }
      this.#buttonsListeners.delete(key);
    }
    this.#buttonsListeners = new Map();
  }

  #onKeyDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      event.key === 'ArrowUp' ? this.#increaseValue() : this.#decreaseValue();
    }
    this.#updateValue(NumberValidation.numberFromString(event.target.value));
  }

  #increaseValue() {
    this.#updateValue(this.value + 1);
  }

  #decreaseValue() {
    this.#updateValue(this.value - 1);
  }

  #onBoundaryChange() {
    this.#updateValue(this.value);
  }

  #updateValue(value) {
    const newValue = NumberValidation.getValueInBoundaries(value, this.#minValue, this.#maxValue);
    if (this.value !== newValue) {
      this.setAttribute('value', newValue.toString());
      this.#submitValueChange();
    } else {
      this.#setInputValue();
    }
  }

  #checkButtons() {
    const equalToMin = NumberValidation.equalToBoundary(this.value, this.#minValue);
    this.#setButtonDisabledProperty(this.#minusButton, equalToMin);

    const equalToMax = NumberValidation.equalToBoundary(this.value, this.#maxValue);
    this.#setButtonDisabledProperty(this.#plusButton, equalToMax);
  }

  #setButtonDisabledProperty(button, disabled) {
    if (button) {
      button.setAttribute('disabled', disabled);
    }
  }

  #submitValueChange() {
    const value = this.value;
    const name = this.#name;
    const event = new CustomEvent('onValueChange', { detail: { name, value } });
    this.dispatchEvent(event);
  }
}

customElements.define('app-number-input', NumberInput);