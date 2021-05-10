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



  constructor() {
    super();
    this.template = TEMPLATE;
    this.buttonClass = DOM_ELEMENT_CLASS.button;
  }

  get options() {
    return this.#list ? this.#list.options : [];
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

  connectedCallback() {
    super.connectedCallback();
    this.#setNoOptionsView();
  }


  // disconnectedCallback() {
  //   console.log('disconnectedCallback');

  // }



  // updateContent(content) {
  //   if (this.panel) {
  //     this.panel.updateContent(content);
  //   }
  // }
  #setNoOptionsView() {
    DropdownSelectAria.setDefaultLabel(this.button, this.name);
    ElementHandler.setContent(this.#buttonText, DropdownSelectAria.getLabel(this.name));
    // init list
    this.setAttribute('disabled', true);
  }

  setOptions(options) {
    if (this.panel && this.#list) {
      this.panel.closeAndPauseUpdates();
      this.#list.setOptions(options);
      this.panel.onContentUpdated();
      //  this.setAttribute('disabled', true);
      //
    }
    
    this.setAttribute('disabled', !this.options.length);
    // if (this.options.length) {
    //   console.log(this.#buttonText);
    //   console.log(this.#list);
    // } else {
    //   this.#setNoOptionsView();
    // }
    //console.log(options);
  }






}

customElements.define('app-dropdown-select', DropdownSelect);