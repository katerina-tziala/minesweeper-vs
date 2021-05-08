
import { TEMPLATE, MENU_ITEM, ATTRIBUTES } from '../dropdown-panel.constants';
import { TemplateGenerator } from '../../../template-generator';
import { AriaHandler } from '../../../aria-handler';

export default class DropdowPanel extends HTMLElement {
  #expanded = false;

  constructor() {
    super();

  }


  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // if (this.#renderedType && this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
    //   this.#attributeUpdateHandler.get(attrName)();
    // }
  }

  connectedCallback() {
    this.innerHTML = TEMPLATE;


    console.log('connectedCallback');
    console.log('DropdowPanel');
  }

  disconnectedCallback() {

    console.log('disconnectedCallback');
  }

  // _calculateScales() {
  //   const collapsed = this._menuTitle.getBoundingClientRect();
  //   const expanded = this._menu.getBoundingClientRect();

  //   this._collapsed = {
  //     x: collapsed.width / expanded.width,
  //     y: collapsed.height / expanded.height
  //   }
  // }

}

customElements.define('app-dropdown-panel', DropdowPanel);