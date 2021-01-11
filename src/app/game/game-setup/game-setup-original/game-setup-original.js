"use strict";

import { GameType } from "GameEnums";

import { GameSetup } from "../game-setup";
import { TITLE } from "../game-setup.constants";
import { GameWizardActions } from "~/game-wizard/game-wizard-actions/game-wizard-actions";

export class GameSetupOriginal extends GameSetup {
  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.wizardActions = new GameWizardActions({
      onReset: this.onReset.bind(this),
      onSubmit: this.onSubmit.bind(this),
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
    this.settingsControllers.forEach((controller) =>
      fragment.append(controller.generateSettingsWizard()),
    );
    return fragment;
  }

  generateWizardActions() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.wizardActions.generateView());
    return fragment;
  }
}
