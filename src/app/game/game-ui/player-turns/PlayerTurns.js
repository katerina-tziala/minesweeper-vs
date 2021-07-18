'use strict';
import './player-turns.scss';
import { parseBoolean, CavnasUtils, NumberValidation, definedString } from 'UTILS';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS, CONFIG } from './player-turns.constants';
import { TrunsDirection } from './player-turns.enums/player-turns-direction.enum';
import * as TurnsUtils from './player-turns-utils';
import { TemplateGenerator, ElementHandler } from 'UI_ELEMENTS';
export default class PlayerTurns extends HTMLElement {
  #attributeUpdateHandler;
  #ctx;
  #baseCircle;
  #indicators = [];
  #styles = {};

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get missedTurns() {
    const value = this.getAttribute(ATTRIBUTES.missedTurns);
    return Math.abs(NumberValidation.numberFromString(value));
  }

  get turns() {
    const value = this.getAttribute(ATTRIBUTES.turns);
    return Math.abs(NumberValidation.numberFromString(value));
  }

  get direction() {
    const direction = this.getAttribute(ATTRIBUTES.direction);
    return direction === TrunsDirection.RightToLeft ? 1 : -1;
  }

  get fullCircle() {
    const fullCircle = this.getAttribute(ATTRIBUTES.fullCircle);
    return parseBoolean(fullCircle);
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

  #setTemplate() {
    const { size } = CONFIG;
    TemplateGenerator.setTemplate(this, TEMPLATE, { width: size, height: size });
    const canvas = this.querySelector(`.${DOM_ELEMENT_CLASS.canvas}`);
    this.#ctx = canvas.getContext('2d');
  }

  connectedCallback() {
    this.#baseCircle = TurnsUtils.getBaseCircleParams();
    this.#styles = TurnsUtils.getStyles(this.#theme);
    this.#setTemplate();
    this.#init();
    this.#initUpdatesHandling();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.direction, this.#init.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.fullCircle, this.#init.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.turns, this.#init.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.missedTurns, this.#draw.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.theme, this.#onThemeChange.bind(this));
  }

  #onThemeChange() {
    this.#styles = TurnsUtils.getStyles(this.#theme);
    this.#draw();
  }

  #init() {
    this.#setIndicators();
    this.#draw();
  }

  #setIndicators() {
    const turns = this.turns;
    const rotationAngle = TurnsUtils.getRotationAngle(turns, this.fullCircle);
    this.#indicators = TurnsUtils.generateTurnsIndicators(this.#baseCircle, turns, rotationAngle, this.direction);
  }

  #draw() {
    if (!this.#ctx) return;

    this.#ctx.clearRect(0, 0, CONFIG.size, CONFIG.size);
    this.#setCanvasStyles();
    this.#drawBaseCircle();
    this.#drawIndicators();
  }

  #setCanvasStyles() {
    const { strokeWidth, strokeColor } = this.#styles;
    this.#ctx.strokeStyle = strokeColor;
    this.#ctx.lineWidth = strokeWidth;
  }

  #drawBaseCircle() {
    const { cx, cy, radius } = this.#baseCircle;
    CavnasUtils.drawCircle(this.#ctx, cx, cy, radius);
    this.#ctx.stroke();
  }

  #drawIndicators() {
    CavnasUtils.setShadow(this.#ctx, this.#styles.shadow);

    for (let index = 0; index < this.#indicators.length; index++) {
      const point = this.#indicators[index];
      const { position, x, y } = point;
      const color = this.#getIndicatorColor(position);
      TurnsUtils.drawTurnsIndicator(this.#ctx, { position, x, y, color });
    }

    CavnasUtils.clearShadow(this.#ctx);
  }

  #getIndicatorColor(position) {
    return position <= this.missedTurns ? this.#styles.off : this.#styles.on;
  }

}

customElements.define('app-player-turns', PlayerTurns);