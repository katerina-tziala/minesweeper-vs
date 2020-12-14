"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTONS,
} from "./game-wizard-stepper.constants";
import { EndButtonType } from "./game-wizard-stepper-end-button-type.enum";
export class GameWizardStepper {
  #_submissionType;
  #_steps;
  #_currentStep;
  #onReset;
  #onSubmit;
  #onStepChange;

  constructor(actions, steps = 1, submissionType = EndButtonType.play) {
    this.#onReset = actions.onReset;
    this.#onSubmit = actions.onSubmit;
    this.#onStepChange = actions.onStepChange;
    this.#steps = steps;
    this.#submissionType = submissionType;
    this.#currentStep = 1;
  }

  set #submissionType(submissionType) {
    this.#_submissionType = submissionType;
  }

  get #submissionType() {
    return this.#_submissionType;
  }

  set #steps(steps) {
    this.#_steps = steps;
  }

  set #currentStep(currentStep) {
    this.#_currentStep = currentStep;
  }

  get #navigationAllowed() {
    return this.steps !== 1;
  }

  get #onFinalStep() {
    return this.currentStep === this.steps;
  }

  get #onSemiFinalStep() {
    return this.currentStep === this.steps - 1;
  }

  get #onFirstStep() {
    return this.currentStep === 1;
  }

  get #onSecondStep() {
    return this.currentStep === 2;
  }

  get #submissionButton() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.submitButton);
  }

  get #actionButtons() {
    let actionButtons = [];
    const resetButton = ElementGenerator.generateButton(
      BUTTONS.reset,
      this.#resetStep.bind(this),
    );
    actionButtons.push(resetButton);
    this.#navigationAllowed
      ? this.#addNavigationButtons(actionButtons)
      : actionButtons.push(this.#generateSubmissionButton());
    return actionButtons;
  }

  #addNavigationButtons(actionButtons) {
    const previousBtn = ElementGenerator.generateButton(
      BUTTONS.previous,
      this.#onPrevious.bind(this),
    );
    ElementHandler.setDisabled(previousBtn, this.#onFirstStep);
    actionButtons.unshift(previousBtn);
    const nextBtn = this.#generateSubmissionButton(EndButtonType.next);
    actionButtons.push(nextBtn);
  }

  #generateSubmissionButton(type = this.#submissionType) {
    const button = ElementGenerator.generateButton(
      BUTTONS[type],
      this.#onNext.bind(this),
    );
    ElementHandler.setID(button, DOM_ELEMENT_ID.submitButton);
    return button;
  }

  #addActionButtons(actionsContainer) {
    const buttons = this.#actionButtons;
    buttons.forEach((button) => actionsContainer.append(button));
  }

  #onPrevious() {
    this.#currentStep = this.currentStep - 1;
    if (this.#onFirstStep) {
      this.#setPreviousButtonDisabled();
    }
    if (this.#onSemiFinalStep) {
      this.#setSubmissionStyle(EndButtonType.next);
    }
    this.#onStepChange(this.currentStep);
  }

  #onNext() {
    if (this.#onFinalStep) {
      this.#onSubmit();
      return;
    }
    this.#moveToNextStep();
  }

  #moveToNextStep() {
    this.#currentStep = this.currentStep + 1;
    if (this.#onSecondStep) {
      this.#setPreviousButtonDisabled();
    }
    if (this.#onFinalStep) {
      this.#setSubmissionStyle();
    }
    this.#onStepChange(this.currentStep);
  }

  #setPreviousButtonDisabled() {
    ElementHandler.getByID(DOM_ELEMENT_ID.previousButton).then(
      (previousBtn) => {
        ElementHandler.setDisabled(previousBtn, this.#onFirstStep);
      },
    );
  }

  #setSubmissionStyle(type = this.#submissionType) {
    this.#submissionButton.then((button) => {
      const buttonParams = BUTTONS[type];
      button.className = buttonParams.className;
      ElementHandler.setAttributes(button, buttonParams.attributes);
    });
  }

  #resetStep() {
    this.submissionButtonDisabled = false;
    this.#onReset();
  }

  // PUBLIC FUNCTIONS
  get steps() {
    return this.#_steps;
  }

  get currentStep() {
    return this.#_currentStep;
  }

  set submissionButtonDisabled(state) {
    this.#submissionButton.then((button) =>
      ElementHandler.setDisabled(button, state),
    );
  }

  generateStepper() {
    const fragment = document.createDocumentFragment();
    const stepperContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.container,
    ]);
    this.#addActionButtons(stepperContainer);
    fragment.append(stepperContainer);
    return fragment;
  }

  updateNumberOfSteps(steps) {
    if (this.#navigationAllowed) {
      this.#steps = steps;
      this.#currentStep =
        this.steps < this.currentStep ? this.steps : this.currentStep;
      if (this.#onFinalStep) {
        this.#setSubmissionStyle();
      }
    }
  }
}
