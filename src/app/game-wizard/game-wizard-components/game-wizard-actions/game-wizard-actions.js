"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTONS,
} from "./game-wizard-actions.constants";

export class GameWizardActions {
  #previousDisabled = true;
  #submissionDisabled = false;
  #nextButtonOnActions = true;
  #resetDisabled = true;
  #invite;
  #onReset;
  #onSubmit;
  #onStepChange;

  constructor(actions, invite = false) {
    this.#onReset = actions.onReset;
    this.#onSubmit = actions.onSubmit;
    this.#onStepChange = actions.onStepChange;
    this.#invite = invite;
  }

  get #stepChange() {
    return this.#onStepChange ? true : false;
  }

  get #submissionButton() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.submitButton);
  }

  get #backButton() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.backButton);
  }

  get #resetButton() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.resetButton);
  }

  #generateActionButtonsWithStepChange() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#generateBackButton());
    fragment.append(this.#generateResetButton());
    fragment.append(this.#generateNextButton());
    return fragment;
  }

  #generateActionButtons() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#generateResetButton());
    fragment.append(this.#generateSubmissionButton());
    return fragment;
  }

  #generateBackButton() {
    const button = ElementGenerator.generateButton(BUTTONS.back, this.#onBack.bind(this));
    ElementHandler.setDisabled(button, this.#previousDisabled);
    return button;
  }

  #generateNextButton() {
    const button = ElementGenerator.generateButton(BUTTONS.next, this.#onNext.bind(this));
    ElementHandler.setID(button, DOM_ELEMENT_ID.submitButton);
    return button;
  }

  #onBack() {
    this.#submitStepChange(-1);
  }

  #onNext() {
    this.#submitStepChange(1);
  }

  #submitStepChange(value) {
    if (this.#stepChange) {
      this.#onStepChange(value);
    }
  }

  #generateResetButton() {
    const button = ElementGenerator.generateButton(BUTTONS.reset, this.#onResetAction.bind(this));
    ElementHandler.setID(button, DOM_ELEMENT_ID.resetButton);
    ElementHandler.setDisabled(button, this.#resetDisabled);
    return button;
  }

  updateResetButtonState(disabled) {
    if (this.#resetDisabled !== disabled) {
      this.#resetDisabled = disabled;
      return this.#resetButton.then((button) => {
        ElementHandler.setDisabled(button, this.#resetDisabled);
        return;
      });
    }
    return Promise.resolve();
  }

  updateResetAndSubmissionButton(resetDisabled, submissionDisabled) {
    return Promise.all([
      this.updateResetButtonState(resetDisabled),
      this.updateSubmissionButtonState(submissionDisabled),
    ]);
  }

  #onResetAction() {
    if (this.#onReset) {
      this.#onReset();
    }
    this.updateSubmissionButtonState(false);
  }

  #generateSubmissionButton() {
    const buttonParams = this.#invite ? BUTTONS.invite : BUTTONS.play;
    const button = ElementGenerator.generateButton(buttonParams, this.#onSubmit.bind(this));
    ElementHandler.setID(button, DOM_ELEMENT_ID.submitButton);
    return button;
  }

  #changeSubmissionButton(newButton) {
    return this.#submissionButton.then(button => {
      button.before(newButton);
      button.remove();
      return;
    });
  }

  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container]);
    if (this.#stepChange) {
      container.append(this.#generateActionButtonsWithStepChange());
    } else {
      container.append(this.#generateActionButtons());
    }
    return container;
  }

  setSubmissionButton() {
    if (this.#nextButtonOnActions) {
      const submissionButton = this.#generateSubmissionButton();
      return this.#changeSubmissionButton(submissionButton).then(() => {
        this.#nextButtonOnActions = false;
        return;
      });
    }
    return Promise.resolve();
  }

  setNextButton() {
    if (!this.#nextButtonOnActions) {
      const nextButton = this.#generateNextButton();
      return this.#changeSubmissionButton(nextButton).then(() => {
        this.#nextButtonOnActions = true;
        return;
      });
    }
    return Promise.resolve();
  }

  updateBackButtonState(newState) {
    if (newState !== this.#previousDisabled) {
      this.#previousDisabled = newState;
      return this.#backButton.then(button => {
        ElementHandler.setDisabled(button, this.#previousDisabled);
        return;
      });
    }
    return Promise.resolve();
  }

  updateActionButtons(backDisabled, submissionButton) {
    const updates = [
      this.updateBackButtonState(backDisabled)
    ];

    submissionButton
      ? updates.push(this.setSubmissionButton())
      : updates.push(this.setNextButton());

    return Promise.all(updates);
  }

  updateSubmissionButtonState(disabled) {
    if (this.#submissionDisabled !== disabled) {
      this.#submissionDisabled = disabled;
      return this.#submissionButton.then(button => {
        ElementHandler.setDisabled(button, this.#submissionDisabled);
        return;
      });
    }
    return Promise.resolve();
  }
}
