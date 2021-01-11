"use strict";

import { clone, replaceStringParameter } from "~/_utils/utils";

import { GameVSMode } from "GameEnums";
import {
  WIZARD_NAME,
  VSModeWizard,
  TurnSettingsWizard,
} from "GameSettingsWizard";
import { EndButtonType, GameWizardStepper } from "GameWizardStepper";

import { GameSetup } from "../game-setup";
import { TITLE } from "../game-setup.constants";


import { GameWizardNavigation } from "../../../game-wizard/game-wizard-navigation/game-wizard-navigation";



export class GameSetupVS extends GameSetup {
  #_opponent;
  #_wizardSteps;

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.init();

    this.wizardNavigation = new GameWizardNavigation(this.#onSelectedStep.bind(this), this.againstBot);
  }


  #onSelectedStep(selectedStep) {
    console.log(selectedStep);
  }





  get againstBot() {
    return false;
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

  generateWizardSteps(selectedMode) {
    return selectedMode === GameVSMode.Parallel
    ? [
      WIZARD_NAME.vsModeSettings,
      WIZARD_NAME.levelSettings,
      WIZARD_NAME.optionsSettings,
    ]
    : [
      WIZARD_NAME.vsModeSettings,
      WIZARD_NAME.levelSettings,
      WIZARD_NAME.turnSettings,
      WIZARD_NAME.optionsSettings
    ];
  }

  set wizardSteps(selectedMode) {
    this.#_wizardSteps = this.generateWizardSteps(selectedMode);
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
    this.stepper = new GameWizardStepper(
      {
        onReset: this.onReset.bind(this),
        onSubmit: this.onSubmit.bind(this),
        onStepChange: this.onStepChange.bind(this),
      },
      this.wizardSteps.length,
      this.stepperSubmissionType,
    );
  }

  initModeWizard() {
    const controller = new VSModeWizard(
      this.onVSModeChange.bind(this),
      this.getGameParamsForWizard(WIZARD_NAME.vsModeSettings),
      this.parallelAllowed,
    );
    this.settingsControllers = controller;
    this.setOptionsBasedOnVSMode(clone(controller.data));
  }

  initTurnsWizard() {
    const controller = new TurnSettingsWizard(
      this.onGameSettingsChange.bind(this),
      this.getGameParamsForWizard(WIZARD_NAME.turnSettings),
    );
    this.settingsControllers = controller;
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

    if (this.gameParams.optionsSettings && params.value.vsMode === this.gameParams.optionsSettings.vsMode) {
      params.value = Object.assign(this.gameParams.optionsSettings);
    }

    this.gameParams = params;
    this.defaultGameParams = params;
  }

  getSettingsController(wizardName) {
    const controller = super.getSettingsController(wizardName) ||
      this.generateSettingsController(wizardName);
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
    console.log(this.wizardSteps);
    const controller = this.getSettingsController(this.wizardStepName);
    fragment.append(controller.generateSettingsWizard());
    return fragment;
  }

  generateStepperNavigation() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.wizardNavigation.generateView());
    return fragment;
  }

  generateStepperSection() {
    const fragment = document.createDocumentFragment();
    if (this.opponent) {
      fragment.append(this.stepper.generateStepper());
      console.log("stepper timeline");
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

    this.settingsControllers.forEach((controller) => {
      if (controller.name !== this.wizardStepName) {
        this.removeController(controller.name);
      }
    });

    this.updateWizardContent();
  }

  // OVERIDDEN FUNCTIONS
  get stepperSubmissionType() {
    return EndButtonType.play;
  }

  get title() {
    if (this.opponent) {
      let title = TITLE[this.gameType];
      title = replaceStringParameter(title, this.opponent.name);
      return title;
    } else {
      return TITLE.addOpponent;
    }
  }

  get gameSetUp() {
    const gameSetUp = super.gameSetUp;
    gameSetUp.players.push(this.opponent);
    delete gameSetUp.vsModeSettings;
    return gameSetUp;
  }
}
