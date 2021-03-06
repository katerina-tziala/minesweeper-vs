"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { UserInputsGroupController } from "UserInputs";
import { DOM_ELEMENT_CLASS } from "./_settings-wizard.constants";

export class SettingsWizard {
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

  get name() {
    return TYPOGRAPHY.emptyString;
  }

  settingsPropertyExists(propertyName) {
    return Object.keys(this.settings).includes(propertyName);
  }

  getControllerParams(name) {
    return {
      name: name,
      value: this.settingsPropertyExists(name)
        ? this.settings[name]
        : TYPOGRAPHY.emptyString,
    };
  }

  getDropdownSelectParams(name, enumObject) {
    const params = this.getControllerParams(name);
    params.options = this.getEnumOptions(enumObject);
    return params;
  }

  getEnumOptions(enumObject) {
    return Object.values(enumObject).map((enumValue) =>
      this.getDropdownOptions(enumValue),
    );
  }

  getDropdownOptions(enumValue) {
    return {
      value: enumValue,
      innerHTML: `<span>${this.getOptionLabel(enumValue)}</span>`,
    };
  }

  getOptionLabel(enumValue) {
    return enumValue;
  }

  updateSettings(params) {
    if (params.valid) {
      this.settings[params.name] = params.value;
    }
  }

  emitChanges() {
    this.onSubmit(this.data);
  }

  get isValid() {
    return this.inputsGroup.isValid;
  }
  
  get data() {
    return {
      name: this.name,
      valid: this.isValid,
      value: this.settings,
    };
  }

  // INTERFACE
  get titleStyleClass() {
    return (
      DOM_ELEMENT_CLASS.wizardTitleIcon + TYPOGRAPHY.doubleHyphen + this.name
    );
  }

  generateSettingsWizard() {
    const fragment = document.createDocumentFragment();
    const wizardContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.wizardContainer,
    ]);
    wizardContainer.append(this.generateWizardTitle());
    wizardContainer.append(this.generateWizardInputs());
    fragment.append(wizardContainer);
    return fragment;
  }

  generateWizardTitle() {
    const titleContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardTitleContainer]);
    const titleIcon = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardTitleIcon, this.titleStyleClass]);
    const title = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardTitle]);
    title.innerHTML = this.title;
    titleContainer.append(titleIcon, title);
    return titleContainer;
  }

  generateWizardInputs() {
    const fragment = document.createDocumentFragment();
    this.inputsGroup.controllers.forEach((controller) => {
      fragment.append(this.generateInputSection(controller));
    });
    return fragment;
  }

  generateInputSection(controller) {
    const sectionContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.sectionContainer,
    ]);
    const label = this.generateSectionLabel(controller.name);
    const fieldContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.fieldContainer,
    ]);
    fieldContainer.append(controller.generateInputField());
    sectionContainer.append(label, fieldContainer);
    return sectionContainer;
  }

  getFieldExplanationID(fieldName) {
    return (
      DOM_ELEMENT_CLASS.sectionContainer +
      TYPOGRAPHY.doubleUnderscore +
      fieldName
    );
  }

  getFieldExplanationContainer(fieldName) {
    return ElementHandler.getByID(this.getFieldExplanationID(fieldName));
  }

  generateFieldExplanation(fieldName, explanation) {
    const fieldExplanation = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.fieldExplanation],
      this.getFieldExplanationID(fieldName),
    );
    fieldExplanation.innerHTML = explanation;
    return fieldExplanation;
  }

  generateSectionLabel(inputName) {
    const label = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.label]);
    label.innerHTML = this.labels[inputName];
    return label;
  }
}
