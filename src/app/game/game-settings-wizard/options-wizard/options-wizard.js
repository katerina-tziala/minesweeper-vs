"use strict";

import { Switcher, NumberInput } from "UserInputs";

import { clone } from "~/_utils/utils.js";

import { GameVSMode, OptionsSettings } from "Game";

import { GameSettingsWizard } from "../game-settings-wizard";
import { WIZARD_NAME } from "../game-settings-wizard.constants";

import { SETTINGS_PROPERTIES, FIELD_NAME, LIMITS } from "./options-wizard.constants";

export class OptionsWizard extends GameSettingsWizard {

  constructor(onSubmit, settings) {
    super(onSubmit, settings);
    this.init();
  }

  get name() {
    return WIZARD_NAME.optionsSettings;
  }

  get vsModeSelected() {
    return this.settings && this.settings.vsMode !== null;
  }

  get settingsProperties() {
    let params = SETTINGS_PROPERTIES.default;
    if (this.settings && this.settings.vsMode === GameVSMode.Clear) {
      params = params.concat(SETTINGS_PROPERTIES[GameVSMode.Clear]);
    }
    if (this.settings && this.settings.vsMode === GameVSMode.Detect) {
      params = params.concat(SETTINGS_PROPERTIES[GameVSMode.Detect]);
    }
    return params;
  }

  get sneakPeakDisabled() {
    return this.settings.openStrategy;
  }

  get sneakPeakDurationDisabled() {
    return this.settings.openStrategy ? true : !this.settings.sneakPeek;
  }

  get sneakPeakDurationLimits() {
    const limits = clone(LIMITS.sneakPeekDuration);
    if (this.sneakPeakDurationDisabled) {
      limits.min = 0;
    }
    return limits;
  }

  init() {
    if (!this.settings) {
      this.settings = new OptionsSettings();
    }
    this.initControllers();
  }

  initControllers() {
    this.settingsProperties.forEach(property => {
      this.inputsGroup.controllers = this.generateSettingController(property);
    });
  }

  generateSettingController(fieldName) {
    switch (fieldName) {
      case FIELD_NAME.openStrategy:
        return this.generateSwitcher(fieldName, this.onOpenStrategyChange.bind(this));
      case FIELD_NAME.sneakPeek:
        return this.generateSwitcher(fieldName, this.onSneakPeekChange.bind(this), this.sneakPeakDisabled);
      case FIELD_NAME.sneakPeekDuration:
        return this.generateSneakPeekDurationInput();
      default:
        return this.generateSwitcher(fieldName);
    }
  }

  generateSwitcher(fieldName, action = this.onOptionSettingChange.bind(this), disabled = false) {
    const params = this.getControllerParams(fieldName);
    const controller = new Switcher(params, action);
    controller.disabled = disabled;
    return controller;
  }

  generateSneakPeekDurationInput() {
    const controller = new NumberInput(FIELD_NAME.sneakPeekDuration, this.settings.sneakPeekDuration.toString(), this.onSneakPeekDurationChange.bind(this));
    controller.boundaries = this.sneakPeakDurationLimits;
    controller.disabled = this.sneakPeakDurationDisabled;
    return controller;
  }

  onOptionSettingChange(params) {
    this.settings[params.name] = params.value;
    this.emitChanges();
  }

  onOpenStrategyChange(params) {
    this.settings[params.name] = params.value;
    const controller = this.inputsGroup.getController(FIELD_NAME.sneakPeek);
    this.sneakPeakDisabled ? controller.disable() : controller.enable();
    this.updateSneakPeekDuration();
  }

  onSneakPeekChange(params) {
    this.settings[params.name] = params.value;
    this.updateSneakPeekDuration();
  }

  onSneakPeekDurationChange(params) {
    if (!params.valid) {
      this.emitChanges();
      return;
    }
    this.onOptionSettingChange(params);
  }

  updateSneakPeekDuration() {
    const controller = this.inputsGroup.getController(FIELD_NAME.sneakPeekDuration);
    this.sneakPeakDurationDisabled ? controller.disable() : controller.enable();
    controller.boundaries = this.sneakPeakDurationLimits;
    controller.value = this.settings.sneakPeekDuration.toString();
    controller.validateInputTypeValue();
  }

}
