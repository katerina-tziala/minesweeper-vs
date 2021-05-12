import './dropdown-select-list.scss';
import { TEMPLATE, DOM_ELEMENT_CLASS } from './dropdown-select-list.constants';
import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
import { DropdownSelectAria } from '../dropdown-select-aria/dropdown-select-aria';
import { DropdownSelectListItem as ListItem } from './dropdown-select-list-item/dropdown-select-list-item';
import { getNextPositionInArray, lastPositionInArray, numberDefined } from 'UTILS';

export default class DropdownSelectList extends HTMLElement {
  #list;
  #listId;
  #keyboardNavigation;
  #navigationHandler;
  options = [];

  constructor() {
    super();
    this.#navigationHandler = new Map();
    this.#navigationHandler.set('arrowup', this.#arrowUpNavigation.bind(this));
    this.#navigationHandler.set('arrowdown', this.#arrowDownNavigation.bind(this));
    this.#navigationHandler.set('home', this.#homeNavigation.bind(this));
    this.#navigationHandler.set('end', this.#endNavigation.bind(this));
    this.#navigationHandler.set('enter', this.#onEnterEscapeNavigation.bind(this));
    this.#navigationHandler.set('escape', this.#onEnterEscapeNavigation.bind(this));
    this.#navigationHandler.set('tab', this.#onTabNavigation.bind(this));
  }

  get #name() {
    return this.getAttribute('name');
  }

  get selectedOption() {
    return this.options && this.options.length ? this.options.find(option => option.selected) : undefined;
  }

  connectedCallback() {
    if (this.#name) {
      TemplateGenerator.setTemplate(this, TEMPLATE);
      this.#listId = `${DOM_ELEMENT_CLASS.list}-${this.#name}`;
      this.#list = this.querySelector(`.${DOM_ELEMENT_CLASS.list}`);
      ElementHandler.setElementId(this.#list, this.#listId);
      DropdownSelectAria.setDefaultLabel(this.#list, this.#name);
    } else {
      throw new Error('name required for app-dropdown-select-list');
    }
  }

  disconnectedCallback() {
    this.#removeKeyboardNavigation();
  }

  #removeKeyboardNavigation() {
    if (this.#keyboardNavigation && this.#list) {
      this.#list.removeEventListener('keydown', this.#keyboardNavigation);
      this.#keyboardNavigation = undefined;
    }
  }

  #setKeyboardNavigation() {
    if (!this.#keyboardNavigation && this.#list && this.options.length) {
      this.#keyboardNavigation = this.#onKeyDown.bind(this);
      this.#list.addEventListener('keydown', this.#keyboardNavigation);
    }
  }

  setOptions(options = []) {
    if (!this.#list) {
      return;
    }
    this.options = [];
    ElementHandler.clearContent(this.#list);
    this.#removeKeyboardNavigation();

    const setsize = options.length;
    options.forEach((option, index) => {
      const posinset = index + 1;
      const id = `${this.#listId}-option--${posinset}`;
      const optionInfo = { id, index, posinset, setsize };
      const listOption = Object.assign(option, optionInfo);
      const listItem = ListItem.generate(listOption, this.#onOptionSelect.bind(this));
      this.options.push(listOption);
      this.#list.append(listItem);
    });
    this.#setActiveDescendant();
    this.#setKeyboardNavigation();
  }

  #onOptionSelect(selectedOption, collapse = true) {
    this.#setSelectedOption(selectedOption);
    this.#moveFocusInListOption(selectedOption, !collapse);
    this.#setActiveDescendant();
    this.#submitValueChange(collapse);
  }

  #setSelectedOption(selectedOption) {
    this.options = this.options.map(option => {
      option.selected = option.value === selectedOption.value;
      const listItem = this.querySelector(`#${option.id}`);
      AriaHandler.setAriaSelected(listItem, option.selected);
      return option;
    });
  }

  #setActiveDescendant() {
    const selected = this.selectedOption ? this.selectedOption.id : '';
    AriaHandler.setActiveDescendant(this.#list, selected);
  }

  #submitValueChange(collapse = true) {
    const selectedOption = this.selectedOption;
    const event = new CustomEvent('onSelectedValue', { detail: { selectedOption, collapse } });
    this.dispatchEvent(event);
  }

  onExpandStateChange(expanded) {
    this.#setItemsTabIndex(expanded);
    if (expanded) {
      this.#listExpanded();
    }
  }

  #listExpanded() {
    if (this.options) {
      const selectedOption = this.selectedOption || this.options[0];
      this.#moveFocusInListOption(selectedOption, true);
    }
  }

  #moveFocusInListOption(selectedOption, scrollFocus = true) {
    const listItem = this.querySelector(`#${selectedOption.id}`);
    if (!listItem) {
      return;
    }
    listItem.focus();
    if (scrollFocus) {
      this.#list.scrollTo({
        top: listItem.offsetTop,
        behavior: 'smooth',
      });
    }
  }

  #setItemsTabIndex(expanded) {
    this.options.forEach(option => {
      const listItem = this.querySelector(`#${option.id}`);
      AriaHandler.setFocusable(listItem, expanded);
    });
  }

  #onKeyDown(event) {
    const actionKey = event.key.toLowerCase();
    const currentPosition = AriaHandler.getAriaPosInset(event.target) - 1;
    const shiftKey = event.shiftKey;

    if (!numberDefined(currentPosition)) {
      event.preventDefault();
      event.stopPropagation();
      this.#moveFocusInListOption(this.selectedOption);
      return;
    }

    if (this.options.length && this.#navigationHandler.has(actionKey)) {
      event.preventDefault();
      event.stopPropagation();
      this.#navigationHandler.get(actionKey)(currentPosition, shiftKey);
    }
  }

  /**
   *  When displayed, moves focus to and selects the previous option, without collapsing the list
   *  When first one selected then selects the last one
   */
  #arrowUpNavigation(currentPosition) {
    const nextPosition = getNextPositionInArray(this.options, currentPosition, -1);
    const selectedOption = this.options[nextPosition];
    this.#onOptionSelect({ ...selectedOption }, false);
  }

  /**
   *  When displayed, moves focus to and selects the next option, without collapsing the list
   *  When last one selected then selects the first one
   */
  #arrowDownNavigation(currentPosition) {
    const nextPosition = getNextPositionInArray(this.options, currentPosition);
    const selectedOption = this.options[nextPosition];
    this.#onOptionSelect({ ...selectedOption }, false);
  }

  /**
  *  When displayed, moves focus to and selects the first option, without collapsing the list
  */
  #homeNavigation() {
    const selectedOption = this.options[0];
    this.#onOptionSelect({ ...selectedOption }, false);
  }

  /**
   *  When displayed, moves focus to and selects the last option, without collapsing the list
   */
  #endNavigation() {
    const nextPosition = lastPositionInArray(this.options);
    const selectedOption = this.options[nextPosition];
    this.#onOptionSelect({ ...selectedOption }, false);
  }

  /**
   *  When displayed, keeps the currently selected option, and collapses the list
   */
  #onEnterEscapeNavigation() {
    this.#onOptionSelect({ ...this.selectedOption }, true);
  }

  /**
   *  When displayed, and shift is not pressed acts like arrowDownNavigation
   *  When displayed, and shift is pressed acts like arrowUpNavigation
   */
  #onTabNavigation(currentPosition, shiftKey) {
    shiftKey ? this.#arrowUpNavigation(currentPosition) : this.#arrowDownNavigation(currentPosition);
  }

}

customElements.define('app-dropdown-select-list', DropdownSelectList);