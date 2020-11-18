"use strict";

import { DropdownSelect } from "UserInputs";

import { GameVSMode, OptionsSettings } from "Game";

import { GameSettingsWizard } from "../game-settings-wizard";

import { CONTENT } from "./vs-mode-wizard.constants";

export class VSModeWizard extends GameSettingsWizard {

  constructor(onSubmit, settings) {
    super(onSubmit, settings);
    this.init();
  }

  get vsModeSelected() {
    return this.settings && this.settings.vsMode !== null;
  }

  get modeExplanation() {
    return `<div>${CONTENT[this.settings.vsMode].explanation}</div>`;
  }

  init() {
    this.settings = new OptionsSettings(this.vsModeSelected ? this.settings.vsMode : GameVSMode.Clear);
    const params = this.getDropdownSelectParams("vsMode", GameVSMode);
    this.inputsGroup.inputControllers = new DropdownSelect(params, this.onVsModeChange.bind(this));
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
