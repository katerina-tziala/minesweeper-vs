"use strict";

import { Switcher, NumberInput } from "UserInputs";

import { TurnSettings } from "Game";

import { GameSettingsWizard } from "../game-settings-wizard";
import { WIZARD_NAME } from "../game-settings-wizard.constants";

import { FIELD_NAME, LIMITS } from "./turn-settings-wizard.constants";

export class TurnSettingsWizard extends GameSettingsWizard {

  constructor(onSubmit, settings) {
    super(onSubmit, settings);
    this.init();
  }

  get name() {
    return WIZARD_NAME.turnSettings;
  }

  get turnProperties() {
    return Object.keys(FIELD_NAME).filter(key => FIELD_NAME[key] !== FIELD_NAME.turnTimer);
  }

  get turnNumberProperties() {
    return this.turnProperties.filter(key => FIELD_NAME[key] !== FIELD_NAME.consecutiveTurns);
  }

  get turnPropertyDisabled() {
    return !this.settings.turnTimer;
  }

  set controllerDisabledState(controller) {
    this.turnPropertyDisabled ? controller.disable() : controller.enable();
  }

  init() {
    this.settings = new TurnSettings();
    this.inputsGroup.controllers = this.generateSwitcher(FIELD_NAME.turnTimer, this.onTurnTimerChange.bind(this));
    this.turnNumberProperties.forEach(property => {
      this.inputsGroup.controllers = this.generateNumberInput(property);
    });
    this.inputsGroup.controllers = this.generateSwitcher(FIELD_NAME.consecutiveTurns, this.onTurnSettingsChange.bind(this), this.turnPropertyDisabled);
  }

  generateSwitcher(fieldName, action, disabled = false) {
    const params = this.getControllerParams(fieldName);
    const controller = new Switcher(params, action);
    controller.disabled = disabled;
    return controller;
  }

  generateNumberInput(fieldName) {
    const controller = new NumberInput(fieldName, this.settings[fieldName].toString(), this.onTurnSettingsChange.bind(this));
    controller.boundaries = LIMITS[fieldName];
    controller.disabled = this.controllerDisabledState;
    return controller;
  }

  onTurnTimerChange(params) {
    this.onTurnSettingsChange(params);
    this.setConsecutiveTurnsDisabledState();
    this.turnNumberProperties.forEach(property => {
      const controller = this.inputsGroup.getController(property);
      this.controllerDisabledState = controller;
      if (!controller.valid) {
        controller.updateValidFieldValue(this.settings[property]);
      }
    });
  }

  onTurnSettingsChange(params) {
    if (params.valid) {
      this.settings[params.name] = params.value;
    }
    this.emitChanges();
  }

  setConsecutiveTurnsDisabledState() {
    const controller = this.inputsGroup.getController(FIELD_NAME.consecutiveTurns);
    this.controllerDisabledState = controller;
  }

}
