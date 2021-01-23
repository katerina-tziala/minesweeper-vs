"use strict";

import { Switcher, NumberInput } from "UserInputs";

import { TurnSettings } from "GameModels";

import { SettingsWizard } from "../_settings-wizard";
import { WIZARD_NAME } from "../_settings-wizard.constants";

import { FIELD_NAME, LIMITS, CONTENT } from "./turn-settings-wizard.constants";

export class TurnSettingsWizard extends SettingsWizard {
  constructor(onSubmit, settings) {
    super(onSubmit);
    this.title = CONTENT.title;
    this.labels = CONTENT.labels;
    this.#init(settings);
  }

  get #turnProperties() {
    return Object.keys(FIELD_NAME).filter(
      (key) => FIELD_NAME[key] !== FIELD_NAME.turnTimer,
    );
  }

  get #turnNumberProperties() {
    return this.#turnProperties.filter(
      (key) => FIELD_NAME[key] !== FIELD_NAME.consecutiveTurns,
    );
  }

  get #turnPropertyDisabled() {
    return !this.settings.turnTimer;
  }

  set #controllerDisabledState(controller) {
    this.#turnPropertyDisabled ? controller.disable() : controller.enable();
  }

  #initSettings(settings) {
    this.settings = new TurnSettings();
    if (settings) {
      this.settings.update(settings);
    }
  }
  
  #init(settings) {
    this.#initSettings(settings);
    
    this.inputsGroup.controllers = this.#generateSwitcher(
      FIELD_NAME.turnTimer,
      this.#onTurnTimerChange.bind(this),
    );
    this.#turnNumberProperties.forEach((property) => {
      this.inputsGroup.controllers = this.#generateNumberInput(property);
    });
    this.inputsGroup.controllers = this.#generateSwitcher(
      FIELD_NAME.consecutiveTurns,
      this.#onTurnSettingsChange.bind(this),
      this.#turnPropertyDisabled,
    );
  }

  #generateSwitcher(fieldName, action, disabled = false) {
    const params = this.getControllerParams(fieldName);
    const controller = new Switcher(params, action);
    controller.disabled = disabled;
    return controller;
  }

  #generateNumberInput(fieldName) {
    const controller = new NumberInput(
      fieldName,
      this.settings[fieldName].toString(),
      this.#onTurnSettingsChange.bind(this),
    );
    controller.boundaries = LIMITS[fieldName];
    this.#controllerDisabledState = controller;
    return controller;
  }

  #onTurnTimerChange(params) {
    this.#onTurnSettingsChange(params);
    this.#setConsecutiveTurnsDisabledState();
    this.#turnNumberProperties.forEach((property) => {
      const controller = this.inputsGroup.getController(property);
      this.#controllerDisabledState = controller;
      if (!controller.valid) {
        controller.updateValidFieldValue(this.settings[property]);
      }
    });
  }

  #onTurnSettingsChange(params) {
    if (params.valid) {
      this.settings[params.name] = params.value;
    }
    this.emitChanges();
  }

  #setConsecutiveTurnsDisabledState() {
    const controller = this.inputsGroup.getController(
      FIELD_NAME.consecutiveTurns,
    );
    this.#controllerDisabledState = controller;
  }

  // OVERIDDEN FUNCTIONS
  get name() {
    return WIZARD_NAME.turnSettings;
  }

  get defaultSettings() {
    return {
      name: this.name,
      valid: true,
      value: new TurnSettings(),
    };
  }
}
