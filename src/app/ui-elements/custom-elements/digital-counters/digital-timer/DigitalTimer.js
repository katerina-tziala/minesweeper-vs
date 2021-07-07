'use strict';
import '../digital-counter/DigitalCounter';
import './digital-timer.scss';
import { ATTRIBUTES, CONFIG, DOM_ELEMENT_CLASS, TEMPLATES } from './digital-timer.constants';
import { TemplateGenerator, ElementHandler } from 'UI_ELEMENTS';
import { parseBoolean, numberDefined, secondsToTimeObject } from 'UTILS';

export default class DigitalTimer extends HTMLElement {
  #counters;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#counters = new Map();
    this.#attributeUpdateHandler = new Map();
  }

  get format() {
    const format = this.getAttribute(ATTRIBUTES.format);
    return CONFIG.supportedFormats.includes(format) ? format : CONFIG.supportedFormats[0];
  }

  get seconds() {
    const seconds = parseInt(this.getAttribute(ATTRIBUTES.seconds), 10)
    return numberDefined(seconds) ? seconds : 0;
  }

  get alive() {
    const alive = this.getAttribute(ATTRIBUTES.alive);
    return parseBoolean(alive);
  }

  get time() {
    return secondsToTimeObject(this.seconds);
  }

  static get observedAttributes() {
    return Object.values([ATTRIBUTES.seconds, ATTRIBUTES.alive]);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    this.setAttribute(ATTRIBUTES.alive, this.alive);
    this.setAttribute(ATTRIBUTES.seconds, this.seconds);
    const templateParts = this.format.split(':');
    this.#render(templateParts);
    this.#displayTime();
    this.#initUpdatesHandling();
  }

  #render(templateParts) {
    templateParts.forEach((key, index) => {
      const counterElement = this.#generateTimePartElement(key);

      this.#counters.set(key, counterElement);
      this.append(counterElement);

      if (index < templateParts.length - 1) {
        this.append(TemplateGenerator.generate(TEMPLATES.separator));
      }
    });
  }

  #generateTimePartElement(templateKey) {
    return TemplateGenerator.generate(TEMPLATES[templateKey]).childNodes[0];
  }

  #displayTime() {
    const time = this.time;

    for (const [key, counterElement] of this.#counters) {
      counterElement.setAttribute('value', time[key].toString());
    }
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.seconds, this.#displayTime.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.alive, this.#onAliveChange.bind(this));
  }

  #onAliveChange() {
    const timeSeparators = this.querySelectorAll(`.${DOM_ELEMENT_CLASS.timeSeparator}`);
    timeSeparators.forEach(element => {
      this.alive ? ElementHandler.addStyleClass(element, DOM_ELEMENT_CLASS.alive) : ElementHandler.removeStyleClass(element, DOM_ELEMENT_CLASS.alive);
    });
  }

}

customElements.define('app-digital-timer', DigitalTimer);