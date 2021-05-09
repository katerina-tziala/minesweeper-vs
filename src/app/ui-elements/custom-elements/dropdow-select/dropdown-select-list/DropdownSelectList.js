import './dropdown-select-list.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './dropdown-select-list.constants';
import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
export default class DropdownSelectList extends HTMLElement {
  #list;

  options = [];
  #selectedOption;
  
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
   // console.log('connectedCallback DropdownSelectList');
    TemplateGenerator.setTemplate(this, TEMPLATE);
    this.#list = this.querySelector(`.${DOM_ELEMENT_CLASS.list}`);
    //console.log(this.#list);
    this.setOptions();
  }




  disconnectedCallback() {
    console.log('disconnectedCallback DropdownSelectList');
  }

  adoptedCallback() {
    console.log('adoptedCallback DropdownSelectList');
  }


  setOptions(options = []) {
    console.log('DropdownSelectList setOptions');
    console.log(options);
  }




}

customElements.define('app-dropdown-select-list', DropdownSelectList);