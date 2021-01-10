"use strict";
import { GameType, BotMode } from "GameEnums";
import { BotPlayer } from "GameModels";

import { GameSetupVS } from "./_game-setup-vs";

import { TITLE } from "../game-setup.constants";
import { WIZARD_NAME, BotModeWizard } from "GameSettingsWizard";

import { GameVSMode } from "GameEnums";
export class GameSetupBot extends GameSetupVS {
  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.opponent = new BotPlayer();
    this.init();
  }

  get againstBot() {
    return true;
  }
  get #onBotMode() {
    return this.wizardStepName === WIZARD_NAME.botMode;
  }

  #initBotModeWizard() {
    return new BotModeWizard(
      this.#onBotModeChange.bind(this),
      this.opponent.mode,
    );
  }


  generateWizardSteps(selectedMode) {
    const steps = super.generateWizardSteps(selectedMode);
    steps.unshift(WIZARD_NAME.botMode);
    return steps;
  }


  #onBotModeChange(params) {
    this.opponent.mode = params.value.botMode;
  }

  get gameType() {
    return GameType.Bot;
  }

  get title() {
    return TITLE[this.gameType];
  }

  generateContent() {
    const fragment = document.createDocumentFragment();
    if (this.#onBotMode) {
      const botWizard = this.#initBotModeWizard();
      fragment.append(botWizard.generateSettingsWizard());
    } else {
      fragment.append(super.generateContent());
    }
    return fragment;
  }

  resetStepValues() {
    super.resetStepValues();
    if (this.#onBotMode) {
      this.opponent.mode = BotMode.Easy;
    }
  }

}
