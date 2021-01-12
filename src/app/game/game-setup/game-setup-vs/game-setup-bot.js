"use strict";
import { GameType, BotMode } from "GameEnums";
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

  #onBotModeChange(params) {
    this.opponent.mode = params.value.botMode;
  }

  get gameType() {
    return GameType.Bot;
  }

  get title() {
    return TITLE[this.gameType];
  }

  resetStepValues() {
    super.resetStepValues();
    if (this.#onBotMode) {
      this.opponent.mode = BotMode.Easy;
    }
  }

  generateMainContent() {
    const fragment = document.createDocumentFragment();
    if (this.#onBotMode) {
      const botWizard = this.#initBotModeWizard();
      fragment.append(botWizard.generateSettingsWizard());
    } else {
      fragment.append(super.generateMainContent());
    }
    return fragment;
  }

}
