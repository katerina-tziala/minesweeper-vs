import './counter-digit.scss';
import { CavnasUtils, definedString } from 'UTILS';
import { TemplateGenerator } from 'UI_ELEMENTS';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS, CONFIG, DIGIT_POSITIONS, PALETTE } from './counter-digit.constants';
import { getDrawHandler } from './digit-lines';

export default class CounterDigit extends HTMLElement {
  #attributeUpdateHandler;
  #DigitLinesDrawHandler;
  #palette;
  #ctx;
  #lineShadow;

  constructor() {
    super();
    this.#DigitLinesDrawHandler = getDrawHandler();
    this.#attributeUpdateHandler = new Map();
  }

  get #value() {
    return this.getAttribute(ATTRIBUTES.value);
  }

  get #theme() {
    const theme = this.getAttribute(ATTRIBUTES.theme);
    return definedString(theme) ? theme : 'light';
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
    const { width, height } = CONFIG;
    TemplateGenerator.setTemplate(this, TEMPLATE, { width, height });
    const canvas = this.querySelector(`.${DOM_ELEMENT_CLASS.digit}`);
    this.#ctx = canvas.getContext('2d');
    this.#setTheming(this.#theme);
    this.#draw();
    this.#initUpdatesHandling();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.value, this.#draw.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.theme, this.#onThemeChange.bind(this));
  }

  #setTheming(theme = 'light') {
    this.#palette = { ...PALETTE[theme] };
    this.#lineShadow = { ...CONFIG.lineShadow };
    this.#lineShadow.color = this.#palette.shadow;
  }

  #onThemeChange() {
    console.log('onThemeChange');
    this.#setTheming(this.#theme);
    this.#draw();
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

    for (const [index, drawLineFunction] of this.#DigitLinesDrawHandler) {
      const highlightedLine = positions.includes(index);
      this.#drawDigitLine(drawLineFunction, highlightedLine);
    }
  }

  #drawDigitLine(drawLineFunction, highlightedLine) {
    this.#ctx.fillStyle = this.#palette.off;
    if (highlightedLine) {
      this.#ctx.fillStyle = this.#palette.on;
      CavnasUtils.setShadow(this.#ctx, this.#lineShadow);
    }
    drawLineFunction(this.#ctx);
    CavnasUtils.clearShadow(this.#ctx);
  }

}

customElements.define('app-counter-digit', CounterDigit);