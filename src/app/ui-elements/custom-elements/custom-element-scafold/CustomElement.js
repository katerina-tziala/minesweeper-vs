import './custom-element.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './custom-element.constants';

export default class CustomElement extends HTMLElement {

  constructor() {
    super();

  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChangedCallback CustomElement ', attrName);
    // upgrated
  }

  connectedCallback() {
    console.log('connectedCallback CustomElement');

  }

  disconnectedCallback() {
    console.log('disconnectedCallback CustomElement');
  }

  adoptedCallback() {
    console.log('adoptedCallback CustomElement');
  }

}

customElements.define('app-custom-element', CustomElement);