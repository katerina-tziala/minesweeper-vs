import './dropdown-select-list.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './dropdown-select-list.constants';

export default class DropdownSelectList extends HTMLElement {

  constructor() {
    super();

  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChangedCallback DropdownSelectList ', attrName);
    // upgrated
  }

  connectedCallback() {
    console.log('connectedCallback DropdownSelectList');

  }

  disconnectedCallback() {
    console.log('disconnectedCallback DropdownSelectList');
  }

  adoptedCallback() {
    console.log('adoptedCallback DropdownSelectList');
  }

}

customElements.define('app-dropdown-select-list', DropdownSelectList);