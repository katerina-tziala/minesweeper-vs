"use strict";

import { DropdownSelect } from "UserInputs";

import { BotMode } from "GameEnums";

import { GameSettingsWizard } from "../game-settings-wizard";

export class BotModeWizard extends GameSettingsWizard {

  constructor(onSubmit, botMode) {
    super(onSubmit, undefined);
    this.#setModeSettings(botMode)
    this.#init();
  }

  #setModeSettings(botMode) {
    const settings = { botMode };
    this.settings = settings;
  }

  #init() {
    const params = this.getDropdownSelectParams("botMode", BotMode);
    this.inputsGroup.controllers = new DropdownSelect(params, this.#onModeChange.bind(this));
  }

  #onModeChange(params) {
    this.#setModeSettings(params.value);
    this.emitChanges();
  }

  // OVERIDDEN FUNCTIONS
  get name() {
    return "botMode";
  }

  get defaultSettings() {
    return {
      name: this.name,
      valid: true,
      value: { botMode: BotMode.Easy }
    };
  }

}
