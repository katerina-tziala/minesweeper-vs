"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS, NAVIGATION_STEPS
} from "./game-wizard-navigation.constants";
import { WIZARD_NAME } from "GameSettingsWizard";
import { GameWizardNavigationStep } from "./game-wizard-navigation-step/game-wizard-navigation-step";

export class GameWizardNavigation {
  #_navigationSteps = [];
  #_selectedStep;
  #onSelectedStep;

  constructor(onSelectedStep, botMode = false) {
    this.#initNavigationSteps(botMode);
    this.#onSelectedStep = onSelectedStep;
  }

  get #steps() {
    return this.#_navigationSteps;
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

  #onStepSelection(selectedStep) {
    this.#steps.find(step => step.selected && step.name !== selectedStep).setSelected(false);
    this.#setStepsState(true);

    this.#_selectedStep = selectedStep.name;

    if (this.#onSelectedStep) {
      this.#onSelectedStep(this.#_selectedStep);
    }
  }

  #initNavigationSteps(botMode) {
    this.#_navigationSteps = this.#generateSteps(botMode);

    this.#steps[0].completed = true;
    this.#steps[0].disabled = false;
    this.#steps[0].selected = true;

    this.#_selectedStep = this.#steps[0].name;
    this.#setStepsState();
  }

  #setStepsState(updateView = false) {
    this.#steps.forEach((step, index) => {
      const previousSteps = this.#steps.slice(0, index);
      if (previousSteps.length) {
        step.disabled = !previousSteps.every(step => step.completed);
      }
      if (updateView) {
        step.updateDisabled();
      }
    });
  }

  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
    container.append(this.#generateStepsView());
    return container;
  }

  #generateStepsView() {
    const fragment = document.createDocumentFragment();
    const stepsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.stepsContainer]);
    this.#steps.forEach(step => {
      stepsContainer.append(step.generateView(step));
    });
    fragment.append(stepsContainer);
    return fragment;
  }

}
