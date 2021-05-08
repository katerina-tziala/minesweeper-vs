import './dropdown.scss';
import './dropdown-panel/DropdowPanel';
import { TEMPLATE, DOM_ELEMENT_CLASS, ATTRIBUTES } from './dropdown.constants';
import { TemplateGenerator } from '../../template-generator';
import { AriaHandler } from '../../aria-handler';

export default class Dropdown extends HTMLElement {
  #expanded = false;


  #button;
  #panel;

  constructor() {
    super();

  }


  get #name() {
    return this.getAttribute('name');
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
    const name = this.#name;
    const expanded = this.#expanded;
    if (name) {
      this.id = `app-dropdown-${name}`;
      this.innerHTML = TemplateGenerator.generate(TEMPLATE, { name, expanded });


      this.#panel = this.querySelector(`.${DOM_ELEMENT_CLASS.panel}`);
      this.#button = this.querySelector(`.${DOM_ELEMENT_CLASS.button}`);
      AriaHandler.setAriaControls(this.#button, this.#panel.id);

      // aria label
      

      this.#handleButtonAria();
      this.updated = false;
      this.#button.addEventListener('click', this.#toggle.bind(this))


    } else {
      throw new Error('name required for dropdown');
    }
  }



  disconnectedCallback() {

    console.log('disconnectedCallback');
  }


  #handleButtonAria() {
    AriaHandler.setAriaExpanded(this.#button, this.#expanded);
  }

  #toggle() {
    this.#expanded = !this.#expanded;
    this.#handleButtonAria();
    this.#panel.setAttribute('expanded', this.#expanded);
  }



}

customElements.define('app-dropdown', Dropdown);