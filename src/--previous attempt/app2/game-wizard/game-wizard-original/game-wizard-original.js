"use strict";

import { GameType } from "GameEnums";
import { GameWizardActions } from "GameWizardComponents";
import { GameWizard } from "../_game-wizard";

export class GameWizardOriginal extends GameWizard {
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

  #init() {
    this.initLevelWizard();
    this.initOptionsWizard();
  }

  onReset() {
    this.initGameParams();
    this.#init();
    this.rerenderCurrentMainView();
    this.wizardActions.updateResetAndSubmissionButton(true, false);
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
