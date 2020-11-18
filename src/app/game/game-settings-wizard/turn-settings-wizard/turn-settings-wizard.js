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


  init() {
    this.settings = new TurnSettings();
    console.log("TurnSettingsWizard - implement me");

    console.log(this.settings);
  }


}
