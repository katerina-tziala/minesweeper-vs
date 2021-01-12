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

  get gameType() {
    return GameType.Original;
  }

  get title() {
    return TITLE[this.gameType];
  }

  #init() {
    this.initLevelWizard();
    this.initOptionsWizard();
  }

  onReset() {
    this.initGameParams();
    this.#init();
    this.rerenderCurrentMainView();
  }

  generateMainContent() {
    const fragment = document.createDocumentFragment();
    this.settingsControllers.forEach((controller) =>
      fragment.append(controller.generateSettingsWizard()),
    );
    return fragment;
  }

  generateActions() {
    const fragment = super.generateActions();
    fragment.append(this.wizardActions.generateView());
    return fragment;
  }
}
