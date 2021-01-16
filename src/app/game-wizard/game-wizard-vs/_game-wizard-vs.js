"use strict";
import { clone, replaceStringParameter } from "~/_utils/utils";
import { GameVSMode } from "GameEnums";
import {
  WIZARD_NAME,
  GameWizardNavigation,
  GameWizardActions,
  VSModeWizard,
  TurnSettingsWizard
} from "GameWizardComponents";

import { GameWizard } from "../_game-wizard";
import { TITLES } from "../_game-wizard.constants";
export class GameWizardVS extends GameWizard {
  #_opponent;

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.init();
  }

  get invite() {
    return false;
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

  get title() {
    if (this.opponent) {
      let title = TITLES[this.gameType];
      title = replaceStringParameter(title, this.opponent.name);
      return title;
    } else {
      return TITLES.addOpponent;
    }
  }

  get gameSetUp() {
    const gameSetUp = super.gameSetUp;
    gameSetUp.players.push(this.opponent);
    delete gameSetUp.vsModeSettings;
    return gameSetUp;
  }

  get wizardStepName() {
    return this.wizardNavigation ? this.wizardNavigation.selectedStep : undefined;
  }

  get #turnsVisible() {
    if (this.gameParams && this.gameParams.vsModeSettings && this.gameParams.vsModeSettings.vsMode === GameVSMode.Parallel) {
      return false;
    }
    return true;
  }

  init() {
    this.wizardNavigation = new GameWizardNavigation(this.#onSelectedStepChange.bind(this), this.againstBot, this.#turnsVisible);
    this.wizardActions = new GameWizardActions({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this),
      onStepChange: this.#onStepChange.bind(this),
    }, this.invite);
  }

  #onSelectedStepChange() {
    const onFirstStep = this.wizardNavigation.onFirstStep;
    const onLastStep = this.wizardNavigation.onLastStep;
    this.wizardActions.updateActionButtons(onFirstStep, onLastStep).then(() => {
      this.#keepStepController();
      this.updateMainView();
    });
  }

  onReset() {
    this.resetStepValues();
    this.removeController(this.wizardStepName);
    this.rerenderCurrentMainView();
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

  resetStepValues() {
    const wizardName = this.wizardStepName;
    if (wizardName === WIZARD_NAME.optionsSettings) {
      this.gameParams[wizardName] = this.defaultGameParams[wizardName];
    } else {
      delete this.gameParams[wizardName];
      delete this.defaultGameParams[wizardName];
    }
  }

  generateMainContent() {
    const fragment = document.createDocumentFragment();
    const controller = this.getSettingsController(this.wizardStepName);
    fragment.append(controller.generateSettingsWizard());
    return fragment;
  }

  generateNavigation() {
    const fragment = super.generateNavigation();
    if (this.opponent) {
      fragment.append(this.wizardNavigation.generateView());
    }
    return fragment;
  }

  generateActions() {
    const fragment = super.generateActions();
    if (this.opponent) {
      fragment.append(this.wizardActions.generateView());
    }
    return fragment;
  }

}
