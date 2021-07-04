import '../digital-counter/DigitalCounter';
import './digital-timer.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './digital-timer.constants';

export default class DigitalTimer extends HTMLElement {
  //turn timer
  // turn duration
  constructor() {
    super();
  }
  //

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChangedCallback CustomElement ', attrName);
    // upgrated
  }

  connectedCallback() {
    console.log('connectedCallback DigitalTimer');
    this.innerHTML = TEMPLATE;

  


  }

  disconnectedCallback() {
    console.log('disconnectedCallback DigitalTimer');
  }

  adoptedCallback() {
    console.log('adoptedCallback DigitalTimer');
  }

}

customElements.define('app-digital-timer', DigitalTimer);