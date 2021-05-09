import './dropdown-select.scss';
import './dropdown-select-list/DropdownSelectList'
import Dropdown from '../dropdown/Dropdown';

import { TEMPLATE, DOM_ELEMENT_CLASS, ATTRIBUTES, ARIA_LABEL } from './dropdown-select.constants';

import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
import { parseBoolean } from 'UTILS';
import { DropdownSelectAria } from './dropdown-select-aria/dropdown-select-aria';




export default class DropdownSelect extends Dropdown {
  #buttonText;
  #list;
  options = [];
  #selectedOption;
  // #templateConfig;

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

  initElementsVariables() {
    super.initElementsVariables();
    this.#buttonText = this.querySelector(`.${DOM_ELEMENT_CLASS.buttonText}`);
    this.#list = this.querySelector(`.${DOM_ELEMENT_CLASS.list}`);
  }



  #setNoOptionsView() {
    this.options = [];
    this.#selectedOption = undefined;

    const text = DropdownSelectAria.getLabel(this.name);
    AriaHandler.setAriaLabel(this.button, text);
    ElementHandler.setContent(this.#buttonText, text);
    this.#buttonText.innerHtml = text;
    // init list
    this.setAttribute('disabled', true);
  }


  connectedCallback() {
    super.connectedCallback();
    const name = this.name;

    
    console.log(name);
    console.log(this.options);
    // on update too
    if (this.options.length) {
      console.log(this.#buttonText);
      console.log(this.#list);
    } else {
      this.#setNoOptionsView();
    }
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