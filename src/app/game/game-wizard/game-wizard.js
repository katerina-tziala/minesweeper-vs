"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DropdownSelect, Switcher } from "UserInputs";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { OptionsSettings, LevelSettings, Player } from "Game";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BUTTONS } from "./game-wizard.constants";

import { LevelWizard, OptionsWizard, VSModeWizard, TurnSettingsWizard } from "Game";

export class GameWizard {
  #player;
  #settingsWizards = {};
  #gameSettings = {};

  constructor(onClose, submitGame) {
    this.onClose = onClose;
    this.submitGame = submitGame;
    this.player = new Player(self.user.id, self.user.username);
  }

  set player(player) {
    this.#player = player;
  }

  get player() {
    return this.#player;
  }

  // get wizardTitleElement() {
  //     return ElementHandler.getByID(DOM_ELEMENT_ID.wizardTitle);
  // }

  // get wizardContentElement() {
  //     return ElementHandler.getByID(DOM_ELEMENT_ID.wizardContent);
  // }

  // get wizardActionsElement() {
  //     return ElementHandler.getByID(DOM_ELEMENT_ID.wizardActions);
  // }

  // get playBtn() {
  //     return ElementHandler.getByID(DOM_ELEMENT_ID.playButton);
  // }

  // setSettingsWizards(name, wizard, keepOne = false) {
  //     if (keepOne) {
  //         this.#settingsWizards = {};
  //     } else {
  //         delete this.#settingsWizards[name];
  //     }
  //     this.#settingsWizards[name] = wizard;
  // }

  // get settingsWizards() {
  //     return Object.values(this.#settingsWizards);
  // }

  // setGameSettings(name, settings) {
  //     delete this.#gameSettings[name];
  //     this.#gameSettings[name] = settings;
  // }

  // getGameSettings(name) {
  //     return this.#gameSettings[name];
  // }

  // get gameSettings() {
  //     return this.#gameSettings;
  // }

  // getSettingsWizardByName(key) {
  //     return this.#settingsWizards[key];
  // }

  // get optionsSettings() {
  //     return this.getGameSettings("optionsSettings");
  // }

  // get levelSettings() {
  //     return this.getSettingsWizardByName("levelSettings").settings;
  // }

  // get gameParams() {
  //     return {
  //         id: this.type,
  //         levelSettings: this.levelSettings,
  //         optionsSettings: this.optionsSettings
  //     };
  // }

  // initGameSettings() {
  //     this.setLevelSettings();
  //     this.setOptionsSettings();
  // }

  // setLevelSettings() {
  //     const currentLevelSettings = LocalStorageHelper.retrieve("levelSettings");
  //     const levelSettings = new LevelSettings();
  //     if (currentLevelSettings) {
  //         levelSettings.update(currentLevelSettings);
  //     }
  //     this.setGameSettings("levelSettings", levelSettings);
  // }

  // setOptionsSettings() {
  //     this.setGameSettings("optionsSettings", this.getInitialOptionsSettings());
  // }

  // getInitialOptionsSettings() {
  //     const optionsSettings = new OptionsSettings();
  //     return this.updateOptionSettingsWithSelectedValues(optionsSettings);
  // }

  // updateOptionSettingsWithSelectedValues(optionsSettings) {
  //     const currentOptionsSettings = LocalStorageHelper.retrieve("optionsSettings");
  //     if (currentOptionsSettings) {
  //         const updateData = {};
  //         Object.keys(optionsSettings).forEach(key => {
  //             if (currentOptionsSettings[key] !== undefined) {
  //                 updateData[key] = currentOptionsSettings[key];
  //             }
  //         });
  //         optionsSettings.update(updateData);
  //     }
  //     return optionsSettings;
  // }

  renderWizard() {
    // this.init();
    const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
    // const sdf = new LevelWizard(this.onLevelSettingsChange.bind(this));
    // wizardContainer.append(sdf.generateSettingsWizard());
    // const asd = new VSModeWizard(this.onVSModeChange.bind(this));
    // wizardContainer.append(asd.generateSettingsWizard());
    // const asd = new OptionsWizard(this.onOptionsChange.bind(this));
    // wizardContainer.append(asd.generateSettingsWizard());

    const asds = new TurnSettingsWizard(this.onOptionsChange.bind(this));
    wizardContainer.append(asds.generateSettingsWizard());

    // wizardContainer.append(this.generateWizardHeader());
    // const wizardContent = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContent], DOM_ELEMENT_CLASS.wizardContent);
    // this.renderWizardContent(wizardContent);
    // wizardContainer.append(wizardContent);
    // wizardContainer.append(this.generateWizardActions());
    console.log("wizard");
    return wizardContainer;
  }


  onLevelSettingsChange(params) {
    this.settings[params.name] = params.value;
    console.log(params);
    // params.value.setMinesPositions();
    // console.log(params.value);
  }

  onVSModeChange(params) {
    console.log(params);
  }

  onOptionsChange(params) {
    console.log(params);
  }
  // generateWizardHeader() {
  //     const wizardHeader = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardHeader]);
  //     const closeBnt = ElementGenerator.generateButton(BUTTONS.close, this.onClose.bind(this));
  //     wizardHeader.append(this.generateWizardTitle(), closeBnt);
  //     return wizardHeader;
  // }

  // generateWizardTitle() {
  //     const wizardTitle = document.createElement("h2");
  //     ElementHandler.setID(wizardTitle, DOM_ELEMENT_ID.wizardTitle);
  //     wizardTitle.innerHTML = this.title;
  //     return wizardTitle;
  // }

  // generateWizardActions() {
  //     const actionsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.actionsContainer], DOM_ELEMENT_ID.wizardActions);
  //     this.addActions(actionsContainer);
  //     return actionsContainer;
  // }

  // addActions(actionsContainer) {
  //     const buttons = this.getWizardActionButtons();
  //     buttons.forEach(button => actionsContainer.append(button));
  // }

  // generateResetButton() {
  //     return ElementGenerator.generateButton(BUTTONS.reset, this.onReset.bind(this));
  // }

  // generatePlayButton() {
  //     return ElementGenerator.generateButton(this.playButtonParams, this.onPlay.bind(this));
  // }

  // onValidation(valid) {
  //     if (this.submissionPrevented !== !valid) {
  //         this.submissionPrevented = !valid;
  //         this.updateSubmissionButton();
  //     }
  // }

  // // OVERRIDEN FUNCTIONS
  // get title() {
  //     return TYPOGRAPHY.emptyString;
  // }

  // get type() {
  //     return undefined;
  // }

  // get playButtonParams() {
  //     return BUTTONS.play;
  // }

  // init() {
  //     this.submissionPrevented = false;
  //     this.initGameSettings();
  //     this.setCurrentWizards();
  // }

  // generateLevelWizard() {
  //     return new LevelWizard(this.onValidation.bind(this), this.getGameSettings("levelSettings"));
  // }

  // generateOptionsWizard() {
  //     return new OptionsWizard(this.optionsSettings, this.onValidation.bind(this));
  // }

  // setCurrentWizards() {
  //     return;
  // }

  // renderWizardContent(wizardContent) {
  //     return;
  // }

  // getWizardActionButtons() {
  //     return [];
  // }

  // resetWizard() {
  //     return;
  // }

  // onReset() {
  //     return;
  // }

  // onPlay() {
  //     return;
  // }

  // updateSubmissionButton() {
  //     this.playBtn.then(btn => ElementHandler.setDisabled(btn, this.submissionPrevented));
  // }

}
