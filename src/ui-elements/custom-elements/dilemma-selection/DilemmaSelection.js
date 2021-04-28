import './dilemma-selection.scss';
import { ElementHandler } from '../../element-handler';
import { TEMPLATE, ATTRIBUTES } from './dilemma-selection.constants';

export default class DilemmaSelection extends HTMLElement {
  #buttonChoiceA;
  #buttonChoiceB;

  constructor() {
    super();
  }

  // static get observedAttributes() {
  //   return Object.values(ATTRIBUTES);
  // }

  // attributeChangedCallback(attrName, oldVal, newVal) {
  //   this.#setTemplate();
  //   this.display();
  // }

  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.#buttonChoiceA = this.querySelector('.dilemma-selection__choice-a');
    this.#buttonChoiceB = this.querySelector('.dilemma-selection__choice-b');
 
    this.#buttonChoiceA.addEventListener('click', (event) => {
      console.log(event);
    });
    this.#buttonChoiceB.addEventListener('click', (event) => {
      console.log(event);
    });

  }

}

customElements.define('app-dilemma-selection', DilemmaSelection);