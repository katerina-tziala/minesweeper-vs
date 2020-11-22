"use strict";

import { DropdownSelect } from "UserInputs";

import { BotMode } from "Game";

import { GameSettingsWizard } from "../game-settings-wizard";

export class BotModeWizard extends GameSettingsWizard {

  constructor(onSubmit, botMode) {
    super(onSubmit, undefined);
    this.setModeSettings(botMode)
    this.init();
  }

  setModeSettings(botMode) {
    const settings = { botMode };
    this.settings = settings;
  }

  get name() {
    return "botMode";
  }

  get modeSelected() {
    return this.settings && this.settings.botMode !== null;
  }

  init() {
    const params = this.getDropdownSelectParams("botMode", BotMode);
    this.inputsGroup.controllers = new DropdownSelect(params, this.onModeChange.bind(this));
  }

  onModeChange(params) {
    this.setModeSettings(params.value);
    this.emitChanges();
  }

}
