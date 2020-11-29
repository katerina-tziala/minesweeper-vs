"use strict";

import { replaceStringParameter } from "~/_utils/utils";

import { GameVSMode, Game } from "Game";

import { WIZARD_NAME, VSModeWizard, TurnSettingsWizard } from "../../game-settings-wizard/@game-settings-wizard.module";

import { GameWizard } from "../game-wizard";
import { TITLE } from "../game-wizard.constants";

import { GameWizardStepper } from "../game-wizard-stepper/game-wizard-stepper";
export class GameWizardVS extends GameWizard {
  #_opponent;
  #_wizardSteps;

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.opponent = undefined;
    this.init();
  }

  get parallelAllowed() {
    return true;
  }

  set opponent(opponent) {
    this.#_opponent = opponent;
  }

  get opponent() {
    if (this.#_opponent) {
      this.#_opponent.colorType = self.settingsController.settings.opponentColorType;
    }
    return this.#_opponent;
  }

  set wizardSteps(selectedMode) {
    this.#_wizardSteps = selectedMode === GameVSMode.Parallel ?
      [WIZARD_NAME.vsModeSettings, WIZARD_NAME.levelSettings, WIZARD_NAME.optionsSettings] :
      Object.keys(WIZARD_NAME);
  }

  get wizardSteps() {
    return this.#_wizardSteps;
  }

  get wizardStep() {
    return this.stepper.currentStep - 1;
  }

  get wizardStepName() {
    return this.wizardSteps[this.wizardStep];
  }

  init() {
    this.wizardSteps = undefined;
    this.stepper = new GameWizardStepper({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this),
      onStepChange: this.onStepChange.bind(this),
    }, this.wizardSteps.length, this.stepperSubmissionType);
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
    this.wizardSteps = params.value.vsMode;
    if (params.value.vsMode === GameVSMode.Parallel) {
      delete this.gameParams[GameVSMode.Parallel];
      delete this.defaultGameParams[GameVSMode.Parallel];
    }
    this.stepper.updateNumberOfSteps(this.wizardSteps.length);
  }

  setOptionsBasedOnVSMode(params) {
    params.name = WIZARD_NAME.optionsSettings;
    this.gameParams = params;
    this.defaultGameParams = params;
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

  generateStepperSection() {
    const fragment = document.createDocumentFragment();
    if (this.opponent) {
      fragment.append(this.stepper.generateStepper());
    }
    return fragment;
  }

  resetStepValues() {
    const wizardName = this.wizardStepName;
    if (wizardName === WIZARD_NAME.optionsSettings) {
      this.gameParams[wizardName] = this.defaultGameParams[wizardName];
    } else {
      delete this.gameParams[wizardName];
      delete this.defaultGameParams[wizardName];
    }
  }

  onReset() {
    this.resetStepValues();
    this.removeController(this.wizardStepName);
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

  // OVERIDDEN FUNCTIONS
  get stepperSubmissionType() {
    return "play";
  }

  get title() {
    let title = TITLE[this.gameType];
    if (this.opponent) {
      title = replaceStringParameter(title, this.opponent.name);
    }
    return title;
  }

  get game() {
    return new Game(this.gameType, this.gameParams, this.player, this.opponent);
  }
}
