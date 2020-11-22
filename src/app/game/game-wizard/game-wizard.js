"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DropdownSelect, Switcher } from "UserInputs";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { Game, Player } from "Game";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CLOSE_BTN } from "./game-wizard.constants";

import { WIZARD_NAME, LevelWizard, OptionsWizard, VSModeWizard, TurnSettingsWizard } from "../game-settings-wizard/@game-settings-wizard.module";

import { GameWizardStepper } from "./game-wizard-stepper/game-wizard-stepper";

import { GroupController } from "~/_utils/group-controller";


export class GameWizard {
  #_stepper;
  #_player;
  //
  #_gameParams;
  #_defaultGameParams = {};

  #_settingsControllers = new GroupController();

  constructor(onClose, submitGame) {
    this.onClose = onClose;
    this.submitGame = submitGame;
    this.player = new Player(self.user.id, self.user.username);
    this.initGameParams();
  }

  set stepper(stepper) {
    this.#_stepper = stepper;
  }

  get stepper() {
    return this.#_stepper;
  }

  set player(player) {
    this.#_player = player;
  }

  get player() {
    return this.#_player;
  }

  initGameParams() {
    this.#_gameParams = {};
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
    this.defaultGameParams = controller.data;
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

  getGameParamsForWizard(wizardName) {
    return Object.keys(this.gameParams).includes(wizardName) ? this.gameParams[wizardName] : undefined;
  }

  initLevelWizard() {
    this.settingsControllers = new LevelWizard(this.onGameSettingsChange.bind(this), this.getGameParamsForWizard(WIZARD_NAME.levelSettings));
  }

  initOptionsWizard() {
    //console.log(this.getGameParamsForWizard(WIZARD_NAME.optionsSettings));
    this.settingsControllers = new OptionsWizard(this.onGameSettingsChange.bind(this), this.getGameParamsForWizard(WIZARD_NAME.optionsSettings));
  }

  generateWizard() {
    const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
    wizardContainer.append(this.generateWizardHeader());
    wizardContainer.append(this.generateContentSection());
    wizardContainer.append(this.stepper.generateStepper());
    return wizardContainer;
  }

  generateWizardHeader() {
    const wizardHeader = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardHeader]);
    const closeBnt = ElementGenerator.generateButton(CLOSE_BTN, this.onClose.bind(this));
    wizardHeader.append(this.generateWizardTitle(), closeBnt);
    return wizardHeader;
  }

  generateWizardTitle() {
    const wizardTitle = document.createElement("h2");
    wizardTitle.innerHTML = this.title;
    return wizardTitle;
  }

  generateContentSection() {
    const wizardContent = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContent], DOM_ELEMENT_CLASS.wizardContent);
    wizardContent.append(this.generateContent());
    return wizardContent;
  }








  onGameSettingsChange(params) {
    // console.log("onGameSettingsChange");

    // console.log("---------------------------");
    // console.log("current: ", {...this.gameParams});

    this.stepper.submissionButtonDisabled = !params.valid;

    this.gameParams = params;
    // console.log("---------------------------");
    // console.log("new: ", this.gameParams);

    //console.log(params);
    //console.log("invalid re");
    // onGameSettingsChange

    // params.value.setMinesPositions();
    // console.log(params.value);
  }

  //
  get gameType() {
    return TYPOGRAPHY.emptyString;
  }

  get title() {
    return TYPOGRAPHY.emptyString;
  }

  get game() {
    return new Game(this.gameType, this.gameParams, this.player);
  }

  onSubmit() {
    console.log("onSubmit");

    console.log(this.game);
    //console.log(this.player);
    // player color
    //this.submitGame(this.game)
    return;
  }

  generateContent() {
    const fragment = document.createDocumentFragment();
    return fragment;
  }

  onReset() {
    return;
  }

  updateWizardContent() {
    this.contentContainer.then(contentContainer => {
      ElementHandler.clearContent(contentContainer);
      contentContainer.append(this.generateContent());
    });
  }

}
