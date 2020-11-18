"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { clone } from "~/_utils/utils";
import { DropdownSelect, Switcher } from "UserInputs";

import { UserInputsGroupController } from "UserInputs";
import { DOM_ELEMENT_CLASS, CONTENT } from "./game-settings-wizard.constants";

export class GameSettingsWizard {
  #settings;
  #inputsGroup;

  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.#inputsGroup = new UserInputsGroupController();
  }

  get inputsGroup() {
    return this.#inputsGroup;
  }

  set settings(settings) {
    this.#settings = settings;
  }

  get settings() {
    return this.#settings;
  }

  getDropdownSelectParams(name, enumObject) {
    return {
      name: name,
      value: this.settings[name] ? this.settings[name] : TYPOGRAPHY.emptyString,
      options: this.getEnumOptions(enumObject)
    };
  }

  getEnumOptions(enumObject) {
    return Object.values(enumObject).map(enumValue => this.getDropdownOptions(enumValue));
  }

  getDropdownOptions(enumValue) {
    return {
      value: enumValue,
      innerHTML: `<span>${this.getModeLabel(enumValue)}</span>`
    };
  }

  getModeLabel(enumValue) {
    return enumValue;
  }

  generateSettingsWizard() {
    const wizardContainer = ElementGenerator.generateContainer();
    wizardContainer.append(this.generateWizardInputs());
    return wizardContainer;
  }

  generateWizardInputs() {
    const fragment = document.createDocumentFragment();
    this.inputsGroup.inputControllers.forEach(controller => {
      fragment.append(this.generateInputSection(controller));
    });
    return fragment;
  }

  generateInputSection(controller) {
    const sectionContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.sectionContainer]);
    const label = this.generateSectionLabel(controller.name);
    const fieldContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.fieldContainer]);
    fieldContainer.append(controller.generateInputField());
    sectionContainer.append(label, fieldContainer);
    return sectionContainer;
  }

  getFieldExplanationID(fieldName) {
    return DOM_ELEMENT_CLASS.sectionContainer + TYPOGRAPHY.doubleUnderscore + fieldName;
  }

  getFieldExplanationContainer(fieldName) {
    return ElementHandler.getByID(this.getFieldExplanationID(fieldName));
  }

  generateFieldExplanation(fieldName, explanation) {
    const fieldExplanation = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.fieldExplanation], this.getFieldExplanationID(fieldName));
    fieldExplanation.innerHTML = explanation;
    return fieldExplanation;
  }

  generateSectionLabel(inputName) {
    const label = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.label]);
    label.innerHTML = CONTENT[inputName];
    return label;
  }

  emitChanges() {
    this.onSubmit({
      valid: this.inputsGroup.isValid,
      value: this.settings
    });
  }

}
