"use strict";
import { GameType, BotMode, BotPlayer } from "Game";

import { GameWizardVS } from "./_game-wizard-vs";

import { TITLE } from "../game-wizard.constants";
import { WIZARD_NAME, BotModeWizard } from "../../game-settings-wizard/@game-settings-wizard.module";

export class GameWizardVSBot extends GameWizardVS {

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.opponent = new BotPlayer();
    this.init();
  }

  get gameType() {
    return GameType.Bot;
  }

  get title() {
    return TITLE[this.gameType];
  }

  get onVsMode() {
    return this.wizardStepName === WIZARD_NAME.vsModeSettings;
  }

  initBotModeWizard() {
    return new BotModeWizard(this.onBotModeChange.bind(this), this.opponent.mode);
  }

  generateContent() {
    const fragment = super.generateContent();
    if (this.onVsMode) {
      const botWizard = this.initBotModeWizard();
      fragment.append(botWizard.generateSettingsWizard());
    }
    return fragment;
  }

  onBotModeChange(params) {
    this.opponent.mode = params.value.botMode;
  }

  resetStepValues() {
    super.resetStepValues();
    if (this.onVsMode) {
      this.opponent.mode = BotMode.Easy;
    }
  }

}
