import './stepper-step.scss';
import { ATTRIBUTES, TEMPLATE, TEXT } from './stepper-step.constants';
import { AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
import { parseBoolean } from 'UTILS';

const OBSERVED_ATTRIBUTES = [ATTRIBUTES.selected, ATTRIBUTES.disabled];

export default class StepperStep extends HTMLElement {
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
    };
  }

  get selectable() {
    return !this.selected && !this.disabled;
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

    this.#setEventListener('click', this.#onClick.bind(this));
    this.#setEventListener('keydown', this.#onKeyDown.bind(this));

    this.#initUpdatesHandling();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler = new Map();
    this.#attributeUpdateHandler.set(ATTRIBUTES.selected, this.#setAriaSelected.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setAriaDisabled.bind(this));
  }

  #setEventListener(name, action) {
    this.#eventListeners.set(name, action);
    this.addEventListener(name, this.#eventListeners.get(name));
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

  #onKeyDown(event) {
    const actionCode = event.code;
    if (this.selectable && (actionCode === 'Enter' || actionCode === 'Space')) {
      this.blur();
      this.#submitValueChange();
    }
  }

  #onClick() {
    if (this.selectable) {
      this.#submitValueChange();
    }
  }

  #submitValueChange() {
    const event = new CustomEvent('onSelected', { detail: this.data });
    this.dispatchEvent(event);
  }

}

customElements.define('app-stepper-step', StepperStep);