import './error-message.scss';
import { ElementHandler, AriaHandler } from 'UI_ELEMENTS';
import { definedString } from 'UTILS'
import { ATTRIBUTES } from './error-message.constants';

export default class ErrorMessage extends HTMLElement {

  constructor() {
    super();
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  get #ariaLabel() {
    return this.getAttribute(ATTRIBUTES.ariaLabel);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === ATTRIBUTES.ariaLabel && oldVal !== newVal) {
      this.#handleDisplay();
    }
  }

  connectedCallback() {
    this.#handleDisplay();
  }

  #handleDisplay() {
    definedString(this.#ariaLabel) ? this.#show() : this.#hide();
  }

  #show() {
    this.innerHTML = this.#ariaLabel;
    AriaHandler.setAlertRole(this);
    ElementHandler.display(this);
  }

  #hide() {
    this.innerHTML = '';
    AriaHandler.removeRole(this);
    ElementHandler.hide(this);
  }

}

customElements.define('app-error-message', ErrorMessage);