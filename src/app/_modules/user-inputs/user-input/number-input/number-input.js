"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  valueInLimits,
  emptyString,
  validValue,
} from "../../../../_utils/validator";
import { clone, replaceStringParameter } from "../../../../_utils/utils";

import { TextInput } from "../text-input/text-input";

import {
  DOM_ELEMENT_CLASS,
  FIELD_PARAMS,
  FIELD_ERROR,
  CONTROLL_BUTTONS,
} from "./number-input.constants";

export class NumberInput extends TextInput {
  #boundaries;

  constructor(name, value = TYPOGRAPHY.emptyString, onValueChange) {
    super(name, value, onValueChange);
    this.valid = this.numberValue !== null ? true : false;
    this.disabled = false;
  }

  set boundaries(boundaries) {
    this.#boundaries = boundaries;
  }

  get boundaries() {
    return this.#boundaries;
  }

  get inputParams() {
    const params = clone(FIELD_PARAMS);
    params.className = `${DOM_ELEMENT_CLASS.inputField} ${this.inputClassBasedOnName}`;
    params.autocomplete = "off";
    params.attributes["aria-label"] = replaceStringParameter(
      params.attributes["aria-label"],
      this.name,
    );
    params.attributes.id = this.name;
    return params;
  }

  get valueInteger() {
    return this.value && this.value.trim().match(/^-?[0-9]+$/) !== null
      ? parseInt(this.value, 10)
      : undefined;
  }

  get validNumber() {
    return validValue(this.valueInteger);
  }

  get inputError() {
    return FIELD_ERROR.invalidNumber;
  }

  get boundariesError() {
    let message = FIELD_ERROR.outOfLimits;
    Object.keys(this.boundaries).forEach((key) => {
      message = replaceStringParameter(message, this.boundaries[key], key);
    });
    return message;
  }

  get controllsID() {
    return (
      DOM_ELEMENT_CLASS.inputControls + TYPOGRAPHY.doubleUnderscore + this.name
    );
  }

  get submissionProperties() {
    return {
      name: this.name,
      value: this.valueInteger,
      valid: this.valid,
    };
  }

  generateInputField() {
    const inputContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.inputContainer,
    ]);
    const input = this.generateField(this.onKeyUp.bind(this));
    ElementHandler.setReadOnly(input, this.disabled);
    const error = this.errorController.generateInputError();
    const inputControlls = this.generateInputControlls();
    inputContainer.append(input, inputControlls, error);
    return inputContainer;
  }

  generateInputControlls() {
    const inputControlls = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.inputControls],
      this.controllsID,
    );
    const upButton = ElementGenerator.generateButton(
      CONTROLL_BUTTONS.up,
      () => {
        this.updateValue(1);
      },
    );
    ElementHandler.setDisabled(upButton, this.disabled);
    inputControlls.append(upButton);
    const downButton = ElementGenerator.generateButton(
      CONTROLL_BUTTONS.down,
      () => {
        this.updateValue(-1);
      },
    );
    ElementHandler.setDisabled(downButton, this.disabled);
    inputControlls.append(downButton);
    return inputControlls;
  }

  onKeyUp(event) {
    const keyCode = event.keyCode || event.which;
    switch (keyCode) {
      case 38: // Up Arrow
      case 39: // Right Arrow
        this.updateValue(1);
        break;
      case 40: // Down Arrow
      case 37: // Left Arrow
        this.updateValue(-1);
        break;
      default:
        this.onValueChange(event);
        break;
    }
  }

  updateValue(step) {
    if (emptyString(this.value)) {
      const newValue = this.getInitialValueWhenFieldIsCleared(step);
      this.value = newValue.toString();
      this.setFieldValue();
      this.validateValue();
      return;
    }
    if (this.validNumber) {
      this.value = this.getValueBasedOnStep(step).toString();
      this.setFieldValue();
      this.validateValue();
    }
  }

  getInitialValueWhenFieldIsCleared(step) {
    if (this.boundaries) {
      const newValue = step > 0 ? this.boundaries.max : this.boundaries.min;
      return newValue;
    }
    return 0;
  }

  getValueBasedOnStep(step = 0) {
    let newValue = this.valueInteger + step;
    if (this.boundaries && this.boundaries.max < newValue) {
      return this.boundaries.min;
    }
    if (this.boundaries && this.boundaries.min > newValue) {
      return this.boundaries.max;
    }
    return newValue;
  }

  validateInputTypeValue() {
    if (!this.validNumber) {
      this.valid = false;
      this.showError();
      this.notifyForChanges();
      return;
    }
    if (!this.valueInLimits()) {
      this.onValueOutOfLimits();
      return;
    }
    this.updateValidFieldValue();
    this.notifyForChanges();
  }

  onValueOutOfLimits() {
    this.valid = false;
    this.value = this.valueInteger.toString();
    this.setFieldValue();
    this.showError(this.boundariesError);
    this.notifyForChanges();
  }

  valueInLimits() {
    return this.boundaries
      ? valueInLimits(this.valueInteger, this.boundaries)
      : true;
  }

  showError(message = this.inputError) {
    super.showError(message);
    this.toggleControllButtons();
  }

  hideError() {
    super.hideError();
    this.toggleControllButtons(true);
  }

  toggleControllButtons(show = false) {
    ElementHandler.getByID(this.controllsID).then((controllsContainer) => {
      show
        ? ElementHandler.display(controllsContainer)
        : ElementHandler.hide(controllsContainer);
    });
  }

  disable() {
    this.disabled = true;
    this.inputField.then((inputField) => {
      ElementHandler.setReadOnly(inputField, this.disabled);
    });
    this.updateControllButtonsState();
  }

  enable() {
    this.disabled = false;
    this.inputField.then((inputField) => {
      ElementHandler.setReadOnly(inputField, this.disabled);
    });
    this.updateControllButtonsState();
  }

  updateControllButtonsState() {
    document
      .querySelectorAll(`.${DOM_ELEMENT_CLASS.inputControlBtn}`)
      .forEach((button) => ElementHandler.setDisabled(button, this.disabled));
  }

  updateValidFieldValue(value = this.valueInteger) {
    this.valid = true;
    this.value = value.toString();
    this.setFieldValue();
    this.hideError();
  }
}
