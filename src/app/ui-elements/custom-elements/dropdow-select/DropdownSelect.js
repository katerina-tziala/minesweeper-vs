import './dropdown-select.scss';
import './dropdown-select-list/DropdownSelectList'
import Dropdown from '../dropdown/Dropdown';
import { TEMPLATE, DOM_ELEMENT_CLASS, ATTRIBUTES } from './dropdown-select.constants';
import { ElementHandler, AriaHandler } from 'UI_ELEMENTS';
import { DropdownSelectAria } from './dropdown-select-aria/dropdown-select-aria';

export default class DropdownSelect extends Dropdown {
  #buttonText;
  #list;
  #defaultLabel;
  #selectionListener;
  #onButtonKeyDownListener;

  constructor() {
    super();
    this.template = TEMPLATE;
    this.buttonClass = DOM_ELEMENT_CLASS.button;
  }

  get #buttonFocusable() {
    return !this.expanded && !this.disabled;
  }

  get options() {
    return this.#list ? this.#list.options : [];
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

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

    if (!this.#onButtonKeyDownListener) {
      this.#onButtonKeyDownListener = this.#onButtonKeyDown.bind(this);
      this.button.addEventListener('keydown', this.#onButtonKeyDownListener);
    }
    this.setAttribute('disabled', true);
  }

  #onValueSelected(event) {
    const { collapse, selectedOption } = event.detail; 
    this.#setButtonView();
    if (collapse) {
      this.button.focus();
      this.collapse();
      this.#submitValueChange(selectedOption);
    }
  }

  #submitValueChange(selectedOption) {
    const name = this.name;
    const value = selectedOption ? selectedOption.value : undefined;
    const event = new CustomEvent('onValueChange', { detail: { name, value } });
    this.dispatchEvent(event);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#selectionListener && this.#list) {
      this.#list.removeEventListener('onSelectedValue', this.#selectionListener);
      this.#selectionListener = undefined;
    }
    if (this.#onButtonKeyDownListener && this.button) {
      this.button.removeEventListener('keydown', this.#onButtonKeyDownListener);
      this.#onButtonKeyDownListener = undefined;
    }
  }

  #onButtonKeyDown(event) {
    const actionKey = event.key;
    const actions = ['ArrowUp', 'ArrowDown'];
    if (this.#list && this.#buttonFocusable && actions.includes(actionKey)) {
      event.preventDefault();
      event.stopPropagation();
      const direction = actionKey === 'ArrowUp' ? -1 : 1;
      this.expand();
      this.#list.selectBasedOnStep(direction);
      this.#submitValueChange(this.#list.selectedOption);
    }
  }

  updateContent(cntent) {// prevent content update
    return;
  }

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
    if (this.#buttonFocusable) {
      this.button.focus();
    }
  }

}

customElements.define('app-dropdown-select', DropdownSelect);