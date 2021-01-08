"use strict";

import { DropdownSelect } from "UserInputs";

import { BotMode } from "GameEnums";

import { SettingsWizard } from "../_settings-wizard";

import { CONTENT } from "./bot-mode-wizard.constants";
export class BotModeWizard extends SettingsWizard {
  constructor(onSubmit, botMode) {
    super(onSubmit, undefined);
    this.title = CONTENT.title;
    this.labels = CONTENT.labels;
    this.#setModeSettings(botMode);
    this.#init();
  }

  #setModeSettings(botMode) {
    const settings = { botMode };
    this.settings = settings;
  }

  #init() {
    const params = this.getDropdownSelectParams("botMode", BotMode);
    this.inputsGroup.controllers = new DropdownSelect(
      params,
      this.#onModeChange.bind(this),
    );
  }

  #onModeChange(params) {
    this.#setModeSettings(params.value);
    this.emitChanges();
  }

  get name() {
    return "botMode";
  }

  get defaultSettings() {
    return {
      name: this.name,
      valid: true,
      value: { botMode: BotMode.Easy },
    };
  }
}
