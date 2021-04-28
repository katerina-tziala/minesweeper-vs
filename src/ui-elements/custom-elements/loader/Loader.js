import './loader.scss';
import { ElementHandler } from '../../element-handler';
import { TEMPLATES, ATTRIBUTES } from './loader.constants';

export default class Loader extends HTMLElement {

  constructor() {
    super();
  }

  get #spinner() {
    return this.querySelector('.loader-spinner');
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.#setTemplate();
    this.display();
  }

  connectedCallback() {
    this.#setTemplate();
    this.display();
  }

  #setTemplate() {
    const type = this.getAttribute('type') || 'svg';
    this.innerHTML = TEMPLATES[type]
  }

  display() {
    ElementHandler.display(this);
    this.#startSpinner();
  }

  hide() {
    ElementHandler.hide(this);
    this.#stopSpinner();
  }

  #startSpinner() {
    const spinner = this.#spinner;
    if (spinner) {
      ElementHandler.addStyleClass(spinner, 'spin');
    }
  }

  #stopSpinner() {
    const spinner = this.#spinner;
    if (spinner) {
      ElementHandler.removeStyleClass(spinner, 'spin');
    }
  }

}

customElements.define('app-loader', Loader);