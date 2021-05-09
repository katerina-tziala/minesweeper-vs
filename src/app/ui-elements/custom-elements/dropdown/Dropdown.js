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

  get #name() {
    return this.getAttribute('name');
  }

  get #disabled() {
    const disabled = this.getAttribute(ATTRIBUTES.disabled);
    return parseBoolean(disabled);
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
    const name = this.#name;
    const expanded = this.#expanded;
    if (name) {
      this.id = `app-dropdown-${name}`;
      const panelId = `${DOM_ELEMENT_CLASS.panel}-${name}`;
      const template = TemplateGenerator.generate(this.template, { name, expanded, panelId });
      this.append(template);
      this.panel = this.querySelector(`.${DOM_ELEMENT_CLASS.panel}`);
      this.#initToggleButton();
      this.#setState();
      this.#attributeUpdateHandler.set(ATTRIBUTES.disabled, this.#setState.bind(this));
    } else {
      throw new Error('name required for app-dropdown');
    }
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this.#buttonListener);
    this.#removeOutsideClickDetection();
  }

  renderTemplate(name, expanded) {
    this.innerHTML = TemplateGenerator.generate(this.template, { name, expanded });
  }

  updateContent(content) {
    if (this.panel) {
      this.panel.updateContent(content);
    }
  }

  #initToggleButton() {
    this.button = this.querySelector(`.${this.buttonClass}`);
    AriaHandler.setAriaControls(this.button, this.panel.id);
    this.#buttonListener = this.#toggle.bind(this);
    this.button.addEventListener('click', this.#buttonListener);
    this.#handleToggleButtonAria();
  }

  #detectOutsideClick() {
    if (!this.#clickListener) {
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
      this.#collapse();
    }
  }

  #handleToggleButtonAria() {
    AriaHandler.setAriaExpanded(this.button, this.#expanded);
    const labels = ARIA_LABEL[this.#name];
    if (labels) {
      const labelKey = this.#expanded.toString();
      AriaHandler.setAriaLabel(this.button, labels[labelKey]);
    }
  }

  #toggle() {
    this.#expanded = !this.#expanded;
    this.#handleToggleButtonAria();
    this.panel.setAttribute('expanded', this.#expanded);
    this.#onExpandStateChange();
  }

  #setState() {
    ElementHandler.setDisabled(this.button, this.#disabled);
    AriaHandler.setAriaDisabled(this.button, this.#disabled);
    this.#disabled ? this.#disable() : this.#enable();
  }

  #disable() {
    this.#collapse();
    this.#removeOutsideClickDetection();
  }

  #collapse() {
    this.#expanded = false;
    this.#handleToggleButtonAria();
    this.panel.setAttribute('expanded', this.#expanded);
    this.#onExpandStateChange();
  }

  #enable() {
    this.#detectOutsideClick();
  }

  #onExpandStateChange() {
    const name = this.#name;
    const expanded = this.#expanded;
    const event = new CustomEvent('onExpandStateChange', { detail: { name, expanded } });
    this.dispatchEvent(event);
  }
}

customElements.define('app-dropdown', Dropdown);