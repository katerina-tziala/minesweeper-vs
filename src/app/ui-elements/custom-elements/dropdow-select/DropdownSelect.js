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
  #defaultLabel;



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
    this.#defaultLabel = DropdownSelectAria.getLabel(this.name);

    this.#setButtonView();
    this.setAttribute('disabled', true);
  }


  // disconnectedCallback() {
  //   console.log('disconnectedCallback');

  // }

  // updateContent(content) {
  //   if (this.panel) {
  //     this.panel.updateContent(content);
  //   }
  // }


  #setButtonView() {
    const selectedOption = this.#list.selectedOption;
    let buttonLabel = this.#defaultLabel;
    let buttonText = this.#defaultLabel;
    if (selectedOption) {
      buttonLabel += `: ${selectedOption.ariaLabel}`;
      buttonText = selectedOption.displayValue;
    }
    AriaHandler.setAriaLabel(this.button, buttonLabel);
    ElementHandler.setContent(this.#buttonText, buttonText);
    // init list
    
  }

  setOptions(options) {
    if (this.panel && this.#list) {
      this.panel.closeAndPauseUpdates();
      this.#list.setOptions(options);
      this.panel.onContentUpdated();
    }

    //console.log(this.#list.options.find(option => option.selected));
    console.log(this.#list.selectedOption);
    this.#setButtonView();
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