"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS, NAVIGATION_STEPS
} from "./game-wizard-navigation.constants";
import { WIZARD_NAME } from "./game-wizard-navigation.constants";
import { GameWizardNavigationStep } from "./game-wizard-navigation-step/game-wizard-navigation-step";

export class GameWizardNavigation {
  #_navigationSteps = [];
  #_selectedStep;
  #onSelectedStep;

  constructor(onSelectedStep, botMode = false, turnsVisible = true) {
    this.#onSelectedStep = onSelectedStep;
    this.#initNavigationSteps(botMode, turnsVisible);
  }

  get selectedStep() {
    return this.#_selectedStep;
  }

  get onLastStep() {
    return this.#steps.length - 1 === this.#currentIndex;
  }

  get onFirstStep() {
    return this.#currentIndex === 0;
  }

  get #steps() {
    return this.#_navigationSteps;
  }

  get #displayedSteps() {
    return this.#steps.filter(step => step.displayed);
  }

  get #currentIndex() {
    return this.#steps.findIndex(step => step.name === this.selectedStep);
  }

  get #optionsStep() {
    return this.#steps.find(step => step.name === WIZARD_NAME.optionsSettings);
  }

  get #turnsStep() {
    return this.#steps.find(step => step.name === WIZARD_NAME.turnSettings);
  }

  get #container() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  }

  #onStepSelection(selectedStep) {
    this.#steps.find(step => step.selected && step.name !== selectedStep.name).setSelected(false);
    this.#_selectedStep = selectedStep.name;
    this.#setStepsState(true);
    this.#submitSelectedStep();
  }

  #submitSelectedStep() {
    if (this.#onSelectedStep) {
      this.#onSelectedStep();
    }
  }

  #generateSteps(botMode) {
    const steps = [];
    if (botMode) {
      steps.push(new GameWizardNavigationStep(WIZARD_NAME.botMode, this.#onStepSelection.bind(this)));
    }
    NAVIGATION_STEPS.forEach(stepName => {
      steps.push(new GameWizardNavigationStep(stepName, this.#onStepSelection.bind(this)));
    });
    return steps;
  }

  #selectFirstStep() {
    this.#steps[0].completed = true;
    this.#steps[0].disabled = false;
    this.#steps[0].selected = true;
    this.#_selectedStep = this.#steps[0].name;
  }

  #initNavigationSteps(botMode, turnsVisible) {
    this.#_navigationSteps = this.#generateSteps(botMode);
  
    if (!turnsVisible) {
      this.#intTurnsStep(false);
    }

    this.#selectFirstStep();
    this.#setStepsState();
  }

  #setStepsState(updateView = false) {
    this.#displayedSteps.forEach((step, index) => {
      const previousSteps = this.#displayedSteps.slice(0, index);
      if (previousSteps.length) {
        step.disabled = !previousSteps.every(step => step.completed);
      }
      if (updateView) {
        step.updateDisabled();
      }
    });
  }

  #generateStepsView() {
    const fragment = document.createDocumentFragment();
    const stepsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.stepsContainer]);
    this.#displayedSteps.forEach(step => {
      stepsContainer.append(step.generateView(step));
    });
    fragment.append(stepsContainer);
    return fragment;
  }

  generateView() {
    const styles = [DOM_ELEMENT_CLASS.container, DOM_ELEMENT_CLASS.containerExpanded];
    const container = ElementGenerator.generateContainer(styles, DOM_ELEMENT_ID.container);
    container.append(this.#generateStepsView());
    return container;
  }

  updateByIndex(step) {
    const newIndex = this.#currentIndex + step;
    const newSelectedStep = this.#displayedSteps[newIndex];
    newSelectedStep.completed = true;
    newSelectedStep.setSelected(true);
    this.#onStepSelection(newSelectedStep);
  }

  #intOptionsStep() {
    const optionsStep = this.#optionsStep;
    optionsStep.completed = false;
  }

  #intTurnsStep(displayed) {
    const turnsStep = this.#turnsStep;
    turnsStep.completed = false;
    turnsStep.displayed = displayed;
  }

  updateOptionsOnVSModeChange(parallelSelected) {
    this.#intOptionsStep();
    this.#intTurnsStep(!parallelSelected);
    this.#setStepsState();

    return this.#container.then(container => {
      container.className = DOM_ELEMENT_CLASS.container;
      ElementHandler.clearContent(container);
      container.append(this.#generateStepsView());
      return container;
    }).then(container => {
      ElementHandler.addStyleClass(container, DOM_ELEMENT_CLASS.containerExpanded);
      return;
    });
  }

}
