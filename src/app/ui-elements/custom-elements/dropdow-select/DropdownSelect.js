import './dropdown-select.scss';
import './dropdown-select-list/DropdownSelectList'
import Dropdown from '../dropdown/Dropdown';

import { TEMPLATE, DOM_ELEMENT_CLASS, ATTRIBUTES, ARIA_LABEL } from './dropdown-select.constants';

import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
import { parseBoolean } from 'UTILS';
import { DropdownSelectAria } from './dropdown-select-aria/dropdown-select-aria';




export default class DropdownSelect extends Dropdown {
  #buttonText;

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
  
  get templateConfig() {
    const config = super.templateConfig;
    config.buttonText = DropdownSelectAria.getLabel(this.name);
    return config;
  }

  connectedCallback() {
    super.connectedCallback();
    const name = this.name;


    //this.#buttonText.innerHtml = text;
    // console.log(this.#buttonText);
    console.log(name);

    // 
    console.log(this.button);
    // aria-haspopup="listbox"
    console.log(this.#buttonText);
    // const text = DropdownSelectAria.getLabel(this.name);
    // AriaHandler.setAriaLabel(this.button, text);
    // ElementHandler.setContent(this.#buttonText, text);


    // console.log(text);
    //console.log(ARIA_LABEL);

    // console.log('DropdownSelect');
    //console.log(this.button);
    //console.log(this.panel);

    //this.setAttribute('disabled', true);
  }


  // disconnectedCallback() {
  //   console.log('disconnectedCallback');

  // }

  // updateContent(content) {
  //   if (this.panel) {
  //     this.panel.updateContent(content);
  //   }
  // }
  initElementsVariables() {
    super.initElementsVariables();
    this.#buttonText = this.querySelector(`.${DOM_ELEMENT_CLASS.buttonText}`);
  }




}

customElements.define('app-dropdown-select', DropdownSelect);