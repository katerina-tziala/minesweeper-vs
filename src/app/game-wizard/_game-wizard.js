"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { GroupController } from "~/_utils/group-controller";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { clone, randomValueFromArray } from "~/_utils/utils.js";
import { LevelSettings, OptionsSettings, TurnSettings, Player } from "GameModels";
import {
  WIZARD_NAME,
  LevelWizard,
  OptionsWizard,
  GameWizardView
} from "GameWizardComponents";
import { TITLES } from "./_game-wizard.constants";


export class GameWizard {
  #_gameParams;
  #_defaultGameParams = {};
  #SettingsControllers = new GroupController();
  #WizardActions;
  #closeWizard;
  #submitGame;

  constructor(onClose, submitGame) {
    this.#closeWizard = onClose;
    this.#submitGame = submitGame;
    this.initGameParams();
  }

  set wizardActions(stepper) {
    this.#WizardActions = stepper;
  }

  get wizardActions() {
    return this.#WizardActions;
  }

  get player() {
    return new Player(self.user.id, self.user.username);
  }

  get gameType() {
    return TYPOGRAPHY.emptyString;
  }

  get title() {
    return TITLES[this.gameType];
  }

  get gameSetUp() {
    const gameSetUp = this.gameParams;
    gameSetUp.type = this.gameType;
    gameSetUp.players = [this.player];
    gameSetUp.levelSettings.setMinesPositions();
    gameSetUp.optionsSettings.initOptionsBasedOnTileFlagging();
    gameSetUp.playerStartID = randomValueFromArray(gameSetUp.players.map((player) => player.id));
    return gameSetUp;
  }

  set gameParams(params) {
    if (params.valid) {
      this.#_gameParams[params.name] = params.value;
    }
  }

  get gameParams() {
    return this.#_gameParams;
  }

  set defaultGameParams(params) {
    if (params.valid) {
      this.#_defaultGameParams[params.name] = params.value;
    }
  }

  get defaultGameParams() {
    return this.#_defaultGameParams;
  }

  set settingsControllers(controller) {
    this.#SettingsControllers.controllers = controller;
    this.gameParams = controller.data;
    this.defaultGameParams = controller.defaultSettings;
  }

  get settingsControllers() {
    return this.#SettingsControllers.controllers;
  }

  getDefaultLevelSettings(updateData) {
    const levelSettings = new LevelSettings();
    levelSettings.update(updateData);
    return levelSettings;
  }

  getDefaultOptionsSettings(updateData) {
    const optionsSettings = new OptionsSettings();
    optionsSettings.update(updateData);
    return optionsSettings;
  }

  getDefaultTurnsSettings(updateData) {
    const turnSettings = new TurnSettings();
    turnSettings.update(updateData);
    return turnSettings;
  }

  initGameParams() {
    this.#_gameParams = {};
    const currentParams = LocalStorageHelper.getGameSetUp(this.gameType);
    if (currentParams) {
      currentParams.levelSettings = this.getDefaultLevelSettings(currentParams.levelSettings);
      currentParams.optionsSettings = this.getDefaultOptionsSettings(currentParams.optionsSettings);
      currentParams.turnSettings = this.getDefaultTurnsSettings(currentParams.turnSettings);
      this.#_gameParams = currentParams;
    }
  }

  removeController(wizardName) {
    return this.#SettingsControllers.removeController(wizardName);
  }

  getSettingsController(wizardName) {
    return this.#SettingsControllers.getController(wizardName);
  }

  getGameParamsForWizard(wizardName) {
    return Object.keys(this.gameParams).includes(wizardName) ? this.gameParams[wizardName] : undefined;
  }

  initLevelWizard() {
    this.settingsControllers = new LevelWizard(
      this.onGameSettingsChange.bind(this),
      this.getGameParamsForWizard(WIZARD_NAME.levelSettings),
    );
  }

  initOptionsWizard() {
    this.settingsControllers = new OptionsWizard(
      this.onGameSettingsChange.bind(this),
      this.getGameParamsForWizard(WIZARD_NAME.optionsSettings),
    );
  }

  onGameSettingsChange(params) {
    const validSettings = params.valid;
    if (params.valid) {
      this.gameParams = params;
    }

    this.wizardActions.updateResetAndSubmissionButton(false, !validSettings);
  }

  #saveGameSetup() {
    const gameParamsToSave = {};
    Object.keys(this.gameParams).forEach(key => {
      gameParamsToSave[key] = clone(this.gameParams[key]);
    });

    LocalStorageHelper.setGameSetUp(this.gameType, gameParamsToSave);
    return Promise.resolve();
  }

  onSubmit() {
    this.#saveGameSetup().then(() => {
      return this.collapseWizard();
    }).then(() => {
      const gameSetUp = this.gameSetUp;
      this.#submitGame(clone(gameSetUp));
    });
  }

  onClose() {
    LocalStorageHelper.removeGameSetUp(this.gameType);
    this.collapseWizard().then(() => {
      this.#closeWizard();
    });
  }

  onReset() {
    return;
  }

  /*
  ** FUNCTIONS TO UPDATE WIZARD INTERFACE
  */
  generateWizardView() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#generateHeader());
    fragment.append(this.generateNavigation());
    fragment.append(this.generateMainSection());
    fragment.append(this.generateActions());
    return fragment;
  }

  #generateHeader() {
    return GameWizardView.generateHeader(this.title, this.onClose.bind(this));
  }

  generateNavigation() {
    return document.createDocumentFragment();
  }

  generateActions() {
    return document.createDocumentFragment();
  }

  generateMainSection() {
    const content = this.generateMainContent();
    return GameWizardView.generateMainSection(content);
  }

  generateMainContent() {
    return document.createDocumentFragment();
  }

  generateView() {
    const content = this.generateWizardView();
    return GameWizardView.generateWizard(content);
  }

  updateView() {
    const content = this.generateWizardView();
    return GameWizardView.updateView(content);
  }

  expandWizard() {
    return GameWizardView.expandWizard();
  }

  updateMainView() {
    const content = this.generateMainContent();
    return GameWizardView.updateMainView(content);
  }

  rerenderCurrentMainView() {
    const content = this.generateMainContent();
    return GameWizardView.updateMainSection(content);
  }

  collapseWizard() {
    return GameWizardView.resetWizardHeight();
  }

}
