"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { GroupController } from "~/_utils/group-controller";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { Player } from "GameModels";

import { WIZARD_NAME, LevelWizard, OptionsWizard } from "GameSettingsWizard";

import { DOM_ELEMENT_CLASS, CLOSE_BTN } from "./game-setup.constants";

export class GameSetup {
  #_stepper;
  #_gameParams;
  #_defaultGameParams = {};
  #_settingsControllers = new GroupController();
  #closeWizard;
  #submitGame;

  constructor(onClose, submitGame) {
    this.#closeWizard = onClose;
    this.#submitGame = submitGame;
    this.initGameParams();
  }

  set stepper(stepper) {
    this.#_stepper = stepper;
  }

  get stepper() {
    return this.#_stepper;
  }

  get player() {
    return new Player(self.user.id, self.user.username);
  }

  initGameParams() {
    this.#_gameParams = {};
    const currentParams = LocalStorageHelper.getGameSetUp(this.type);
    if (currentParams) {
      this.#_gameParams = currentParams;
    }
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
    this.#_settingsControllers.controllers = controller;
    this.gameParams = controller.data;
    this.defaultGameParams = controller.defaultSettings;
  }

  get settingsControllers() {
    return this.#_settingsControllers.controllers;
  }

  removeController(wizardName) {
    return this.#_settingsControllers.removeController(wizardName);
  }

  getSettingsController(wizardName) {
    return this.#_settingsControllers.getController(wizardName);
  }

  get contentContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_CLASS.wizardContent);
  }

  get wizardContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_CLASS.wizardContainer);
  }

  getGameParamsForWizard(wizardName) {
    return Object.keys(this.gameParams).includes(wizardName)
      ? this.gameParams[wizardName]
      : undefined;
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

  generateWizard() {
    const wizardContainer = this.generateWizardContainer();
    wizardContainer.append(this.generateWizardHeader());
    wizardContainer.append(this.generateContentSection());
    wizardContainer.append(this.generateStepperSection());
    return wizardContainer;
  }

  generateWizardContainer() {
    const wizardContainer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.wizardContainer],
      DOM_ELEMENT_CLASS.wizardContainer,
    );
    return wizardContainer;
  }

  generateWizardHeader() {
    const wizardHeader = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.wizardHeader,
    ]);
    const closeBnt = ElementGenerator.generateButton(
      CLOSE_BTN,
      this.onClose.bind(this),
    );
    wizardHeader.append(this.generateWizardTitle(), closeBnt);
    return wizardHeader;
  }

  generateWizardTitle() {
    const wizardTitle = document.createElement("h2");
    wizardTitle.innerHTML = this.title;
    return wizardTitle;
  }

  generateContentSection() {
    const wizardContent = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.wizardContent],
      DOM_ELEMENT_CLASS.wizardContent,
    );
    wizardContent.append(this.generateContent());
    return wizardContent;
  }

  generateStepperSection() {
    const fragment = document.createDocumentFragment();
    return fragment;
  }

  onGameSettingsChange(params) {
    this.stepper.submissionButtonDisabled = !params.valid;
    this.gameParams = params;
  }

  onSubmit() {
    const gameSetUp = this.gameSetUp;
    gameSetUp.playerStartID = randomValueFromArray(
      gameSetUp.players.map((player) => player.id),
    );
    this.#submitGame(clone(gameSetUp));
  }

  onClose() {
    this.#closeWizard();
    LocalStorageHelper.removeGameSetUp(this.gameType);
  }

  // OVERRIDEN FUNCTIONS
  get gameType() {
    return TYPOGRAPHY.emptyString;
  }

  get title() {
    return TYPOGRAPHY.emptyString;
  }

  get gameSetUp() {
    LocalStorageHelper.setGameSetUp(this.gameType, this.gameParams);
    const gameSetUp = this.gameParams;
    gameSetUp.type = this.gameType;
    gameSetUp.levelSettings.setMinesPositions();
    gameSetUp.players = [this.player];
    return gameSetUp;
  }

  generateContent() {
    const fragment = document.createDocumentFragment();
    return fragment;
  }

  onReset() {
    return;
  }

  updateWizardContent() {
    this.contentContainer.then((contentContainer) => {
      ElementHandler.clearContent(contentContainer);
      contentContainer.append(this.generateContent());
    });
  }
}
