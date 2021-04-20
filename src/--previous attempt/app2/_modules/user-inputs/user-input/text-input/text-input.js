"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementGenerator } from "HTML_DOM_Manager";

import { emptyString, valueDefined } from "~/_utils/validator";
import { clone, replaceStringParameter } from "~/_utils/utils";

import {
  DOM_ELEMENT_CLASS,
  FIELD_PARAMS,
  FIELD_ERRORS,
  VALUE_LENGTH
} from "./text-input.constants";

import { UserInput } from "../user-input";
import { InputError } from "../../input-error/input-error";

export class TextInput extends UserInput {
  #errorController;
  #minLength = VALUE_LENGTH.min;
  #maxLength = VALUE_LENGTH.max;

  constructor(name, value = TYPOGRAPHY.emptyString, onValueChange) {
    super(name, value, onValueChange);
    this.valid = this.value && this.value.length !== 0;
    this.errorController = new InputError(this.name);
  }

  set errorController(errorController) {
    this.#errorController = errorController;
  }

  get errorController() {
    return this.#errorController;
  }

  get inputClassBasedOnName() {
    return DOM_ELEMENT_CLASS.inputField + TYPOGRAPHY.doubleHyphen + this.name;
  }

  get inputParams() {
    const params = clone(FIELD_PARAMS);
    params.placeholder = replaceStringParameter(params.placeholder, this.name);
    params.className = `${DOM_ELEMENT_CLASS.inputField} ${this.inputClassBasedOnName}`;
    params.autocomplete = "off";
    params.attributes["aria-label"] = replaceStringParameter(
      params.attributes["aria-label"],
      this.name,
    );
    params.attributes.id = this.name;
    return params;
  }

  get #minLengthError() {
    const errorMessage = this.#fieldError(FIELD_ERRORS.minLength);
    return replaceStringParameter(errorMessage, this.#minLength);
  }

  get #maxLengthError() {
    const errorMessage = this.#fieldError(FIELD_ERRORS.maxLength);
    return replaceStringParameter(errorMessage, this.#maxLength);
  }

  setLengthBoundaries(minLength = VALUE_LENGTH.min, maxLength = VALUE_LENGTH.max) {
    this.#minLength = minLength;
    this.#maxLength = maxLength;
  }

  generateInputField() {
    const inputContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.inputContainer,
    ]);
    const input = this.generateField(this.onValueChange.bind(this));
    const error = this.errorController.generateInputError();
    inputContainer.append(input, error);
    return inputContainer;
  }

  onValueChange(event) {
    const newValue = event.target.value;
    if (this.value !== newValue) {
      this.value = newValue;
      this.validateValue();
    }
  }

  onFieldCleared() {
    this.hideError();
    this.valid = false;
    this.notifyForChanges();
  }

  validateValue() {
    if (this.value.length === 0) {
      this.onFieldCleared();
      return;
    }
    this.validateInputTypeValue();
  }

  validateInputTypeValue() {
    const trimmedValue = this.value.trim();

    if (emptyString(trimmedValue)) {
      this.valid = false;
      this.showError(this.#fieldError());
    } else if (trimmedValue.length < this.#minLength) {
      this.valid = false;
      this.showError(this.#minLengthError);
    } else if (valueDefined(this.#maxLength) && trimmedValue.length > this.#maxLength) {
      this.valid = false;
      this.showError(this.#maxLengthError);
    } else {
      this.value = trimmedValue;
      this.hideError();
      this.valid = true;
    }
  
    this.notifyForChanges();
  }

  #fieldError(message = FIELD_ERRORS.empty) {
    return replaceStringParameter(message, this.name);
  }

  showError(message) {
    this.errorController.show(message);
  }

  hideError() {
    this.errorController.hide();
  }

  clear() {
    this.value = TYPOGRAPHY.emptyString;
    this.setFieldValue();
    this.valid = false;
    this.hideError();
  }

  setFieldValue() {
    this.inputField.then((field) => (field.value = this.value));
  }
}
