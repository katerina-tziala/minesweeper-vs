"use strict";

import { valueDefined } from "~/_utils/validator";
import { Switcher, NumberInput } from "UserInputs";
import { clone } from "~/_utils/utils.js";
import { SneakPeekSettings } from "GameModels";

import { SettingsWizard } from "../_settings-wizard";
import { WIZARD_NAME } from "../_settings-wizard.constants";

import {
  FIELD_NAME,
  BOUNDARIES,
  CONTENT
} from "./sneak-peek-wizard.constants";

export class SneakPeekWizard extends SettingsWizard {

  constructor(onSubmit, settings, allowed, roundDuration = null) {
    super(onSubmit);
    this.title = CONTENT.title;
    this.labels = CONTENT.labels;
    this.roundDuration = roundDuration;
    this.#init(settings, allowed);
  }

  get name() {
    return WIZARD_NAME.sneakPeekSettings;
  }

  get #numberFieldsDisabled() {
    return !this.settings.applied;
  }

  get #durationBoundaries() {
    let boundaries = clone(BOUNDARIES.duration);
    if (this.#numberFieldsDisabled) {
      boundaries.min = 0;
    } else if (valueDefined(this.roundDuration)) {
      const maxDurationBasedOnRound = this.roundDuration - this.settings.roundMargin;
      boundaries.max = maxDurationBasedOnRound < boundaries.max ? maxDurationBasedOnRound : boundaries.max;
    }
    return boundaries;
  }

  get #limitsBoundaries() {
    let boundaries = clone(BOUNDARIES.limit);
    if (this.#numberFieldsDisabled) {
      boundaries.min = 0;
    }
    return boundaries;
  }

  get #durationController() {
    return this.inputsGroup ? this.inputsGroup.getController(FIELD_NAME.duration) : undefined;
  }

  get #limitController() {
    return this.inputsGroup ? this.inputsGroup.getController(FIELD_NAME.limit) : undefined;
  }

  #initSettings(settings, allowed) {
    this.settings = new SneakPeekSettings();
    this.settings.update(settings);
    this.settings.applied = allowed;
    this.settings.updateBasedOnApplied();
  }

  #init(settings, allowed) {
    this.#initSettings(settings, allowed);
    if (this.settings.duration > this.#durationBoundaries.max) {
      this.settings.duration = this.#durationBoundaries.max;
      this.onSubmit({
        name: this.name,
        valid: true,
        value: this.settings,
      });
    }
    this.#initControllers(allowed);
  }

  #initControllers(allowed) {
    this.inputsGroup.controllers = this.#generateAppliedSwitcher(!allowed);
    this.inputsGroup.controllers = this.#generateNumberInput(FIELD_NAME.duration, this.#durationBoundaries);
    this.inputsGroup.controllers = this.#generateNumberInput(FIELD_NAME.limit, this.#limitsBoundaries);
  }

  #generateAppliedSwitcher(disabled = false) {
    const params = this.getControllerParams(FIELD_NAME.applied);
    const controller = new Switcher(params, this.#onAppliedChange.bind(this));
    controller.disabled = disabled;
    return controller;
  }

  #generateNumberInput(fieldName, boundaries) {
    const controller = new NumberInput(fieldName, this.settings[fieldName].toString(), this.#onNumberInputChange.bind(this));
    controller.boundaries = boundaries;
    controller.disabled = this.#numberFieldsDisabled;
    return controller;
  }

  #onAppliedChange(params) {
    this.updateSettings(params);
    this.#updateNumberInputs();
    this.emitChanges();
  }

  #updateNumberInputs() {
    this.#updateNumberController(this.#durationController, this.#durationBoundaries);
    this.#updateNumberController(this.#limitController, this.#limitsBoundaries);
  }

  #updateNumberController(controller, boundaries) {
    this.#numberFieldsDisabled ? controller.disable() : controller.enable();
    controller.boundaries = boundaries;
    controller.value = controller.boundaries.min.toString();
    controller.setFieldValue();
    controller.validateInputTypeValue();
  }

  #onNumberInputChange(params) {
    this.updateSettings(params);
    this.emitChanges();
  }

  updateControllers(disabled) {
    const controller = this.inputsGroup.getController(FIELD_NAME.applied);
    if (disabled) {
      this.settings.applied = false;
      controller.value = this.settings.applied;
      controller.updateSwitcherDisplay();
      controller.disable();
    } else {
      controller.enable();
    }

    this.#updateNumberInputs();
  }

  emitChanges() {
    this.onSubmit(this.data);
  }
  
}
