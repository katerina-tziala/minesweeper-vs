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
  // #_opponent;
  #_gameParams;
  #_defaultGameParams = {};

  #_settingsControllers = new GroupController();

  constructor(onClose, submitGame) {
    this.onClose = onClose;
    this.submitGame = submitGame;
    this.player = new Player(self.user.id, self.user.username);
    // this.opponent = undefined;
    this.initGameParams();

    // this.stepper = new GameWizardStepper({
    //   onReset: this.onReset.bind(this),
    //   onSubmit: this.onSubmit.bind(this),
    //   onStepChange: this.onStepChange.bind(this),
    // }, 3);
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


  // set opponent(opponent) {
  //   this.#_opponent = opponent;
  // }

  // get opponent() {
  //   return this.#_opponent;
  // }



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
    this.settingsControllers = new OptionsWizard(this.onGameSettingsChange.bind(this), this.getGameParamsForWizard(WIZARD_NAME.optionsSettings));
  }


  generateWizard() {
    const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
    // const asd = new VSModeWizard(this.onGameSettingsChange.bind(this));
    // wizardContainer.append(asd.generateSettingsWizard());

    // const asds = new TurnSettingsWizard(this.onGameSettingsChange.bind(this));
    // wizardContainer.append(asds.generateSettingsWizard());

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
    console.log("onGameSettingsChange");

    this.stepper.submissionButtonDisabled = !params.valid;
    this.gameParams = params;

    console.log(params);
    //console.log("invalid re");
    // onGameSettingsChange

    // params.value.setMinesPositions();
    // console.log(params.value);
  }



  // onStepChange(step) {
  //   console.log("onStepChange");
  //   console.log(step);
  // }

  //
  generateContent() {
    const fragment = document.createDocumentFragment();
    return fragment;
  }

  get gameType() {
    return TYPOGRAPHY.emptyString;
  }


  get title() {
    return TYPOGRAPHY.emptyString;
  }

  onReset() {
    this.contentContainer.then(contentContainer => {
      ElementHandler.clearContent(contentContainer);
      contentContainer.append(this.generateContent());
    });
  }

  get game() {
    return new Game(this.gameType, this.gameParams, this.player);
  }

  onSubmit() {
    console.log("onSubmit");

    console.log(this.game);

    this.submitGame(this.game)
    return;
  }

}
