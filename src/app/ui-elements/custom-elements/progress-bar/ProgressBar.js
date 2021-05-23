import './progress-bar.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './progress-bar.constants';
import { TemplateGenerator } from 'UI_ELEMENTS';
import { NumberValidation } from 'UTILS';

export default class ProgressBar extends HTMLElement {
  #progressIndicator;

  constructor() {
    super();
  }

  get value() {
    return NumberValidation.numberFromString(this.getAttribute(ATTRIBUTES.progress));
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.#setProgress();
    }
  }

  connectedCallback() {
    TemplateGenerator.setTemplate(this, TEMPLATE);
    this.setAttribute(ATTRIBUTES.progress, this.value);
    this.#progressIndicator = this.querySelector(`.${DOM_ELEMENT_CLASS.progressIndicator}`);
    this.#setProgress();
  }

  #setProgress() {
    const progress = NumberValidation.getValueInBoundaries(this.value, 0, 100);
    if (this.#progressIndicator) {
      this.#progressIndicator.style.width = `${progress}%`;
    }
  }

}

customElements.define('app-progress-bar', ProgressBar);