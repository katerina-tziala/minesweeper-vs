"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DropdownSelect, Switcher } from "UserInputs";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { OptionsSettings, LevelSettings, Player } from "Game";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CLOSE_BTN } from "./game-wizard.constants";

import { LevelWizard, OptionsWizard, VSModeWizard, TurnSettingsWizard } from "../game-settings-wizard/@game-settings-wizard.module";

import { GameWizardStepper } from "./game-wizard-stepper/game-wizard-stepper";
import { GameWizard } from "./game-wizard";

export class GameWizardOriginal extends GameWizard {

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.stepper = new GameWizardStepper({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this)
    });
  }

  generateContent() {
    const fragment = document.createDocumentFragment();
    const levelWizard = new LevelWizard(this.onGameSettingsChange.bind(this));
    this.gameParams = levelWizard.data;


    fragment.append(levelWizard.generateSettingsWizard());
    const optionsWizard = new OptionsWizard(this.onGameSettingsChange.bind(this));
    this.gameParams = optionsWizard.data;


    fragment.append(optionsWizard.generateSettingsWizard());
    return fragment;
  }

  onReset() {
    console.log("onReset");
  }

  onSubmit() {
    console.log("onSubmit");
    console.log(this.gameParams);
  }

}
