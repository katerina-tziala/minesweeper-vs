"use strict";

import { DropdownSelect, NumberInput } from "UserInputs";

import { clone } from "~/_utils/utils";

import { GameLevel, LevelSettings } from "Game";

import { GameSettingsWizard } from "../game-settings-wizard";
import { WIZARD_NAME } from "../game-settings-wizard.constants";

import { SETTINGS_PROPERTIES, LIMITS } from "./level-wizard.constants";

export class LevelWizard extends GameSettingsWizard {
  #customLevelSettings;

  constructor(onSubmit, settings) {
    super(onSubmit);
    this.init(settings);
  }

  get name() {
    return WIZARD_NAME.levelSettings;
  }

  get customLevelSettings() {
    return this.#customLevelSettings;
  }

  set customLevelSettings(customLevelSettings) {
    this.#customLevelSettings = customLevelSettings;
  }

  get isCustomLevel() {
    return this.settings.level === GameLevel.Custom;
  }

  get levelProperties() {
    return Object.keys(SETTINGS_PROPERTIES).filter(key => SETTINGS_PROPERTIES[key] !== SETTINGS_PROPERTIES.level);
  }

  get levelPropertiesControllers() {
    return this.inputsGroup.controllers.filter(controller => controller.name !== SETTINGS_PROPERTIES.level);
  }

  get numberOfMinesBoundaries() {
    if (this.isCustomLevel) {
      const numberOfBoardTiles = this.settings.rows * this.settings.columns;
      const boundaries = clone(LIMITS.numberOfMines);
      boundaries.max = Math.floor(numberOfBoardTiles * LIMITS.maxMinesPercentage);
      boundaries.min = Math.ceil(numberOfBoardTiles * LIMITS.minMinesPercentage);
      return boundaries;
    }
    return undefined;
  }

  getPropertyBoundaries(levelProperty) {
    if (levelProperty !== SETTINGS_PROPERTIES.numberOfMines) {
      return LIMITS.customLevelBoard;
    }
    return this.numberOfMinesBoundaries;
  }

  init(settings) {
    this.settings = this.initLevelSettings(settings);
    this.initLevelController();
    this.initLevelPropertiesControllers();
  }

  initLevelSettings(settings) {
    const levelSettings = new LevelSettings();
    if (settings) {
      levelSettings.update(settings);
    }
    return levelSettings;
  }

  initLevelController() {
    const params = this.getDropdownSelectParams(SETTINGS_PROPERTIES.level, GameLevel);
    this.inputsGroup.controllers = new DropdownSelect(params, this.onLevelChange.bind(this));
  }

  initLevelPropertiesControllers() {
    this.levelProperties.forEach(levelProperty => {
      const controller = new NumberInput(levelProperty, this.settings[levelProperty].toString(), this.onCustomLevelParamChange.bind(this));
      controller.boundaries = this.getPropertyBoundaries(levelProperty);
      controller.disabled = !this.isCustomLevel;
      this.inputsGroup.controllers = controller;
    });
  }

  onCustomLevelChange() {
    if (this.customLevelSettings) {
      this.settings.update(this.customLevelSettings);
    }
    this.customLevelSettings = this.settings;
  }

  onLevelChange(params) {
    this.settings = new LevelSettings(params.value);
    if (this.isCustomLevel) {
      this.onCustomLevelChange();
    }
    this.updateLevelPropertiesControllers();
    this.emitChanges();
  }

  updateLevelPropertiesControllers() {
    this.levelPropertiesControllers.forEach(controller => {
      controller.value = this.settings[controller.name].toString();
      this.isCustomLevel ? controller.enable() : controller.disable();
      controller.updateValidFieldValue();
      this.inputsGroup.controllers = controller;
    });
  }

  enableDisabledControllers() {
    this.levelPropertiesControllers.filter(controller => controller.disabled).forEach(controller => controller.enable());
  }

  onInvalidCustomLevel(invalidPropertyName) {
    const restPropertiesControllers = this.levelPropertiesControllers.filter(controller => controller.name !== invalidPropertyName);
    restPropertiesControllers.forEach(controller => controller.disable());
    this.emitChanges();
  }

  onCustomLevelParamChange(params) {
    const fieldName = params.name;
    if (!params.valid) {
      this.onInvalidCustomLevel(fieldName);
      return;
    }
    this.settings[fieldName] = params.value;
    this.customLevelSettings = this.settings;
    this.enableDisabledControllers();
    if (fieldName !== SETTINGS_PROPERTIES.numberOfMines) {
      this.updateNumberOfMinesBoundaries();
      return;
    }
    this.emitChanges();
  }

  updateNumberOfMinesBoundaries() {
    const numberOfMinesController = this.inputsGroup.getController(SETTINGS_PROPERTIES.numberOfMines);
    numberOfMinesController.boundaries = this.numberOfMinesBoundaries;
    numberOfMinesController.validateInputTypeValue();
  }

}
