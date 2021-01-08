"use strict";

import { Switcher, NumberInput } from "UserInputs";

import { clone } from "~/_utils/utils.js";

import { OptionsSettings } from "GameModels";

import { SettingsWizard } from "../_settings-wizard";
import { WIZARD_NAME } from "../_settings-wizard.constants";

import {
  SETTINGS_PROPERTIES,
  FIELD_NAME,
  LIMITS,
  CONTENT,
  FIELDS_BASED_ON_STRATEGY,
  SNEAK_PEEK_NUMBER_INPUTS
} from "./options-wizard.constants";

export class OptionsWizard extends SettingsWizard {
  constructor(onSubmit, settings) {
    super(onSubmit);
    this.title = CONTENT.title;
    this.labels = CONTENT.labels;
    this.#init(settings);
  }

  get #settingsProperties() {
    if (this.settings && this.settings.vsMode) {
      return SETTINGS_PROPERTIES[this.settings.vsMode];
    }
    return SETTINGS_PROPERTIES.default;
  }

  get #strategy() {
    return this.settings.tileFlagging;
  }

  get #sneakPeekDisabled() {
    return !this.#strategy ? true : this.settings.openStrategy || this.settings.openCompetition;
  }

  get #sneakPeekNumberDisabled() {
    return this.#sneakPeekDisabled ? true : !this.settings.sneakPeek;
  }

  get #controllersBasedOnStrategy() {
    return Object.keys(this.settings)
      .filter(settingName => FIELDS_BASED_ON_STRATEGY.includes(settingName))
      .map(inputName => this.inputsGroup.getController(inputName));
  }

  get #sneakPeekNumberControllers() {
    return SNEAK_PEEK_NUMBER_INPUTS.map(inputName => this.inputsGroup.getController(inputName));
  }

  #sneakPeakBoundaries(fieldName) {
    const limits = clone(LIMITS[fieldName]);
    if (this.#sneakPeekNumberDisabled) {
      limits.min = 0;
    }
    return limits;
  }

  #initSettings(settings) {
    this.settings = new OptionsSettings();
    if (settings) {
      this.settings.update(settings);
    }
  }

  #init(settings) {
    this.#initSettings(settings);
    this.#initControllers();
  }

  #initControllers() {
    this.#settingsProperties.forEach((property) => {
      this.inputsGroup.controllers = this.#generateSettingController(property);
    });
  }

  #generateSettingController(fieldName) {
    switch (fieldName) {
      case FIELD_NAME.tileFlagging:
        return this.#generateSwitcher(
          fieldName,
          this.#onTileFlaggingChange.bind(this),
          false
        );
      case FIELD_NAME.openStrategy:
      case FIELD_NAME.openCompetition:
        return this.#generateSwitcher(
          fieldName,
          this.#onOpenStrategyChange.bind(this)
        );
      case FIELD_NAME.sneakPeek:
        return this.#generateSwitcher(
          fieldName,
          this.#onSneakPeekChange.bind(this),
          this.#sneakPeekDisabled,
        );
      case FIELD_NAME.sneakPeekDuration:
      case FIELD_NAME.sneakPeeksLimit:
        return this.#generateSneakPeekNumberInput(fieldName);
      default:
        return this.#generateSwitcher(fieldName);
    }
  }

  #generateSwitcher(fieldName, action = this.#onOptionSettingChange.bind(this), disabled = !this.#strategy) {
    const params = this.getControllerParams(fieldName);
    const controller = new Switcher(params, action);
    controller.disabled = disabled;
    return controller;
  }

  #generateSneakPeekNumberInput(fieldName) {
    const controller = new NumberInput(fieldName, this.settings[fieldName].toString(), this.#onSneakPeekNumberInputChange.bind(this));
    controller.boundaries = this.#sneakPeakBoundaries(fieldName);
    controller.disabled = this.#sneakPeekNumberDisabled;
    return controller;
  }

  #onTileFlaggingChange(params) {
    this.settings[params.name] = params.value;
    const controllers = this.#controllersBasedOnStrategy;

    if (!this.settings.tileFlagging) {
      controllers.forEach(controller => controller.disable());
      this.#sneakPeekNumberControllers.forEach(controller => controller.disable());
      this.emitChanges();
      return;
    }

    controllers.forEach(controller => controller.enable());
    this.#updateSneakPeekSettings();
  }

  #onOptionSettingChange(params) {
    this.settings[params.name] = params.value;
    this.emitChanges();
  }

  #onOpenStrategyChange(params) {
    this.settings[params.name] = params.value;
    this.#updateSneakPeekSettings();
  }

  #updateSneakPeekSettings() {
    const controller = this.inputsGroup.getController(FIELD_NAME.sneakPeek);
    if (this.#sneakPeekDisabled) {
      this.settings.sneakPeek = false;
      controller.value = false;
      controller.updateSwitcherDisplay();
    }
    this.#sneakPeekDisabled ? controller.disable() : controller.enable();
    this.#updateSneakPeekNumberInputs();
  }

  #onSneakPeekChange(params) {
    this.settings[params.name] = params.value;
    this.#updateSneakPeekNumberInputs();
  }

  #onSneakPeekNumberInputChange(params) {
    if (!params.valid) {
      this.emitChanges();
      return;
    }
    this.#onOptionSettingChange(params);
  }

  #updateSneakPeekNumberInputs() {
    this.#sneakPeekNumberControllers.forEach(controller => this.#updateSneakPeekNumberController(controller));
  }

  #updateSneakPeekNumberController(controller) {
    this.#sneakPeekNumberDisabled ? controller.disable() : controller.enable();
    controller.boundaries = this.#sneakPeakBoundaries(controller.name);
    controller.value = controller.boundaries.min.toString();
    controller.setFieldValue();
    controller.validateInputTypeValue();
  }

  get name() {
    return WIZARD_NAME.optionsSettings;
  }

  get defaultSettings() {
    return {
      name: this.name,
      valid: true,
      value: new OptionsSettings(),
    };
  }

  get data() {
    this.settings.initOptionsBasedOnTileFlagging();
    return super.data;
  }
}
