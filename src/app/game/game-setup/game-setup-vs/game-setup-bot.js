"use strict";
import { GameType } from "GameEnums";
import { BotPlayer } from "GameModels";

import { GameSetupVS } from "./_game-setup-vs";

import { TITLE } from "../game-setup.constants";
import { WIZARD_NAME, BotModeWizard } from "GameSettingsWizard";

export class GameSetupBot extends GameSetupVS {
  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.opponent = new BotPlayer();
    this.init();
  }

  get #onVsMode() {
    return this.wizardStepName === WIZARD_NAME.vsModeSettings;
  }

  #initBotModeWizard() {
    return new BotModeWizard(
      this.#onBotModeChange.bind(this),
      this.opponent.mode,
    );
  }

  #onBotModeChange(params) {
    this.opponent.mode = params.value.botMode;
  }

  // OVERIDDEN FUNCTIONS
  get gameType() {
    return GameType.Bot;
  }

  get title() {
    return TITLE[this.gameType];
  }

  generateContent() {
    const fragment = super.generateContent();
    if (this.#onVsMode) {
      const botWizard = this.#initBotModeWizard();
      fragment.append(botWizard.generateSettingsWizard());
    }
    return fragment;
  }

  resetStepValues() {
    super.resetStepValues();
    if (this.#onVsMode) {
      this.opponent.mode = BotMode.Easy;
    }
  }
}
