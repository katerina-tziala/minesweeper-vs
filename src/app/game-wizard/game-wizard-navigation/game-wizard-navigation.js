"use strict";
import { clone } from "~/_utils/utils.js";

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


  constructor(botMode = false) {
    this.#initNavigationSteps(botMode);
  }

  get #steps() {
    return this.#_navigationSteps;
  }

  #generateSteps(botMode) {
    const steps = [];
    if (botMode) {
      steps.push(new GameWizardNavigationStep(WIZARD_NAME.botMode));
    }
    NAVIGATION_STEPS.forEach(stepName => {
      steps.push(new GameWizardNavigationStep(stepName));
    });
    return steps;
  }

  #initNavigationSteps(botMode) {
    this.#_navigationSteps = this.#generateSteps(botMode);
    
    this.#steps[0].completed = true;
    this.#steps[0].disabled = false;
    this.#steps[0].selected = true;

    
    this.#_selectedStep = this.#steps[0].name;
    this.#setStepsState();
  }

  #setStepsState() {
    this.#steps.forEach((step, index) => {
      const previousSteps = this.#steps.slice(0, index);
      if (previousSteps.length) {
        step.disabled = !previousSteps.every(step => step.completed)
      }
    });
  }


  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);

    console.log(this.#steps);
    console.log(this.#_selectedStep);
    const stepsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.stepsContainer]);

    const fragment = document.createDocumentFragment();
    this.#steps.forEach(step => {
      fragment.append(step.generateView(step));
    })
    stepsContainer.append(fragment);
    container.append(stepsContainer);

    return container;
  }



  

  // #generateNavigationIcon(step) {
  //   const styles = [
  //     DOM_ELEMENT_CLASS.icon,
  //     DOM_ELEMENT_CLASS.iconModifier + step.name
  //   ];

  //   const icon = ElementGenerator.generateContainer(styles, DOM_ELEMENT_ID.icon + step.name);


  //   console.log(step);


  //   return icon;
  // }


}
