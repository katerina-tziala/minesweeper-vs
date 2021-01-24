"use strict";
import { GameType, BotMode } from "GameEnums";
import { BotPlayer } from "GameModels";
import { WIZARD_NAME, BotModeWizard } from "GameWizardComponents";
import { GameWizardVS } from "./_game-wizard-vs";

export class GameWizardBot extends GameWizardVS {
  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.opponent = new BotPlayer();
  }

  get gameType() {
    return GameType.Bot;
  }

  get againstBot() {
    return true;
  }

  get #onBotMode() {
    return this.wizardStepName === WIZARD_NAME.botMode;
  }

  #initBotModeWizard() {
    if (this.gameParams && this.gameParams.botMode && this.gameParams.botMode.botMode) {
      this.opponent.mode = this.gameParams.botMode.botMode;
    }
    const controller = new BotModeWizard(
      this.#onBotModeChange.bind(this),
      this.opponent.mode,
    );
    this.settingsControllers = controller;
    return controller;
  }

  #onBotModeChange(params) {
    this.opponent.mode = params.value.botMode;
    this.onGameSettingsChange(params);
  }

  resetStepValues() {
    super.resetStepValues();
    if (this.#onBotMode) {
      this.opponent.mode = BotMode.Easy;
    }
  }

  generateMainContent() {
    if (this.#onBotMode) {
      const fragment = document.createDocumentFragment();
      const botWizard = this.#initBotModeWizard();
      fragment.append(botWizard.generateSettingsWizard());
      return fragment;
    }

    return super.generateMainContent();
  }

}
