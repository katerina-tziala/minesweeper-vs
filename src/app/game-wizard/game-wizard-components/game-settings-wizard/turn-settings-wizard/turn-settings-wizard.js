"use strict";

import { clone } from "~/_utils/utils.js";
import { Switcher, NumberInput } from "UserInputs";

import { TurnSettings } from "GameModels";

import { SettingsWizard } from "../_settings-wizard";
import { WIZARD_NAME } from "../_settings-wizard.constants";

import { FIELD_NAME, BOUNDARIES, CONTENT } from "./turn-settings-wizard.constants";

export class TurnSettingsWizard extends SettingsWizard {
  constructor(onSubmit, settings) {
    super(onSubmit);
    this.title = CONTENT.title;
    this.labels = CONTENT.labels;
    this.#init(settings);
  }

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

    this.inputsGroup.controllers = this.#generateNumberInput(FIELD_NAME.turnDuration);
    this.inputsGroup.controllers = this.#generateNumberInput(FIELD_NAME.missedTurnsLimit);

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

  #getBoundaries(fieldName) {
    let boundaries = clone(BOUNDARIES[fieldName]);
    if (this.#turnPropertyDisabled) {
      boundaries.min = 0;
    }
    return boundaries;
  }

  #generateNumberInput(fieldName) {
    const controller = new NumberInput(
      fieldName,
      this.settings[fieldName].toString(),
      this.#onTurnSettingsChange.bind(this),
    );
    controller.boundaries = this.#getBoundaries(fieldName);
    controller.disabled = this.#turnPropertyDisabled;
    return controller;
  }

  get #durationController() {
    return this.inputsGroup ? this.inputsGroup.getController(FIELD_NAME.turnDuration) : undefined;
  }

  get #missedTurnsController() {
    return this.inputsGroup ? this.inputsGroup.getController(FIELD_NAME.missedTurnsLimit) : undefined;
  }

  #onTurnTimerChange(params) {
    this.#onTurnSettingsChange(params);
    this.#setConsecutiveTurnsDisabledState();
    this.#updateNumberController(this.#durationController);
    this.#updateNumberController(this.#missedTurnsController);
  }

  #updateNumberController(controller) {
    const boundaries = this.#getBoundaries(controller.name);
    this.#turnPropertyDisabled ? controller.disable() : controller.enable();
    controller.boundaries = boundaries;
    controller.value = controller.boundaries.min.toString();
    controller.setFieldValue();
    controller.validateInputTypeValue();
  }

  #onTurnSettingsChange(params) {
    this.updateSettings(params);
    this.emitChanges();
  }

  #setConsecutiveTurnsDisabledState() {
    const controller = this.inputsGroup.getController(
      FIELD_NAME.consecutiveTurns,
    );
    this.#controllerDisabledState = controller;
  }

}
