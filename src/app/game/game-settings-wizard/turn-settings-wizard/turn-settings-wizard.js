"use strict";

import { Switcher, NumberInput } from "UserInputs";

import { clone } from "~/_utils/utils.js";

import { TurnSettings } from "Game";

import { FIELD_NAME, LIMITS } from "./turn-settings-wizard.constants";

import { GameSettingsWizard } from "../game-settings-wizard";

export class TurnSettingsWizard extends GameSettingsWizard {

  constructor(onSubmit, settings) {
    super(onSubmit, settings);
    this.init();
  }

  get turnProperties() {
    return Object.keys(FIELD_NAME).filter(key => FIELD_NAME[key] !== FIELD_NAME.turnTimer);
  }

  init() {
    this.settings = new TurnSettings();
    console.log("TurnSettingsWizard - implement me");

    this.inputsGroup.inputControllers = this.generateSwitcher(FIELD_NAME.turnTimer,  this.onTurnTimerChange.bind(this));
    console.log(this.settings);
    console.log(this.turnProperties);
  }

  generateSwitcher(fieldName, action = this.onTurnParamsChange.bind(this), disabled = false) {
    const params = this.getControllerParams(fieldName);
    const controller = new Switcher(params, action);
    controller.disabled = disabled;
    return controller;
  }






  onTurnTimerChange(params) {
    this.settings[params.name] = params.value;
    console.log("onTurnTimerChange");
    console.log(params);
    console.log(this.settings);

    // this.emitChanges();
  }


  onTurnParamsChange(params) {
    this.settings[params.name] = params.value;
    console.log(params);
    console.log(this.settings);

    // this.emitChanges();
  }

}
