"use strict";

import { GameType } from "Game";

import { GameWizard } from "../game-wizard";
import { TITLE } from "../game-wizard.constants";
import { WIZARD_NAME, LevelWizard, OptionsWizard, VSModeWizard, TurnSettingsWizard } from "../../game-settings-wizard/@game-settings-wizard.module";
import { Game } from "Game";

import { GameWizardStepper } from "../game-wizard-stepper/game-wizard-stepper";

export class GameWizardVS extends GameWizard {
  #_opponent;

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.opponent = undefined;
    this.init();
  }

  get gameType() {
    return GameType.Bot;
  }

  get title() {
    return TITLE[this.gameType];
  }

  get game() {
    return new Game(this.gameType, this.gameParams, this.player, this.opponent);
  }

  get parallelAllowed() {
    return true;
  }

  set opponent(opponent) {
    this.#_opponent = opponent;
  }

  get opponent() {
    return this.#_opponent;
  }

  get wizardStep() {
    return this.stepper.currentStep - 1;
  }

  get wizardStepName() {
    return this.wizardSteps[this.wizardStep];
  }

  init() {
    this.wizardSteps = [WIZARD_NAME.vsModeSettings, WIZARD_NAME.levelSettings, WIZARD_NAME.turnSettings, WIZARD_NAME.optionsSettings];
    this.stepper = new GameWizardStepper({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this),
      onStepChange: this.onStepChange.bind(this),
    }, this.wizardSteps.length);
  }

  initModeWizard() {
    const controller = new VSModeWizard(this.onVSModeChange.bind(this), this.getGameParamsForWizard(WIZARD_NAME.optionsSettings), this.parallelAllowed);
    this.settingsControllers = controller;
    this.setOptionsBasedOnVSMode(controller.data);
  }

  initTurnsWizard() {
    this.settingsControllers = new TurnSettingsWizard(this.onGameSettingsChange.bind(this), this.getGameParamsForWizard(WIZARD_NAME.turnSettings));
  }

  onVSModeChange(params) {
    super.onGameSettingsChange(params);
    this.setOptionsBasedOnVSMode(params);
  }

  setOptionsBasedOnVSMode(params) {
    params.name = WIZARD_NAME.optionsSettings;
    this.gameParams = params;
  }

  getSettingsController(wizardName) {
    const controller = super.getSettingsController(wizardName) || this.generateSettingsController(wizardName);
    return controller;
  }

  generateSettingsController(wizardName) {
    switch (wizardName) {
      case WIZARD_NAME.vsModeSettings:
        this.initModeWizard();
        break;
      case WIZARD_NAME.levelSettings:
        this.initLevelWizard();
        break;
      case WIZARD_NAME.turnSettings:
        this.initTurnsWizard();
        break;
      case WIZARD_NAME.optionsSettings:
        this.initOptionsWizard();
        break;
    }
    return super.getSettingsController(wizardName);
  }


  generateContent() {
    const fragment = document.createDocumentFragment();
    const controller = this.getSettingsController(this.wizardStepName);
    fragment.append(controller.generateSettingsWizard());
    return fragment;
  }

  onReset() {
    const wizardName = this.wizardStepName;
    delete this.gameParams[wizardName];
    delete this.defaultGameParams[wizardName];
    this.removeController(wizardName);
    this.updateWizardContent();
  }

  onStepChange() {
    this.stepper.submissionButtonDisabled = false;
    this.settingsControllers.forEach(controller => {
      if (controller.name !== this.wizardStepName) {
        this.removeController(controller.name);
      }
    });
    this.updateWizardContent();
  }

}
