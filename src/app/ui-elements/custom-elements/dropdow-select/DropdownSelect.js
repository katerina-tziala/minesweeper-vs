import './dropdown-select.scss';
import Dropdown from '../dropdown/Dropdown';



import { TEMPLATE, DOM_ELEMENT_CLASS, ATTRIBUTES, ARIA_LABEL } from './dropdown-select.constants';




// import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
// import { parseBoolean } from 'UTILS';

export default class DropdownSelect extends Dropdown {


  constructor() {
    super();
    this.template = TEMPLATE;
    this.buttonClass = DOM_ELEMENT_CLASS.button;
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  // attributeChangedCallback(attrName, oldVal, newVal) {
  //   console.log('attrName');
  // }

  connectedCallback() {
    super.connectedCallback();
    // console.log('DropdownSelect');
    // console.log(this.button);
    // console.log(this.panel);
  }

  // disconnectedCallback() {
  //   console.log('disconnectedCallback');

  // }

  // updateContent(content) {
  //   if (this.panel) {
  //     this.panel.updateContent(content);
  //   }
  // }






}

customElements.define('app-dropdown-select', DropdownSelect);