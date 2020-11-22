"use strict";

import { GameType } from "Game";

import { GameWizard } from "./game-wizard";
import { TITLE} from "./game-wizard.constants";

import { GameWizardStepper } from "./game-wizard-stepper/game-wizard-stepper";
export class GameWizardOriginal extends GameWizard {

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.stepper = new GameWizardStepper({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this)
    });
    this.init();
  }

  get gameType() {
    return GameType.Original;
  }

  get title() {
    return TITLE[this.gameType];
  }

  init() {
    this.initLevelWizard();
    this.initOptionsWizard();
  }

  generateContent() {
    const fragment = document.createDocumentFragment();
    this.settingsControllers.forEach(controller => fragment.append(controller.generateSettingsWizard()));
    return fragment;
  }

  onReset() {
    this.initGameParams();
    this.init();
    this.updateWizardContent();
  }

}
