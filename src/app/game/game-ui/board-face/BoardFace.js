import './board-face.scss';
import { parseBoolean, definedString } from 'UTILS';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './board-face.constants';
import { ElementHandler } from 'UI_ELEMENTS';

export default class BoardFace extends HTMLElement {
  #attributeUpdateHandler;
  #button;
  #buttonListener;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return parseBoolean(disabled);
  }

  get #color() {
    const color = this.getAttribute(ATTRIBUTES.color);
    return definedString(color) ? color : null;
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
    this.innerHTML = TEMPLATE;
    this.#button = this.querySelector(`.${DOM_ELEMENT_CLASS.button}`);
    this.#buttonListener = this.#onClick.bind(this);
    this.#button.addEventListener('click', this.#buttonListener);
    this.#setDisabledState();
    this.#initUpdatesHandling();
  }

  #initUpdatesHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setDisabledState.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.color, this.#setColorStyles.bind(this));
  }

  #setDisabledState() {
    ElementHandler.setDisabled(this.#button, this.#disabled);
  }

  #setColorStyles() {
    const color = this.#color;
    if (color) {
      ElementHandler.addStyleClass(this.#button, DOM_ELEMENT_CLASS.player);
    } else {
      ElementHandler.removeStyleClass(this.#button, DOM_ELEMENT_CLASS.player);
    }
  }

  #onClick() {
    this.dispatchEvent(new CustomEvent('onBoardFaceClick'));
  }

  disconnectedCallback() {
    if (this.#button && this.#buttonListener) {
      this.#button.removeEventListener('click', this.#buttonListener);
      this.#buttonListener = undefined;
    }
  }

}

customElements.define('app-board-face', BoardFace);