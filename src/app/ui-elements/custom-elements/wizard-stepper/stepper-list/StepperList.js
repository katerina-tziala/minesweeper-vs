import '../stepper-step/StepperStep';
import './stepper-list.scss';
import { TEMPLATES } from './stepper-list.constants';
import { AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';
import { getNextPositionInArray, lastPositionInArray } from 'UTILS';

export default class StepperList extends HTMLElement {
  #stepsIndex;
  #navigationHandler;
  #eventListeners;

  constructor() {
    super();
    this.#eventListeners = new Map();
    this.#navigationHandler = new Map();
    this.#navigationHandler.set('home', this.#homeNavigation.bind(this));
    this.#navigationHandler.set('end', this.#endNavigation.bind(this));
    this.#navigationHandler.set('arrowright', this.#arrowRightNavigation.bind(this));
    this.#navigationHandler.set('arrowleft', this.#arrowLeftNavigation.bind(this));
    this.#navigationHandler.set('tab', this.#onTab.bind(this));
  }

  get steps() {
    return this.#stepsIndex ? Array.from(this.#stepsIndex.values()) : [];
  }

  get selectedStep() {
    return this.steps.find(step => step.selected);
  }

  get #activeSteps() {
    return this.steps.filter(step => !step.disabled);
  }

  connectedCallback() {
    AriaHandler.setRole(this, 'tablist');
    AriaHandler.setFocusable(this, true);
    this.#setListener('keydown', this.#onKeyDown.bind(this));
    this.#setListener('focus', this.#onFocus.bind(this));
  }

  disconnectedCallback() {
    for (const [actionType, action] of this.#eventListeners) {
      this.removeEventListener(actionType, action);
      this.#eventListeners.delete(actionType);
    }
  }

  setSteps(steps) {
    this.#initSteps(steps);
    this.innerHTML = '';
    for (let step of this.#stepsIndex.values()) {
      this.append(step.element);
    }
  }

  selectNext() {
    const index = this.selectedStep ? this.selectedStep.index : 0;
    const lastPosition = lastPositionInArray(this.#activeSteps);
    if (index !== lastPosition) {
      this.#selectByIndex(index + 1);
    }
  }

  selectPrevious() {
    const index = this.selectedStep ? this.selectedStep.index : 0;
    if (index !== 0) {
      this.#selectByIndex(index - 1);
    }
  }

  #selectByIndex(index) {
    const nextStep = !this.selectedStep ? this.#activeSteps[0] : this.#activeSteps[index];
    if (nextStep) {
      this.#onOptionSelected(nextStep.name);
    }
  }

  #setListener(actionType, action) {
    this.#eventListeners.set(actionType, action);
    this.addEventListener(actionType, this.#eventListeners.get(actionType));
  }

  #initSteps(steps) {
    const selectedStep = steps.find(step => step.selected);
    if (!selectedStep) {
      steps[0].selected = true;
    }
    this.#setStepsIndex(steps);
  }

  #setStepsIndex(steps) {
    this.#stepsIndex = new Map();

    let lastVisited = 0;
    for (let index = 0; index < steps.length; index++) {
      const stepData = steps[index];
      let step = { ...stepData, index };
      step.id = `step-tab--${step.name}`;
      step.controls = `tab-${step.name}`;
      const stepUpdate = this.#getStepUpdateData(step, lastVisited);
      lastVisited = stepUpdate.lastVisited;

      step = Object.assign(step, stepUpdate.state);

      const element = this.#generateStep(step);
      this.#stepsIndex.set(step.name, { ...step, element });
    }
  }

  #generateStep(step) {
    const template = TemplateGenerator.generate(TEMPLATES.step, step);
    const stepItem = template.children[0];
    stepItem.addEventListener('onSelected', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.#onOptionSelected(event.detail.name);
    });
    return stepItem;
  }

  #onOptionSelected(name) {
    this.#clearFocusFromSteps();
    this.#updateStepsSelection(name);
    this.selectedStep.element.focus();
    this.#submitValueChange();
  }

  #updateStepsSelection(selectedKey) {
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

  #clearFocusFromSteps() {
    this.steps.forEach(step => step.element.blur());
  }

  #onFocus(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#clearFocusFromSteps();
    if (this.selectedStep) {
      this.selectedStep.element.focus();
    }
  }

  /** TAB KEY
  * When the tab list contains the focus, moves focus to the next element in the tab sequence, which is the tabpanel element.
  */
  #onKeyDown(event) {
    const actionKey = event.key.toLowerCase();
    const stepName = event.target.getAttribute('name');
    if (this.#stepsIndex && this.#stepsIndex.size && this.#navigationHandler.has(actionKey)) {
      event.preventDefault();
      event.stopPropagation();
      event.target.blur();
      this.#navigationHandler.get(actionKey)(stepName);
    }
  }

  /**
  * When the tab list contains the focus, moves focus to the next element in the tab sequence, which is the tabpanel element.
  */
  #onTab() {
    this.#clearFocusFromSteps();
    this.blur();
    const event = new CustomEvent('removeFocus');
    this.dispatchEvent(event);
  }

  /**
  * When a tab has focus, moves focus to the first tab.
  */
  #homeNavigation() {
    const firstStep = this.steps[0];
    firstStep.element.focus();
  }

  /**
  * When a tab has focus, moves focus to the last active tab.
  */
  #endNavigation() {
    const activeSteps = this.#activeSteps;
    const position = lastPositionInArray(activeSteps);
    const lastStep = activeSteps[position];
    lastStep.element.focus();
  }

  /**
  * When a tab has focus, moves focus to the next tab.
  * If focus is on the last tab, moves focus to the first tab.
  */
  #arrowRightNavigation(stepName) {
    this.#linearNavigation(stepName, 1);
  }

  /**
  * When a tab has focus, moves focus to the previous tab.
  * If focus is on the first tab, moves focus to the last tab.
  */
  #arrowLeftNavigation(stepName) {
    this.#linearNavigation(stepName, -1);
  }

  #linearNavigation(stepName, step) {
    const currentFocusedStep = this.#stepsIndex.get(stepName);
    const nextPosition = getNextPositionInArray(this.#activeSteps, currentFocusedStep.index, step);
    const nextStep = this.#activeSteps[nextPosition];
    nextStep.element.focus();
  }

  #submitValueChange() {
    const event = new CustomEvent('onSelected', { detail: this.selectedStep });
    this.dispatchEvent(event);
  }
}

customElements.define('app-stepper-list', StepperList);