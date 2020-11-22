"use strict";

import { DropdownSelect } from "UserInputs";

import { GameVSMode, OptionsSettings } from "Game";

import { GameSettingsWizard } from "../game-settings-wizard";
import { WIZARD_NAME } from "../game-settings-wizard.constants";

import { CONTENT } from "./vs-mode-wizard.constants";

export class VSModeWizard extends GameSettingsWizard {
  #_parallelAllowed;

  constructor(onSubmit, settings, parallelAllowed = false) {
    super(onSubmit, settings);
    this.parallelAllowed = parallelAllowed;
    this.init();
  }

  get parallelAllowed() {
    return this.#_parallelAllowed;
  }

  set parallelAllowed(allowed) {
    this.#_parallelAllowed = allowed;
  }

  get name() {
    return WIZARD_NAME.vsModeSettings;
  }

  get vsModeSelected() {
    return this.settings && this.settings.vsMode !== null;
  }

  get modeExplanation() {
    return `<div>${CONTENT[this.settings.vsMode].explanation}</div>`;
  }

  get initialSettingsMode() {
    return (!this.parallelAllowed && this.settings.vsMode === GameVSMode.Parallel) ? GameVSMode.Clear : this.settings.vsMode;
  }

  init() {
    this.settings = new OptionsSettings(this.vsModeSelected ? this.initialSettingsMode : GameVSMode.Clear);
    const params = this.getDropdownSelectParams("vsMode", GameVSMode);
    if (!this.parallelAllowed) {
      params.options = params.options.filter(option => option.value !== GameVSMode.Parallel);

    }
    this.inputsGroup.controllers = new DropdownSelect(params, this.onVsModeChange.bind(this));
  }

  onVsModeChange(params) {
    this.settings = new OptionsSettings(params.value);
    this.getFieldExplanationContainer("vsMode").then(container => container.innerHTML = this.modeExplanation);
    this.emitChanges();
  }

  // OVERIDDEN FUNCTIONS
  generateSettingsWizard() {
    const wizardContainer = super.generateSettingsWizard();
    wizardContainer.append(this.generateFieldExplanation("vsMode", this.modeExplanation));
    return wizardContainer;
  }

  getModeLabel(enumValue) {
    return CONTENT[enumValue].label;
  }

}
