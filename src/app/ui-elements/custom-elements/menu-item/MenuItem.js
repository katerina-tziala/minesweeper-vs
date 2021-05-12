import './menu-item.scss';
import { TEMPLATE, MENU_ITEM, ATTRIBUTES } from './menu-item.constants';
import { TemplateGenerator, AriaHandler } from 'UI_ELEMENTS';
import { parseBoolean } from 'UTILS';
export default class MenuItem extends HTMLElement {
  #attributeUpdateHandler;
  #eventListeners;
  #renderedType;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
    this.#attributeUpdateHandler.set(ATTRIBUTES.type, this.#onInit.bind(this));
    this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
    this.#eventListeners = new Map();
  }

  get #type() {
    return this.getAttribute(ATTRIBUTES.type);
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return parseBoolean(disabled);
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#renderedType && this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    this.#onInit();
  }

  disconnectedCallback() {
    for (const [type, action] of this.#eventListeners) {
      this.removeEventListener(type, action);
      this.#eventListeners.delete(type, action);
    }
  }

  #onInit() {
    const type = this.#type;
    if (this.#renderedType !== type) {
      this.#renderedType = type;
      this.#render();
    }
  }

  #render() {
    AriaHandler.setRole(this, 'menuitem');
    const content = MENU_ITEM[this.#renderedType];
    const template = TemplateGenerator.generate(TEMPLATE, content)
    this.append(template);
    this.#setListener('click', this.#onSelect.bind(this));
    this.#setListener('keydown', this.#onKeyDown.bind(this));
    this.#setState();
  }

  #setState() {
    AriaHandler.setAriaDisabled(this, this.#disabled);
    AriaHandler.setFocusable(this, !this.#disabled);
  }

  #setListener(type, action) {
    if (!this.#eventListeners.has(type)) {
      this.#eventListeners.set(type, action);
      this.addEventListener(type, this.#eventListeners.get(type));
    }
  }

  #onKeyDown(event) {
    if (event.keyCode === 13 || event.which === 13) {
      this.#onSelect();
    }
  }

  #onSelect() {
    const type = this.#type;
    if (type) {
      const event = new CustomEvent('selectedMenuItem', { detail: { value: type } });
      this.dispatchEvent(event);
      this.blur();
    }
  }

}

customElements.define('app-menu-item', MenuItem);