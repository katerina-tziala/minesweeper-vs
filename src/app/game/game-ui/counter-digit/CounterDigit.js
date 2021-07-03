import './counter-digit.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS, CONFIG, DIGIT_POSITIONS } from './counter-digit.constants';
import { getDrawHandler } from './digit-lines';
import { CavnasUtils } from 'UTILS';
export default class CounterDigit extends HTMLElement {
  #canvas;
  #ctx;
  #digitLines = new Map();
  #pallette = {
    on: "#e60000",
    off: "#660000",
    shadow: "#ff0000",
  };
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#digitLines = getDrawHandler();
    this.#attributeUpdateHandler = new Map();
  }

  get #value() {
    return this.getAttribute(ATTRIBUTES.value);
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChangedCallback CustomElement ', attrName);
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    console.log('connectedCallback Digit');


    this.innerHTML = TEMPLATE;
    this.#canvas = this.querySelector(`.${DOM_ELEMENT_CLASS.digit}`);
    this.#ctx = this.#canvas.getContext('2d');

    this.#draw();
    this.#initUpdatesHandling();
  }

  disconnectedCallback() {
    console.log('disconnectedCallback Digit');
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#draw.bind(this));
    // this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
  }

  #draw() {
    if (!this.#ctx) {
      return;
    }
    this.#ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);
    const positions = DIGIT_POSITIONS[this.#value];
    this.#drawDigit(positions);
  }

  #drawDigit(positions = []) {
    this.#ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);
    const shadow = { ...CONFIG.lineShadow };
    shadow.color = this.#pallette.shadow;

    for (const [index, drawLineFunction] of this.#digitLines) {
      const lineOn = positions.includes(index);
      this.#ctx.fillStyle = this.#pallette.off;
      if (lineOn) {
        this.#ctx.fillStyle = this.#pallette.on;
        CavnasUtils.setShadow(this.#ctx, shadow);
      }
      drawLineFunction(this.#ctx);
      CavnasUtils.clearShadow(this.#ctx, shadow);
    }
  }

}

customElements.define('app-counter-digit', CounterDigit);