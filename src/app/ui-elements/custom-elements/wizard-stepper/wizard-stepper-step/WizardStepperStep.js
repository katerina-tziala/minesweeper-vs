import './wizard-stepper-step.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS, TEXT } from './wizard-stepper-step.constants';
import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
import { parseBoolean } from 'UTILS';

const OBSERVED_ATTRIBUTES = [ATTRIBUTES.selected, ATTRIBUTES.disabled];

// ATTRIBUTES.visited, 

export default class WizardStepperStep extends HTMLElement {
  #attributeUpdateHandler;
  #eventListeners;


  constructor() {
    super();
    this.#eventListeners = new Map();
  }

  get #name() {
    return this.getAttribute(ATTRIBUTES.name);
  }

  get disabled() {
    return parseBoolean(this.getAttribute(ATTRIBUTES.disabled));
  }

  get visited() {
    return parseBoolean(this.getAttribute(ATTRIBUTES.visited));
  }

  get selected() {
    return parseBoolean(this.getAttribute(ATTRIBUTES.selected));
  }

  get data() {
    return {
      name: this.#name,
      disabled: this.disabled,
      visited: this.visited,
      selected: this.selected
    }
  }

  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler && this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    const name = TEXT[this.#name] || '';
    TemplateGenerator.setTemplate(this, TEMPLATE, { name });
    AriaHandler.setRole(this, 'tab');

    this.#setAriaSelected();
    this.#setAriaDisabled();

    this.#eventListeners.set('click', this.#submitValueChange.bind(this));
    this.addEventListener('click', this.#eventListeners.get('click'));
    // this.#eventListeners.set('keyup', this.#onKeyUp.bind(this));

    this.#initUpdatesHandling();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler = new Map();
    this.#attributeUpdateHandler.set(ATTRIBUTES.selected, this.#setAriaSelected.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setAriaDisabled.bind(this));
  }

  disconnectedCallback() {
    this.#removeInputListeners();
    this.#attributeUpdateHandler = undefined;
  }

  #setAriaSelected() {
    AriaHandler.setAriaSelected(this, this.selected);
  }

  #setAriaDisabled() {
    AriaHandler.setAriaDisabled(this, this.disabled);
    AriaHandler.setFocusable(this, !this.disabled);
    if (this.disabled) {
      this.blur();
    }
  }

  #removeInputListeners() {
    if (this.#eventListeners.size) {
      for (const [listenerName, action] of this.#eventListeners) {
        this.removeEventListener(listenerName, action);
        this.#eventListeners.delete(listenerName);
      }
      this.#eventListeners = new Map();
    }
  }

  #submitValueChange() {
    // console.log('on click');
    this.blur();

    if (this.disabled) {
      return;
    }
    
    const event = new CustomEvent('onSelected', { detail: this.data });
    this.dispatchEvent(event);
  }

}

customElements.define('app-wizard-stepper-step', WizardStepperStep);