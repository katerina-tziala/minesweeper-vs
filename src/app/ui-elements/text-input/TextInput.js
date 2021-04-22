import './text-input.scss';
import { ElementHandler } from '../../element-handler';
import { DOM_ELEMENT_CLASS, TEMPLATE } from './text-input.constants';

class TextInput extends HTMLElement {
  #label;
  #input;
  #error;
  #attributeUpdateHandler;
  #labelListener;
  #inputListeners;

  constructor() {
    super();
    this.value = undefined;
    this.name = undefined;
    this.#attributeUpdateHandler = new Map();
    this.#inputListeners = new Map();
    this.#attributeUpdateHandler.set('name', this.#onNameChange.bind(this));
    this.#attributeUpdateHandler.set('value', this.#onValueChange.bind(this));
    this.#attributeUpdateHandler.set('error', this.#onError.bind(this));
  }

  static get observedAttributes() {
    return ['name', 'value', 'error'];
  }

  set #value(value) {
    return this.value = value && value.length ? value : undefined;
  }

  #setInputListeners() {
    if (this.#input) {
      this.#inputListeners.set('focus', this.#focus.bind(this));
      this.#inputListeners.set('focusout', this.#focusout.bind(this));
      this.#inputListeners.set('keyup', this.#onKeyUp.bind(this));

      Array.from(this.#inputListeners.keys()).forEach(listenerName => {
        this.#input.addEventListener(listenerName, this.#inputListeners.get(listenerName));
      });
    }
  }

  #removeInputListeners() {
    if (this.#input) {
      Array.from(this.#inputListeners.keys()).forEach(listenerName => {
        this.#input.removeEventListener(listenerName, this.#inputListeners.get(listenerName));
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
    //this.#removeElementError();

    this.value ? this.#focus() : this.#focusout();
    this.#setInputListeners();
  }

  disconnectedCallback() {
    console.log('disconnectedCallback');
    this.#removeLabelListener();
    this.#removeInputListeners();
  }

  #onNameChange(name) {
    this.name = name;
    this.#setElementName();
  }

  #onError(value) {
    this.error = JSON.parse(value);
    console.log("onError");
    console.log(this.error);
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
      this.#input.value = this.value ? this.value : '';
    }
  }

  #onLabelClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#input.focus();
  }

  #onKeyUp(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#value = this.#input.value;
  }

  #focus() {
    this.#removeLabelListener();
    this.setAttribute('focused', true);
    this.#clearLabelShake();
  }

  #focusout() {
    if (!this.value) {
      this.#addLabelListener();
      this.setAttribute('focused', false);
    } else {
      this.#shakeLabel();
    }
  }

  #shakeLabel() {
    const error = JSON.parse(this.getAttribute('error'));
    if (error) {
      ElementHandler.addStyleClass(this.#label, DOM_ELEMENT_CLASS.labelShake)
    }
  }

  #clearLabelShake() {
    ElementHandler.removeStyleClass(this.#label, DOM_ELEMENT_CLASS.labelShake);
  }

  #addLabelListener() {
    this.#labelListener = this.#onLabelClick.bind(this);
    this.#label.addEventListener('click', this.#labelListener);
  }

  #removeLabelListener() {
    this.#label.removeEventListener('click', this.#labelListener);
  }

  #setElementError() {
    this.setAttribute('error', true);
  }

  #removeElementError() {
    this.setAttribute('error', false);
  }
}

customElements.define('app-text-input', TextInput);