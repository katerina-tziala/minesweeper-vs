import './text-input.scss';
import { ElementHandler } from '../../element-handler';
import { DOM_ELEMENT_CLASS, TEMPLATE } from './text-input.constants';

class TextInput extends HTMLElement {
  #label;
  #input;
  #attributeUpdateHandler;
  #inputListeners;
  #clickListener;
  #value;

  constructor() {
    super();
    this.#value = undefined;
    this.name = undefined;
    this.#attributeUpdateHandler = new Map();
    this.#inputListeners = new Map();
    this.#attributeUpdateHandler.set('name', this.#onNameChange.bind(this));
    this.#attributeUpdateHandler.set('value', this.#onValueChange.bind(this));
  }

  static get observedAttributes() {
    return ['name', 'value'];
  }
  get value() {
    if (this.#input) {
      const inputValue = this.#input.value.trim();
      return inputValue.length > 0 ? inputValue : undefined;
    }
    return undefined;
  }

  #setInputListeners() {
    if (this.#input) {
      this.#inputListeners.set('focus', this.#focus.bind(this));
      this.#inputListeners.set('focusout', this.#focusout.bind(this));
      Array.from(this.#inputListeners.keys()).forEach(listenerName => {
        this.#input.addEventListener(listenerName, this.#inputListeners.get(listenerName));
      });
    }
  }

  #removeInputListeners() {
    if (this.#input) {
      Array.from(this.#inputListeners.keys()).forEach(listenerName => {
        this.#input.removeEventListener(listenerName, this.#inputListeners.get(listenerName));
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
    this.#label = this.querySelector(`.${DOM_ELEMENT_CLASS.label}`);
    this.#input = this.querySelector(`.${DOM_ELEMENT_CLASS.input}`);
    this.#setElementName();
    this.#setElementValue();
   // this.setAttribute('valid', false);
    this.#value ? this.#focus() : this.#focusout();
    this.#setInputListeners();
  }

  disconnectedCallback() {
    this.#removeClickListener();
    this.#removeInputListeners();
  }

  #onNameChange(name) {
    this.name = name;
    this.#setElementName();
  }

  #setElementName() {
    if (this.#input && this.#label && this.name) {
      this.#label.innerHTML = this.name;
      this.#input.name = this.name;
    }
  }

  #onValueChange(value) {
    this.#value = value;
    this.#setElementValue();
  }

  #setElementValue() {
    if (this.#input) {
      this.#input.value = this.#value ? this.#value : '';
    }
  }

  #focus() {
    this.#removeClickListener();
    this.setAttribute('focused', true);
    this.#clearLabelShake();
  }

  #focusout() {
    if (!this.value) {
      this.#clickListener = this.#onClick.bind(this);
      this.addEventListener('click', this.#clickListener);
      this.setAttribute('focused', false);
      this.#input.value = '';
    } else {
      this.#shakeLabel();
    }
  }

  #onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#input.focus();
  }

  #shakeLabel() {
    const valid = JSON.parse(this.getAttribute('valid'));
    if (!valid) {
      ElementHandler.addStyleClass(this.#label, DOM_ELEMENT_CLASS.labelShake)
    }
  }

  #clearLabelShake() {
    ElementHandler.removeStyleClass(this.#label, DOM_ELEMENT_CLASS.labelShake);
  }

  #removeClickListener() {
    this.removeEventListener('click', this.#clickListener);
  }

}

customElements.define('app-text-input', TextInput);