"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DropdownSelect, Switcher } from "UserInputs";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { OptionsSettings, LevelSettings, Player } from "Game";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CLOSE_BTN } from "./game-wizard.constants";

import { LevelWizard, OptionsWizard, VSModeWizard, TurnSettingsWizard } from "../game-settings-wizard/@game-settings-wizard.module";

import { GameWizardStepper } from "./game-wizard-stepper/game-wizard-stepper";

export class GameWizard {
  #player;


  constructor(onClose, submitGame) {
    this.onClose = onClose;
    this.submitGame = submitGame;
    this.player = new Player(self.user.id, self.user.username);
    this.stepper = new GameWizardStepper({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this)
    });


    // this.stepper = new GameWizardStepper({
    //   onReset: this.onReset.bind(this),
    //   onSubmit: this.onSubmit.bind(this),
    //   onStepChange: this.onStepChange.bind(this),
    // }, 3);
  }


  set player(player) {
    this.#player = player;
  }

  get player() {
    return this.#player;
  }

  renderWizard() {
    // this.init();
    const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
    //
    console.log("implement game wizards");
    // const sdf = new LevelWizard(this.onGameSettingsChange.bind(this));
    // wizardContainer.append(sdf.generateSettingsWizard());

    // const asd = new VSModeWizard(this.onGameSettingsChange.bind(this));
    // wizardContainer.append(asd.generateSettingsWizard());

    // const assd = new OptionsWizard(this.onGameSettingsChange.bind(this));
    // wizardContainer.append(assd.generateSettingsWizard());

    // const asds = new TurnSettingsWizard(this.onGameSettingsChange.bind(this));
    // wizardContainer.append(asds.generateSettingsWizard());

    wizardContainer.append(this.generateWizardHeader());
    // const wizardContent = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContent], DOM_ELEMENT_CLASS.wizardContent);
    // this.renderWizardContent(wizardContent);
    // wizardContainer.append(wizardContent);

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
    wizardTitle.innerHTML = "this.title";
    return wizardTitle;
  }

  onGameSettingsChange(params) {
    console.log("onGameSettingsChange");
    console.log(params);
    // params.value.setMinesPositions();
    // console.log(params.value);
  }

  onReset() {
    console.log("onReset");
  }

  onStepChange(step) {
    console.log("onStepChange");
    console.log(step);
  }

  onSubmit() {
    console.log("onSubmit");
  }

}
