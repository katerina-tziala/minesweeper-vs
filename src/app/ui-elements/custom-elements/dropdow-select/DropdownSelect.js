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
  #selectionListener;

  //offsetParent
  //max height

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
    this.#selectionListener = this.#onValueSelected.bind(this);

    this.#list.addEventListener('onSelectedValue', this.#selectionListener);
    this.#setButtonView();

    this.setAttribute('disabled', true);
  }

  // Enter/ Space
  //  --  button => expands the listbox and places focus on the currently selected option in the list.

  // Down Arrow
  //  --  button => If the listbox is collapsed, also expands the list.

  // Up Arrow
  //  --  button => If the listbox is collapsed, also expands the list.
  #onValueSelected(event) {
    const { collapse } = event.detail;

    console.log(event.detail);

   // 
    this.#setButtonView();
  

    if (collapse) {
      this.button.focus();
      this.collapse();
    }
    //
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#selectionListener && this.#list) {
      this.#list.removeEventListener('onSelectedValue', this.#selectionListener);
      this.#selectionListener = undefined;
    }
  }

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
  }

  setOptions(options) {
    if (this.panel && this.#list) {
      this.panel.closeAndPauseUpdates();
      this.#list.setOptions(options);
      this.panel.onContentUpdated();
    }
    this.#setButtonView();
    this.setAttribute('disabled', !this.options.length);
  }

  onExpandStateChange() {
    this.#list.onExpandStateChange(this.expanded);
    //this.button.focus();
  }




}

customElements.define('app-dropdown-select', DropdownSelect);