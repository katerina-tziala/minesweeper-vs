"use strict";

import { GameType } from "GameEnums";
import { GameWizardStepper } from "GameWizardStepper";

import { GameSetup } from "../game-setup";
import { TITLE } from "../game-setup.constants";

export class GameSetupOriginal extends GameSetup {

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.stepper = new GameWizardStepper({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this)
    });
    this.#init();
  }

  #init() {
    this.initLevelWizard();
    this.initOptionsWizard();
  }

  onReset() {
    this.initGameParams();
    this.#init();
    this.updateWizardContent();
  }

  // OVERIDDEN FUNCTIONS
  get gameType() {
    return GameType.Original;
  }

  get title() {
    return TITLE[this.gameType];
  }

  generateContent() {
    const fragment = document.createDocumentFragment();
    this.settingsControllers.forEach(controller => fragment.append(controller.generateSettingsWizard()));
    return fragment;
  }

  generateStepperSection() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.stepper.generateStepper());
    return fragment;
  }
}
