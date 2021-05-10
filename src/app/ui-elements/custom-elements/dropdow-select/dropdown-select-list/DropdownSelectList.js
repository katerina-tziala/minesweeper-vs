import './dropdown-select-list.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './dropdown-select-list.constants';
import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
import { DropdownSelectAria } from '../dropdown-select-aria/dropdown-select-aria';
import { DropdownSelectListItem as ListItem } from './dropdown-select-list-item/dropdown-select-list-item';

export default class DropdownSelectList extends HTMLElement {
  #list;
  #listId;

  options = [];

  constructor() {
    super();

  }

  get #name() {
    return this.getAttribute('name');
  }
  get selectedOption() {
    return this.options && this.options.length ?  this.options.find(option => option.selected) : undefined;
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChangedCallback DropdownSelectList ', attrName);
    // upgrated
  }

  connectedCallback() {
    if (this.#name) {
      TemplateGenerator.setTemplate(this, TEMPLATE);
      this.#listId = `${DOM_ELEMENT_CLASS.list}-${this.#name}`;
      this.#list = this.querySelector(`.${DOM_ELEMENT_CLASS.list}`);
      ElementHandler.setElementId(this.#list, this.#listId);
      DropdownSelectAria.setDefaultLabel(this.#list, this.#name);


    } else {
      throw new Error('name required for app-dropdown');
    }
  }




  disconnectedCallback() {
    console.log('disconnectedCallback DropdownSelectList');
  }

  adoptedCallback() {
    console.log('adoptedCallback DropdownSelectList');
  }


  setOptions(options = []) {
    if (!this.#list) {
      return;
    }

    this.options = [];

    ElementHandler.clearContent(this.#list);

    const setsize = options.length;
    options.forEach((option, index) => {
      const posinset = index + 1;
      const id = `${this.#listId}-option--${posinset}`;
      const optionInfo = { id, index, posinset, setsize };
      const listOption = Object.assign(option, optionInfo);
      const listItem = ListItem.generate(listOption, this.#onOptionClick.bind(this));

      this.options.push(listOption);
      this.#list.append(listItem);
    });
    this.#setActiveDescendant();
  }




  #onOptionClick(selectedOption) {
    this.options = this.options.map(option => {
      option.selected = option.value === selectedOption.value;
      // aria selected
      return option;
    });
    console.log('onOptionClick');
    console.log(selectedOption);
    this.#setActiveDescendant();
    // this.clearCurrentSelectedOption();
    // this.setActiveDescendant(ElementHandler.getID(selectedOption));
    // this.submitSelectedOption(selectedOption);
  }

  #setActiveDescendant() {
    const selected = this.selectedOption ? this.selectedOption.id : '';
    console.log('setActiveDescendant', selected);
  
    AriaHandler.setActiveDescendant(this.#list, selected);
  }
}

customElements.define('app-dropdown-select-list', DropdownSelectList);