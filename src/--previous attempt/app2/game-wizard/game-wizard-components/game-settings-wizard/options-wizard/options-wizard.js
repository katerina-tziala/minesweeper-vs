"use strict";
import { Switcher } from "UserInputs";
import { OptionsSettings } from "GameModels";
import { SettingsWizard } from "../_settings-wizard";
import { WIZARD_NAME } from "../_settings-wizard.constants";

import {
  SETTINGS_PROPERTIES,
  FIELD_NAME,
  CONTENT,
  FIELDS_BASED_ON_STRATEGY,
  ALLOW_SNEAK_PEEK_SETTINGS
} from "./options-wizard.constants";


import { SneakPeekWizard } from "../sneak-peek-wizard/sneak-peek-wizard";

export class OptionsWizard extends SettingsWizard {
  constructor(onSubmit, settings, roundDuration = null) {
    super(onSubmit);
    this.title = CONTENT.title;
    this.labels = CONTENT.labels;
    this.roundDuration = roundDuration;
    this.#init(settings);
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

  get isValid() {
    if (!this.sneakPeekWizard) {
      return this.inputsGroup.isValid;
    }
    return this.inputsGroup.isValid && this.sneakPeekWizard.isValid;
  }

  get #settingsProperties() {
    if (this.settings && this.settings.vsMode) {
      return SETTINGS_PROPERTIES[this.settings.vsMode];
    }
    return SETTINGS_PROPERTIES.default;
  }

  get #strategy() {
    return this.settings.strategy;
  }

  get #sneakPeekDisabled() {
    return this.settings.sneakPeekDisabled;
  }

  get #controllersBasedOnStrategy() {
    return Object.keys(this.settings)
      .filter(settingName => FIELDS_BASED_ON_STRATEGY.includes(settingName))
      .map(inputName => this.inputsGroup.getController(inputName));
  }

  #initSettings(settings) {
    this.settings = new OptionsSettings();
    this.settings.update(settings);
  }

  #init(settings) {
    this.#initSettings(settings);
    this.#initControllers();
  }

  #initControllers() {
    this.#settingsProperties.forEach((property) => {
      const controller = this.#generateSettingController(property);
      if (controller) {
        this.inputsGroup.controllers = controller;
      }
    });

    if (this.settings && this.settings.vsMode && ALLOW_SNEAK_PEEK_SETTINGS.includes(this.settings.vsMode)) {
      this.sneakPeekWizard = new SneakPeekWizard(
        this.#onSneakPeekSettingsChange.bind(this),
        this.settings.sneakPeekSettings,
        !this.#sneakPeekDisabled,
        this.roundDuration
      );
    }
  }

  generateWizardInputs() {
    const fragment = super.generateWizardInputs();
    if (this.sneakPeekWizard) {
      fragment.append(this.sneakPeekWizard.generateWizardInputs());
    }
    return fragment;
  }

  #onSneakPeekSettingsChange(params) {
    this.updateSettings(params);
    this.emitChanges();
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

  #onTileFlaggingChange(params) {
    this.updateSettings(params);
    const controllers = this.#controllersBasedOnStrategy;
    if (this.#strategy) {
      controllers.forEach(controller => controller.enable());
    } else {
      controllers.forEach(controller => controller.disable());
    }
    this.#updateSneakPeekSettings();
  }

  #onOptionSettingChange(params) {
    this.updateSettings(params);
    this.emitChanges();
  }

  #onOpenStrategyChange(params) {
    this.updateSettings(params);
    this.#updateSneakPeekSettings();
  }

  #updateSneakPeekSettings() {
    if (this.sneakPeekWizard) {
      this.sneakPeekWizard.updateControllers(this.#sneakPeekDisabled);
    } else {
      this.emitChanges();
    }
  }

}
