"use strict";

import { ElementHandler } from "HTML_DOM_Manager";

export class UserInput {
  #name;
  #value;
  #valid;
  #disabled;
  #onValueChange;

  constructor(name, value, onValueChange) {
    this.name = name;
    this.value = value;
    this.#onValueChange = onValueChange;
  }

  set name(value) {
    this.#name = value;
  }

  get name() {
    return this.#name;
  }

  set value(value) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  set valid(value) {
    this.#valid = value;
  }

  get valid() {
    return this.#valid;
  }

  set disabled(state) {
    this.#disabled = state;
  }

  get disabled() {
    return this.#disabled;
  }

  get inputField() {
    return ElementHandler.getByID(this.name);
  }

  get submissionProperties() {
    return {
      name: this.name,
      value: this.value,
      valid: this.valid,
    };
  }

  notifyForChanges() {
    if (this.#onValueChange) {
      this.#onValueChange(this.submissionProperties);
    }
  }

  generateField(inputAction) {
    const inputField = document.createElement("input");
    inputField.name = this.name;
    inputField.value = this.value;

    const params = this.inputParams;
    if (inputAction) {
      inputField.addEventListener(params.actionType, inputAction);
    }
    delete params.actionType;

    ElementHandler.setParams(inputField, params);
    return inputField;
  }
}
