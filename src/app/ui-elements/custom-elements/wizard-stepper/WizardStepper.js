import './wizard-stepper.scss';
import './stepper-list/StepperList';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS, ARIA_LABEL } from './wizard-stepper.constants';
import { ElementHandler, TemplateGenerator } from 'UI_ELEMENTS';

export default class WizardStepper extends HTMLElement {
  #container;
  #stepsList;
  #progressStep = 0;
  #progressBar;
  #timeout;

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
    this.#stepsList.addEventListener('stepsUpdated', () => this.#onStepsInit());
    this.#stepsList.addEventListener('onSelected', () => this.#onStepSelected());
    this.#stepsList.addEventListener('removeFocus', () => this.dispatchEvent(new CustomEvent('onRemoveFocus')));
    this.#progressBar = this.querySelector(`.${DOM_ELEMENT_CLASS.progress}`);
  }

  setSteps(steps) {
    if (!this.#container || !this.#stepsList) {
      return;
    }
    clearTimeout(this.#timeout);
    ElementHandler.removeStyleClass(this.#container, DOM_ELEMENT_CLASS.filled);
    const progressStep = 100 / (steps.length - 1);
    this.#progressStep = Math.round(progressStep * 100) / 100;
    this.#stepsList.setSteps(steps);
  }

  #onStepsInit() {
    this.#setProgressBar();
    this.#timeout = setTimeout(() => {
      ElementHandler.addStyleClass(this.#container, DOM_ELEMENT_CLASS.filled);
      this.#submitValueChange();
    }, 200);
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
    this.#setProgressBar();
    this.#submitValueChange();
  }

  #setProgressBar() {
    if (this.#progressBar && this.selectedStep) {
      const progress = this.#progressStep * this.selectedStep.index;
      this.#progressBar.setAttribute('progress', progress);
    }
  }

  #submitValueChange() {
    const event = new CustomEvent('onStepSelected', { detail: this.selectedStep });
    this.dispatchEvent(event);
  }
}

customElements.define('app-wizard-stepper', WizardStepper);