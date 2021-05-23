import './wizard-stepper.scss';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS, ARIA_LABEL } from './wizard-stepper.constants';
import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';


import './stepper-list/StepperList';
import { parseBoolean, NumberValidation } from 'UTILS';



export default class WizardStepper extends HTMLElement {
  #container;
  #stepsIndex;
  #stepsList;
  #progressStep = 0;
  #progressBar;

  constructor() {
    super();

  }

  get selectedStep() {
    return this.#stepsList ? this.#stepsList.selectedStep : undefined;
  }

  get #name() {
    return this.getAttribute(ATTRIBUTES.name);
  }

  connectedCallback() {
    const ariaLabel = ARIA_LABEL[this.#name];
    TemplateGenerator.setTemplate(this, TEMPLATE, { ariaLabel });
    
    this.#container = this.querySelector(`.${DOM_ELEMENT_CLASS.container}`);
    this.#stepsList = this.querySelector(`.${DOM_ELEMENT_CLASS.steps}`);

    this.#stepsList.addEventListener('onSelected', () => this.#onStepSelected());
    this.#stepsList.addEventListener('removeFocus', () => {
      console.log('focus on tabpanel');
    });

    this.#progressBar = this.querySelector(`.${DOM_ELEMENT_CLASS.progress}`);
  }

  disconnectedCallback() {
    console.log('disconnectedCallback WizardStepper');
  }

  setSteps(steps) {
    const progressStep = 100 / (steps.length - 1);
    this.#progressStep = Math.round(progressStep * 100) / 100;

    if (this.#stepsList) {
      this.#stepsList.setSteps(steps);
    }
    this.#setProgressBar();
  }

  selectNext() {
    if (this.#stepsList) {
      this.#stepsList.selectNext();
    }
  }

  selectPrevious() {
    if (this.#stepsList) {
      this.#stepsList.selectPrevious();
    }
  }

  #onStepSelected() {
    console.log('onStepSelected');
    this.#setProgressBar();
    console.log(this.selectedStep);
  }

  #setProgressBar() {
    if (this.#progressBar && this.selectedStep) {
      const progress = this.#progressStep * this.selectedStep.index;
      this.#progressBar.setAttribute('progress', progress);
    }
  }

}

customElements.define('app-wizard-stepper', WizardStepper);