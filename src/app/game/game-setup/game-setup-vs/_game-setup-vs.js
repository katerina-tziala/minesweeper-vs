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

import { GameWizardActions } from "../../../game-wizard/game-wizard-actions/game-wizard-actions"

export class GameSetupVS extends GameSetup {
  #_opponent;
  #_wizardSteps;

  #_wizardStep;


  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.init();

    this.wizardNavigation = new GameWizardNavigation(this.#onSelectedStepChange.bind(this), this.againstBot);

    this.wizardActions = new GameWizardActions({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this),
      onStepChange: this.#onStepChange.bind(this),
    });
  }


  init() {
    this.wizardSteps = undefined;
    // this.stepper = new GameWizardStepper(
    //   {
    //     onReset: this.onReset.bind(this),
    //     onSubmit: this.onSubmit.bind(this),
    //     onStepChange: this.onStepChange.bind(this),
    //   },
    //   this.wizardSteps.length,
    //   this.stepperSubmissionType,
    // );
  }

  get wizardStepName() {
    return this.wizardNavigation ? this.wizardNavigation.selectedStep : undefined;
  }

  #onSelectedStepChange() {
    // if (!this.#_wizardStep) {
    //   this.#_wizardStep = selectedStep;
    //   return;
    // }
    console.log("onSelectedStepChange");
    // console.log(this.wizardNavigation);

    console.log(this.wizardStepName);


    this.wizardActions.updateActionButtons(this.wizardNavigation.onFirstStep, this.wizardNavigation.onLastStep)
      .then(() => {

        this.#keepStepController();

        this.updateWizardContent();

        console.log("update with animation");
      });
  }


  onReset() {
    this.resetStepValues();
    this.removeController(this.wizardStepName);
    this.updateWizardContent();
  }

  #keepStepController() {
    this.settingsControllers.forEach((controller) => {
      if (controller.name !== this.wizardStepName) {
        this.removeController(controller.name);
      }
    });
  }

  #onStepChange(step) {
    this.wizardNavigation.updateByIndex(step);
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
  
    const parallelSelected = params.value.vsMode === GameVSMode.Parallel;
    if (parallelSelected) {
      delete this.gameParams[GameVSMode.Parallel];
      delete this.defaultGameParams[GameVSMode.Parallel];
    }
   
    this.wizardNavigation.updateOptionsOnVSModeChange(parallelSelected);
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
      fragment.append(this.wizardActions.generateView());
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
