import './dropdown.scss';
import './dropdown-panel/DropdowPanel';
import { TEMPLATE, DOM_ELEMENT_CLASS, ATTRIBUTES, ARIA_LABEL } from './dropdown.constants';
import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
import { parseBoolean } from 'UTILS';

export default class Dropdown extends HTMLElement {
  #expanded = false;
  #attributeUpdateHandler;
  #buttonListener;
  #clickListener;

  constructor() {
    super();
    this.template = TEMPLATE;
    this.buttonClass = DOM_ELEMENT_CLASS.button;
    this.#attributeUpdateHandler = new Map();
  }

  get name() {
    return this.getAttribute('name');
  }

  get expanded() {
    return this.#expanded;
  }

  get disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return parseBoolean(disabled);
  }

  get templateConfig() {
    const name = this.name;
    const expanded = this.expanded;
    const panelId = `${DOM_ELEMENT_CLASS.panel}-${name}`;
    return { name, expanded, panelId };
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
    if (this.name) {
      this.id = `app-dropdown-${this.name}`;
      TemplateGenerator.setTemplate(this, this.template, this.templateConfig);
      this.initElementsVariables();
      this.#initToggleButton();
      this.#setState();
      this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
    } else {
      throw new Error('name required for app-dropdown');
    }
  }

  disconnectedCallback() {
    if (this.#buttonListener) {
      this.button.removeEventListener('click', this.#buttonListener);
      this.#buttonListener = undefined;
    }
    this.#removeOutsideClickDetection();
  }

  initElementsVariables() {
    this.panel = this.querySelector(`.${DOM_ELEMENT_CLASS.panel}`);
    this.button = this.querySelector(`.${this.buttonClass}`);
  }

  updateContent(content) {
    if (this.panel) {
      this.panel.updateContent(content);
    }
  }

  #initToggleButton() {
    AriaHandler.setAriaControls(this.button, this.panel.id);
    if (!this.#buttonListener) {
      this.#buttonListener = this.#toggle.bind(this);
      this.button.addEventListener('click', this.#buttonListener);
    }
    this.#handleToggleButtonAria();
  }

  #detectOutsideClick() {
    if (!this.#clickListener && this.expanded) {
      this.#clickListener = this.#onDocumentClick.bind(this);
      document.addEventListener('click', this.#clickListener);
    }
  }

  #removeOutsideClickDetection() {
    if (this.#clickListener) {
      document.removeEventListener('click', this.#clickListener);
      this.#clickListener = undefined;
    }
  }
  #onDocumentClick(event) {
    const paneId = this.panel ? this.panel.id : undefined;
    const panel = event.target.closest(`.${DOM_ELEMENT_CLASS.panel}`);
    const button = event.target.closest(`.${this.buttonClass}`);
    const buttonControls = AriaHandler.getAriaControls(button);
    if (!panel && paneId !== buttonControls) {
      this.collapse();
    }
  }

  #handleToggleButtonAria() {
    AriaHandler.setAriaExpanded(this.button, this.expanded);
    const labels = ARIA_LABEL[this.name];
    if (labels) {
      const labelKey = this.expanded.toString();
      AriaHandler.setAriaLabel(this.button, labels[labelKey]);
    }
  }

  #toggle() {
    this.expanded ? this.collapse(): this.expand();
  }

  #setState() {
    ElementHandler.setDisabled(this.button, this.disabled);
    AriaHandler.setAriaDisabled(this.button, this.disabled);
    this.disabled ? this.collapse() : this.#detectOutsideClick();
  }

  collapse() {
    this.#expanded = false;
    this.#handleToggleButtonAria();
    this.panel.setAttribute('expanded', this.expanded);
    this.#removeOutsideClickDetection();
    this.onExpandStateChange();
  }

  expand() {
    this.#expanded = true;
    this.#handleToggleButtonAria();
    this.panel.setAttribute('expanded', this.expanded);
    this.#detectOutsideClick();
    this.onExpandStateChange();
  }

  onExpandStateChange() {
    const expanded = this.expanded;
    const name = this.name;
    const event = new CustomEvent('onExpandStateChange', { detail: { name, expanded } });
    this.dispatchEvent(event);
  }
}

customElements.define('app-dropdown', Dropdown);