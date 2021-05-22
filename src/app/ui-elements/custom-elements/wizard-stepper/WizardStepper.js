import './wizard-stepper.scss';
import { ATTRIBUTES, TEMPLATES, DOM_ELEMENT_CLASS } from './wizard-stepper.constants';
import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';


import './wizard-stepper-step/WizardStepperStep';




export default class WizardStepper extends HTMLElement {
  #container;
  #stepsIndex;
  constructor() {
    super();
    this.steps = [
      {
        selected: true,
        name: 'bot',
        visited: true,
        disabled: false,
        ariaLabel: 'bot settings',
      },
      {
        selected: false,
        name: 'gameMode',
        visited: false,
        disabled: false,
        ariaLabel: 'game goal settings',
      },
      {
        selected: false,
        name: 'level',
        visited: false,
        disabled: false,
        ariaLabel: 'level settings',
      },
      {
        selected: false,
        name: 'turns',
        visited: false,
        disabled: false,
        ariaLabel: 'turns settings',
      },
      {
        selected: false,
        name: 'options',
        visited: false,
        disabled: false,
        ariaLabel: 'options settings',
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


    this.innerHTML = TEMPLATES.container;
    this.#container = this.querySelector(`.${DOM_ELEMENT_CLASS.container}`);


    // console.log(this.#container);
    // console.log(this.steps);
    this.#container.innerHTML = '';


    this.#stepsIndex = new Map();
    this.steps.forEach((step, index) => {
      const { name } = step;
      const stepData = { ...step, index };
      const element = this.#generateStep(step);
      this.#stepsIndex.set(name, { ...stepData, element });
      // Array.from(items.keys())[2]
      // focus on first selected
      // aria-controls="tabpanel-id" -- set from template

      this.#container.append(element);


      //app-wizard-stepper-step
    });



    console.log(this.#stepsIndex);


  }

  #generateStep(step) {
    const template = TemplateGenerator.generate(TEMPLATES.step, step);
    const stepItem = template.children[0];
    stepItem.addEventListener('onSelected', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.#onOptionSelected(event);
    });
    return stepItem;
  }

  #onOptionSelected({ detail }) {
    console.log('onOptionSelected');

    const { name } = detail;
    this.#updateSteps(name);


    console.log(this.#stepsIndex.get(name));

    console.log(this.#stepsIndex);
  }

  #updateSteps(selectedKey) {
    if (!this.#stepsIndex) {
      return;
    }

    let lastVisited = 0;
    for (let step of this.#stepsIndex.values()) {
      step.selected = (step.name === selectedKey) || (step.index === selectedKey);

      const stepUpdate = this.#getStepUpdateData(step, lastVisited);
      lastVisited = stepUpdate.lastVisited;
      step = Object.assign(step, stepUpdate.state);

      this.#setElementStepState(step.element, stepUpdate.state);
    }
  }

  #getStepUpdateData(step, lastVisited) {
    let { selected, visited, disabled, index } = step;
    visited = selected ? true : visited;
    if (visited) {
      lastVisited = index;
    }
    disabled = index > lastVisited + 1;
    const state = { selected, visited, disabled };
    return { state, lastVisited };
  }

  #setElementStepState(element, state) {
    if (element) {
      for (const [key, value] of Object.entries(state)) {
        element.setAttribute(key, value);
      }
    }
  }




  disconnectedCallback() {
    console.log('disconnectedCallback WizardStepper');
  }

  adoptedCallback() {
    console.log('adoptedCallback WizardStepper');
  }

}

customElements.define('app-wizard-stepper', WizardStepper);