"use strict";

import { DropdownSelect } from "UserInputs";

import { OptionsSettings } from "GameModels";
import { GameVSMode } from "GameEnums";

import { SettingsWizard } from "../_settings-wizard";
import { WIZARD_NAME } from "../_settings-wizard.constants";

import { CONTENT, OPTION_LABELS, EXPLANATIONS } from "./vs-mode-wizard.constants";

export class VSModeWizard extends SettingsWizard {
  #_parallelAllowed;

  constructor(onSubmit, settings, parallelAllowed = false) {
    super(onSubmit);
    this.settings = settings;
    this.title = CONTENT.title;
    this.labels = CONTENT.labels;
    this.#parallelAllowed = parallelAllowed;
    this.#init();
  }

  get #parallelAllowed() {
    return this.#_parallelAllowed;
  }

  set #parallelAllowed(allowed) {
    this.#_parallelAllowed = allowed;
  }

  get #vsModeSelected() {
    return this.settings && this.settings.vsMode !== null;
  }

  get #modeExplanation() {
    return `<div>${EXPLANATIONS[this.settings.vsMode]}</div>`;
  }

  get #initialSettingsMode() {
    return !this.#parallelAllowed &&
      this.settings.vsMode === GameVSMode.Parallel
      ? GameVSMode.Clear
      : this.settings.vsMode;
  }

  #init() {
    this.settings = new OptionsSettings(
      this.#vsModeSelected ? this.#initialSettingsMode : GameVSMode.Clear,
    );
    const params = this.getDropdownSelectParams("vsMode", GameVSMode);
    if (!this.#parallelAllowed) {
      params.options = params.options.filter(
        (option) => option.value !== GameVSMode.Parallel,
      );
    }
    this.inputsGroup.controllers = new DropdownSelect(
      params,
      this.#onVsModeChange.bind(this),
    );
  }

  #onVsModeChange(params) {
    this.settings = new OptionsSettings(params.value);
    this.getFieldExplanationContainer("vsMode").then(
      (container) => (container.innerHTML = this.#modeExplanation),
    );
    this.emitChanges();
  }

  // OVERIDDEN FUNCTIONS
  get name() {
    return WIZARD_NAME.vsModeSettings;
  }

  generateSettingsWizard() {
    const wizardContainer = super.generateSettingsWizard();
    wizardContainer.append(
      this.generateFieldExplanation("vsMode", this.#modeExplanation),
    );
    return wizardContainer;
  }

  getOptionLabel(enumValue) {
    return OPTION_LABELS[enumValue];
  }

  get defaultSettings() {
    return {
      name: this.name,
      valid: true,
      value: new OptionsSettings(GameVSMode.Clear),
    };
  }
}
