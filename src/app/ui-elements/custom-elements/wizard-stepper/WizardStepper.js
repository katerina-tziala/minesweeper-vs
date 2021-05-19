import './wizard-stepper.scss';
import { ATTRIBUTES, TEMPLATES, DOM_ELEMENT_CLASS } from './wizard-stepper.constants';

export default class WizardStepper extends HTMLElement {
  #container;
  constructor() {
    super();
    this.steps = [
      {
        selected: true,
        value: "level"
      },
      {
        selected: false,
        value: "turns"
      },
      {
        selected: false,
        value: "turns"
      }
    ];
  }

  // static get observedAttributes() {
  //   return Object.values(ATTRIBUTES);
  // }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChangedCallback WizardStepper ', attrName);
    // upgrated
  }

  connectedCallback() {
    console.log('connectedCallback WizardStepper');

    this.innerHTML = TEMPLATES.container;
    this.#container = this.querySelector(`.${DOM_ELEMENT_CLASS.container}`);

    
    console.log(this.#container);
    console.log(this.steps);

  }

  disconnectedCallback() {
    console.log('disconnectedCallback WizardStepper');
  }

  adoptedCallback() {
    console.log('adoptedCallback WizardStepper');
  }

}

customElements.define('app-wizard-stepper', WizardStepper);