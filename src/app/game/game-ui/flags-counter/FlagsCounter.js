'use strict';
import '~/ui-elements/custom-elements/digital-counters/digital-counter/DigitalCounter';
import './flags-counter.scss';
import { ATTRIBUTES, TEMPLATES, DOM_ELEMENT_CLASS, COUNTER_CONFIG } from './flags-counter.constants';
import { TemplateGenerator, ElementHandler } from 'UI_ELEMENTS';
export default class FlagsCounter extends HTMLElement {
  #counter;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get flags() {
    return this.getAttribute(ATTRIBUTES.flags).split(',');
  }

  get colorTypes() {
    return this.getAttribute(ATTRIBUTES.colorTypes).split(',');
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  setValue(value = 0) {
    if (this.#counter) {
      this.#counter.setAttribute('value', value.toString());
    }
  }

  connectedCallback() {
    this.#renderIcon();
    this.#renderCounter();
    this.#initUpdatesHandling();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.flags, this.#updateIcon.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.colorTypes, this.#updateIcon.bind(this));
  }

  #generateFlagIconStyle(identifier) {
    return `${DOM_ELEMENT_CLASS.flag}--${identifier}`;
  }

  #renderIcon() {
    const icon = TemplateGenerator.generate(TEMPLATES.iconHolder).childNodes[0];
    const iconContent = this.#generateIconContent();
    icon.append(iconContent);
    this.append(icon);
  }

  #updateIcon() {
    const icon = this.querySelector(`.${DOM_ELEMENT_CLASS.icon}`);
    ElementHandler.clearContent(icon);
    const iconContent = this.#generateIconContent();
    icon.append(iconContent);
  }

  #renderCounter() {
    this.#counter = document.createElement('app-digital-counter');
    Object.keys(COUNTER_CONFIG).forEach(attribute => {
      this.#counter.setAttribute(attribute, COUNTER_CONFIG[attribute]);
    });
    this.append(this.#counter);
  }

  #generateIconContent() {
    const flags = this.flags;
    const colorTypes = this.colorTypes;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < flags.length; index++) {
      const flagElement = TemplateGenerator.generate(TEMPLATES.flag).childNodes[0];
      if (flags.length > 1) {
        const position = index + 1;
        ElementHandler.addStyleClass(flagElement, this.#generateFlagIconStyle(position));
      }
      ElementHandler.addStyleClass(flagElement, this.#generateFlagIconStyle(flags[index]));
      ElementHandler.addStyleClass(flagElement, this.#generateFlagIconStyle(colorTypes[index]));
      fragment.append(flagElement);
    }
    return fragment;
  }

}

customElements.define('app-flags-counter', FlagsCounter);