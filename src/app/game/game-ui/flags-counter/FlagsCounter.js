'use strict';
import '~/ui-elements/custom-elements/digital-counters/digital-counter/DigitalCounter';
import './flags-counter.scss';
import { ATTRIBUTES, TEMPLATES, DOM_ELEMENT_CLASS, COUNTER_CONFIG } from './flags-counter.constants';
import { TemplateGenerator, ElementHandler } from 'UI_ELEMENTS';
export default class FlagsCounter extends HTMLElement {
  #counter;

  constructor() {
    super();
  }

  get flags() {
    return this.getAttribute(ATTRIBUTES.flags).split(',');
  }

  get colorTypes() {
    return this.getAttribute(ATTRIBUTES.colorTypes).split(',');
  }

  setValue(value = 0) {
    if (this.#counter) {
      this.#counter.setAttribute('value', value.toString());
    }
  }

  connectedCallback() {
    this.#renderIcon();
    this.#renderCounter();
  }

  #generateFlagIconStyle(identifier) {
    return `${DOM_ELEMENT_CLASS.flag}--${identifier}`;
  }

  #renderIcon() {
    const flags = this.flags;
    const colorTypes = this.colorTypes;
    const icon = TemplateGenerator.generate(TEMPLATES.iconHolder).childNodes[0];
    for (let index = 0; index < flags.length; index++) {
      const flagElement = TemplateGenerator.generate(TEMPLATES.flag).childNodes[0];
      if (flags.length > 1) {
        const position = index + 1;
        ElementHandler.addStyleClass(flagElement, this.#generateFlagIconStyle(position));
      }
      ElementHandler.addStyleClass(flagElement, this.#generateFlagIconStyle(flags[index]));
      ElementHandler.addStyleClass(flagElement, this.#generateFlagIconStyle(colorTypes[index]));
      icon.append(flagElement);
    }
    this.append(icon);
  }

  #renderCounter() {
    this.#counter = document.createElement('app-digital-counter');
    Object.keys(COUNTER_CONFIG).forEach(attribute => {
      this.#counter.setAttribute(attribute, COUNTER_CONFIG[attribute]);
    });
    this.append(this.#counter);
  }

}

customElements.define('app-flags-counter', FlagsCounter);