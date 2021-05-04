import './number-input.scss';
import { ElementHandler } from '../../element-handler';
import { AriaHandler } from '../../aria-handler';
import { TEMPLATE, ATTRIBUTES, DOM_ELEMENT_CLASS } from './number-input.constants';
import { valueDefined } from 'UTILS';

export default class NumberInput extends HTMLElement {
  #inputListener;
  #attributeUpdateHandler;

  constructor() {
    super();

    this.#attributeUpdateHandler = new Map();
  }

  #getBooleanValue(valueToParse) {
    return valueToParse && valueToParse.length ? JSON.parse(valueToParse) : false;
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return this.#getBooleanValue(disabled);
  }

  get #name() {
    return this.getAttribute(ATTRIBUTES.name);
  }

  get #value() {
    return this.getAttribute(ATTRIBUTES.value);
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
    const stringValue = this.#value;
    const value = stringValue && stringValue.length ? parseInt(stringValue, 10) : 0;
    return valueDefined(value) ? value : 0;
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
    //   this.#attributeUpdateHandler.get(attrName)();
    // }
  }

  connectedCallback() {
    console.log('NumberInput');
    this.innerHTML = TEMPLATE;
    this.#setInputValue();
    this.#setName();
    this.#setState();

    // this.#initUpdatesHandling();
  }

  disconnectedCallback() {
    //this.#removeEventListeners();
  }

  #setInputValue() {
    const input = this.#input;
    if (input) {
      input.value = this.value;
    }
  }

  #setName() {
    ElementHandler.setElementId(this.#input, this.#name);
    ElementHandler.setName(this.#input, this.#name);
  }

  #setState() {
    this.#disabled ? this.#disable() : this.#enable();
  }

  #enable() {
    console.log('enable');
    this.#setInputListener();


    // ElementHandler.setDisabled(this.#switchButton, false);
    // if (this.#switchButton && !this.#eventListeners.size) {
    //   this.#eventListeners.set('keydown', this.#onKeyDown.bind(this));
    //   this.#eventListeners.set('click', this.#toggleState.bind(this));
    //   for (const [actionType, action] of this.#eventListeners) {
    //     this.#switchButton.addEventListener(actionType, action);
    //   }
    // }
  }


  #setInputListener() {
    const input = this.#input;
    if (input && !this.#inputListener) {
      this.#inputListener = this.#onKeyDown.bind(this);
      input.addEventListener('keydown', this.#inputListener);
    }
  }


  #onKeyDown(event) {
    //console.log(event);
    event.preventDefault();
    event.stopPropagation();

    console.log(event.key);
    // if (condition) {
      
    // }
    // ElementHandler.setDisabled(this.#switchButton);
    // this.#removeEventListeners();
  }



  #disable() {
    console.log('disable');
    // ElementHandler.setDisabled(this.#switchButton);
    // this.#removeEventListeners();
  }

}

customElements.define('app-number-input', NumberInput);